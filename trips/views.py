from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import TripCreateSerializer, TripSerializer, TripMainSerializer, MemberDetailSerializer
from .models import Trip, Member
from django.utils import timezone
from accounts.serializers import UserSerializer


User = get_user_model()

@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def create_trip(request):
    if request.method == 'POST':
        serializer = TripCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            trip = serializer.save()
            Member.objects.create(trip=trip, user=request.user, bank_account=request.data.get('bank_account'))
            return Response({'data': {"id": trip.pk}}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        trip_id = request.data.get('trip_id')
        try:
            trip = Trip.objects.get(pk=trip_id)
        except Trip.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TripCreateSerializer(trip, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            trip = serializer.save()
            return Response({'data': {"id": trip.pk}}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ongoing(request):
    if request.method == 'GET':
        current_date = timezone.now().date()
        trips = Trip.objects.filter(
            member__user=request.user,
            end_date__gte=current_date
        ).order_by('start_date')
        serializer = TripSerializer(trips, many=True)
        if serializer.data:
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': "예정되거나 진행중인 여행이 없습니다."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def finish(request):
    if request.method == 'GET':
        current_date = timezone.now().date()
        trips = Trip.objects.filter(
            member__user=request.user,
            end_date__lt=current_date
        ).order_by('start_date')
        serializer = TripSerializer(trips, many=True)
        data = serializer.data
        if serializer.data:
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': "완료된 여행이 없습니다."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trip_main(request):
    if request.method == 'GET':
        trip_id = request.GET.get('trip_id')
        try:
            trip = Trip.objects.get(pk=trip_id)
        except Trip.DoesNotExist:
            return Response({'error': '해당 아이디에 해당하는 Trip이 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        if not Member.objects.filter(trip=trip_id, user=request.user).exists():
            return Response({'error': "현재 사용자는 해당 여행에 참여하지 않았습니다."}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = TripMainSerializer(trip)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def member(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        if not email:
            email = request.user.email

        try:
            user = User.objects.get(email=email)
        except:
            return Response({"error": "해당 이메일을 사용하는 사용자가 없습니다."}, status=status.HTTP_204_NO_CONTENT)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        email = request.data.get('email')
        trip_id = request.data.get('trip_id')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': '해당 사용자를 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        trip = Trip.objects.get(pk=trip_id)
        if Member.objects.filter(trip=trip, user=user).exists():
            return Response({'error': '이 사용자는 이미 이 여행에 초대되었습니다.'}, status=status.HTTP_400_BAD_REQUEST)
        Member.objects.create(trip=trip, user=user)
        members = Member.objects.filter(trip=trip)
        serializer = MemberDetailSerializer(members, many=True)
        data = serializer.data
        return Response({'data': data}, status=status.HTTP_201_CREATED)
    
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def budget(request):
    if request.method == 'PUT':
        trip_id = request.data.get('trip_id')
        budget = request.data.get('budget')
        member = Member.objects.get(trip_id=trip_id, user=request.user)
        member.budget = budget
        member.save()
        return Response({'data': {'budget': budget}}, status=status.HTTP_202_ACCEPTED)
        
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_image(request):
    if request.method == 'POST':
        trip_id = request.data.get('trip_id')
        if not Member.objects.filter(trip=trip_id, user=request.user).exists():
            return Response({'error': "현재 사용자는 해당 여행에 참여하지 않았습니다."}, status=status.HTTP_401_UNAUTHORIZED)
        trip = Trip.objects.get(id=trip_id)
        trip.image_url = request.data.get('image_url')
        trip.save()
        return Response({'message': "image url이 성공적으로 저장되었습니다."}, status=status.HTTP_202_ACCEPTED)
    