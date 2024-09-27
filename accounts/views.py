from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserCreationSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import login as auth_login
from shinhan_api.member import signup as shinhan_signup, search
from shinhan_api.demand_deposit import create_demand_deposit_account
from rest_framework.authtoken.models import Token
import requests
from social_django.utils import load_strategy
from social_core.backends.kakao import KakaoOAuth2


User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def kakao_login_success(request):
    user = request.user
    user.backend = 'social_core.backends.kakao.KakaoOAuth2'
    auth_login(request, user)

    token, created = Token.objects.get_or_create(user=user)

    return Response({'token': token.key}, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    auth_logout(request)
    return Response({"message": "로그아웃 완료"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def friend(request):
    url = 'https://kapi.kakao.com/v1/api/talk/friends'
    
    social = request.user.social_auth.get(provider='kakao')
    access_token =  social.extra_data['access_token']
    
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return Response(response.json(), status=status.HTTP_200_OK)
    else:
        return Response({'error': [response.status_code, response.text]}, status=status.HTTP_400_BAD_REQUEST)
