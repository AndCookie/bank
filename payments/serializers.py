from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Payment, Calculate
from trips.models import Member, Trip
from shinhan_api.demand_deposit import update_demand_deposit_account_Transfer as transfer
from shinhan_api.demand_deposit import inquire_demand_deposit_account_balance as balance

User = get_user_model()


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'pay_date', 'pay_time', 'brand_name', 'category', 'bank_account']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation
    
    
class CalculateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='member.user.username', read_only=True)
    
    class Meta:
        model = Calculate
        fields = ['username', 'cost']
        
        
class PaymentDetailSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Payment
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        bank_account = representation['bank_account']

        user = Member.objects.filter(bank_account=bank_account).first().user
        representation['username'] = user.username
        
        calculates = Calculate.objects.filter(payment=instance)
        if calculates.exists():
            representation['is_completed'] = 1 if all(c.is_complete for c in calculates) else 0
            representation['calculates'] = CalculateSerializer(calculates, many=True).data
        else:
            representation['is_completed'] = 0
        return representation


class BillSerializer(serializers.Serializer):
    cost = serializers.IntegerField()
    bank_account = serializers.CharField(max_length=30)


class PaymentSerializer(serializers.Serializer):
    payment_id = serializers.IntegerField()
    bills = serializers.ListField(child=BillSerializer())


class CalculateCreateSerializer(serializers.Serializer):
    trip_id = serializers.IntegerField()
    payments = serializers.ListField(child=PaymentSerializer())

    def create(self, validated_data):
        trip_id = validated_data['trip_id']
        
        for payment_data in validated_data['payments']:
            payment_id = payment_data['payment_id']
            
            # 동일한 정산이 반복되는 경우 하나만 처리하도록
            if Calculate.objects.filter(payment_id=payment_id).exists():
                continue
            
            bills_data = payment_data['bills']
            payment = Payment.objects.get(id=payment_id)
            
            # 정산 총 금액이 결제 금액과 다를 경우
            if payment.amount != sum(bills_data, key=lambda x: x['cost']):
                continue
            
            deposit_bank_account = payment.bank_account
            for bill_data in bills_data:
                cost = bill_data['cost']
                withdrawal_bank_account = bill_data['bank_account']
                is_complete = False
                # 아래 조건에 해당되면 정산 가격만 기록하고 금액 전송은 안함
                # 보내는 사람과 받는 사람이 같은 경우, 정산 금액이 없는 경우
                if deposit_bank_account == withdrawal_bank_account or (cost == 0 or cost == '0'):
                    is_complete = True
                    Calculate.objects.create(
                        payment=payment,
                        member=member,
                        cost=cost, 
                        is_complete=is_complete
                    )
                    continue
                
                try:
                    member = Member.objects.get(trip=trip_id, bank_account=withdrawal_bank_account)
                except Member.DoesNotExist:
                    continue
                
                # 금액 이체 로직 호출
                response = transfer(member.user.email, deposit_bank_account, withdrawal_bank_account, cost)
                if 'REC' not in response:
                    is_complete = True
                    
                Calculate.objects.create(
                    payment=payment,
                    member=member,
                    cost=cost,
                    is_complete=is_complete
                )

        budget = {}
        trip = Trip.objects.get(id=trip_id)
        members = Member.objects.filter(trip=trip)
        start_date = trip.start_date
        end_date = trip.end_date
        for member in members:
            user_id = member.user.user_id
            initial_budget = member.budget
            used_budget = sum(Calculate.objects.filter(
                member=member,
                payment__pay_date__gte=start_date,
                payment__pay_date__lte=end_date
                ).values_list('cost', flat=True))
            remain_budget = initial_budget - used_budget
            budget[user_id] = {"initial_budget": initial_budget, "used_budget": used_budget, "remain_budget": remain_budget}
        
        return budget
