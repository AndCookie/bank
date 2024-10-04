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
from django.shortcuts import redirect
from django.conf import settings
from social_django.models import UserSocialAuth
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

from pprint import pprint


User = get_user_model()


def signup(kakao_user_info):
    username = kakao_user_info['username']
    id = kakao_user_info['id']
    email = kakao_user_info['email']
    data = {
        "username": username, "password": id
    }
    serializer = UserCreationSerializer(data=data)
    response = shinhan_signup(email)
    flag = 1
    if 'userKey' in response:
        data['user_key'] = response['userKey']
    else:
        data['user_key'] = search(email)['userKey']
        flag = 0

    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        serializer = UserSerializer(user)
        if flag:
            create_demand_deposit_account(email)
        return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "이미 존재하는 사용자 이메일 혹은 닉네임입니다."}, status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def kakao_callback(request):
    code = request.GET.get('code')
    if os.getenv('DJANGO_ENV') == 'production':
        return redirect(f"{settings.SOCIAL_AUTH_LOGIN_REDIRECT_URL}/?code={code}")
    ######################
    # 인가 코드를 사용해 액세스 토큰 발급
    access_token = get_kakao_access_token(code)
    if not access_token:
        return Response({"error": 'access_token 발급 실패'}, status=status.HTTP_204_NO_CONTENT)
    
    # 액세스 토큰을 사용해 사용자 정보 조회
    kakao_user_info = get_kakao_user_info(access_token)
    if not kakao_user_info:
        return Response({"error": 'user_info 조회 실패'}, status=status.HTTP_204_NO_CONTENT)

    kakao_user_id = kakao_user_info['id']

    try:
        social_user = UserSocialAuth.objects.get(provider='kakao', uid=kakao_user_id)
        user = social_user.user
    except UserSocialAuth.DoesNotExist:
        user = User.objects.create(username=f'kakao_{kakao_user_id}')
        signup(kakao_user_info)
        UserSocialAuth.objects.create(user=user, provider='kakao', uid=kakao_user_id)

    auth_login(request, user)
    social = request.user.social_auth.get(provider='kakao')
    social.extra_data['access_token'] = access_token
    social.save()
    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_200_OK)
    ######################


@api_view(['POST'])
def get_token(request):
    code = request.data.get('code')
    
    # 인가 코드를 사용해 액세스 토큰 발급
    access_token = get_kakao_access_token(code)
    if not access_token:
        return Response({"error": 'access_token 발급 실패'}, status=status.HTTP_204_NO_CONTENT)
    social = request.user.social_auth.get(provider='kakao')
    social.extra_data['access_token'] = access_token
    social.save()
    
    kakao_user_info = get_kakao_user_info(access_token)
    if not kakao_user_info:
        return Response({"error": 'user_info 조회 실패'}, status=status.HTTP_204_NO_CONTENT)
    
    return Response({"token": access_token, 'user_info': kakao_user_info}, status=status.HTTP_200_OK)
    # 액세스 토큰을 사용해 사용자 정보 조회
    kakao_user_info = get_kakao_user_info(access_token)
    if not kakao_user_info:
        return Response({"error": 'user_info 조회 실패'}, status=status.HTTP_204_NO_CONTENT)

    kakao_user_id = kakao_user_info['id']

    try:
        social_user = UserSocialAuth.objects.get(provider='kakao', uid=kakao_user_id)
        user = social_user.user
    except UserSocialAuth.DoesNotExist:
        user = User.objects.create(username=f'kakao_{kakao_user_id}')
        signup(kakao_user_info)
        UserSocialAuth.objects.create(user=user, provider='kakao', uid=kakao_user_id)

    auth_login(request, user)
    social = request.user.social_auth.get(provider='kakao')
    social.extra_data['access_token'] = access_token
    social.save()
    token, created = Token.objects.get_or_create(user=user)
    
    print(token)
    return Response({"token": token.key}, status=status.HTTP_200_OK)


def get_kakao_access_token(code):
    url = 'https://kauth.kakao.com/oauth/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'authorization_code',
        'client_id': f'{settings.SOCIAL_AUTH_KAKAO_KEY}',
        'code': code,
    }

    response = requests.post(url, headers=headers, data=data)
    
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        return None
    
    
def get_kakao_user_info(access_token):
    url = 'https://kapi.kakao.com/v2/user/me'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None


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
    access_token = social.extra_data['access_token']
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(url, headers=headers)
    pprint(response.json())
    data = []
    for i in response.json()['elements']:
        temp = {'profile_nickname': i['profile_nickname'], 
                'profile_thumbnail_image': i['profile_thumbnail_image'], 
                'id': i['id'], 
                'uuid': i['uuid'], 
                }
        data.append(temp)
    if response.status_code == 200:
        return Response(data, status=status.HTTP_200_OK)
    if response.status_code == 401:
        return Response({'error': "카카오 로그인이 필요합니다."}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'error': [response.status_code, response.text]}, status=status.HTTP_400_BAD_REQUEST)
