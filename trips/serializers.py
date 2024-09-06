from rest_framework import serializers
from .models import Trip, Location, Member
from django.contrib.auth import get_user_model
from shinhan_api.demand_deposit import inquire_demand_deposit_account_list as account_list
from shinhan_api.demand_deposit import inquire_demand_deposit_account as account

User = get_user_model()

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['country']

class MemberEmailSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email')
    
    class Meta:
        model = Member
        fields = ['email', 'bank_account']


class TripCreateSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, write_only=True)
    members = MemberEmailSerializer(many=True, write_only=True)

    class Meta:
        model = Trip
        fields = ['trip_name', 'start_date', 'end_date', 'locations', 'members']

    def create(self, validated_data):
        locations_data = validated_data.pop('locations')
        members_data = validated_data.pop('members')

        trip = Trip.objects.create(**validated_data)

        for location_data in locations_data:
            Location.objects.create(trip=trip, **location_data)

        for member_data in members_data:
            email = member_data['user']['email']
            bank_accounts = account_list(email)['REC']
            bank_account = ''
            for i in bank_accounts:
                if i['bankName'] == "신한은행":
                    bank_account = i['accountNo']
                    break
            try:
                user = User.objects.get(email=email)
                Member.objects.create(trip=trip, user=user, bank_account=bank_account)
            except User.DoesNotExist:
                continue  # 사용자 존재하지 않을 시 다음 멤버로 넘어감

        return trip

    def update(self, instance, validated_data):
        # 기존 Location과 Member 삭제
        Location.objects.filter(trip=instance).delete()
        Member.objects.filter(trip=instance).delete()
        
        locations_data = validated_data.pop('locations')
        members_data = validated_data.pop('members')

        # Trip의 기본 필드를 업데이트
        instance.trip_name = validated_data.get('trip_name', instance.trip_name)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.save()

        # 새로운 Location 데이터 추가
        for location_data in locations_data:
            Location.objects.create(trip=instance, **location_data)

        # 새로운 Member 데이터 추가
        for member_data in members_data:
            email = member_data['user']['email']
            bank_account = member_data['bank_account']
            try:
                user = User.objects.get(email=email)
                Member.objects.create(trip=instance, user=user, bank_account=bank_account)
            except User.DoesNotExist:
                continue

        return instance


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['locations'] = LocationSerializer(instance.location_set.all().order_by('country', 'city'), many=True).data
        return representation


class MemberDetailSerializer(serializers.ModelSerializer):
    member = serializers.CharField(source='user.username')
    class Meta:
        model = Member
        fields = ['member', 'bank_account']
        
        
class TripMainSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True, read_only=True)
    members = MemberDetailSerializer(many=True, read_only=True)
    class Meta:
        model = Trip
        fields = ['start_date', 'end_date', 'locations', 'members', "image_url"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['locations'] = LocationSerializer(instance.location_set.all().order_by('country', 'city'), many=True).data
        representation['members'] = MemberDetailSerializer(instance.member_set.all().order_by('user__username'), many=True).data
        for member in representation['members']:
            bank_account = member['bank_account']
            user = User.objects.get(username=member['member'])
            member_account = account(user.email, bank_account)['REC']
            member['bank_name'] = member_account['bankName']
            member['balance'] = member_account['accountBalance']
        return representation
