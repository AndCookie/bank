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
import json
from django.shortcuts import redirect
from django.conf import settings
from pprint import pprint


User = get_user_model()

@api_view(['GET'])
def login(request):
    auth_login(request, request.user)

    token, created = Token.objects.get_or_create(user=request.user)

    return Response(token.key, status=status.HTTP_200_OK)


@api_view(['GET'])
def kakao_login(request):
    kakao_auth_url = "https://kauth.kakao.com/oauth/authorize"
    client_id = settings.KAKAO_CLIENT_ID
    redirect_uri = settings.KAKAO_REDIRECT_URI

    # 카카오 로그인 페이지로 리다이렉트
    return redirect(f"{kakao_auth_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code")


@api_view(['GET'])
def kakao_callback(request):
    # 카카오에서 받은 authorization code
    code = request.GET.get('code')
    print(code)
    # Access Token 요청
    token_url = "https://kauth.kakao.com/oauth/token"
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': settings.SOCIAL_AUTH_KAKAO_KEY,
        'redirect_uri': settings.SOCIAL_AUTH_KAKAO_REDIRECT_URI,
        'code': code,
        'client_secret': settings.SOCIAL_AUTH_KAKAO_SECRET,
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    print(token_json)
    if 'access_token' in token_json:
        access_token = token_json['access_token']

        # Access Token을 통해 사용자 정보 요청
        user_info_url = "https://kapi.kakao.com/v2/user/me"
        headers = {
            'Authorization': f'Bearer {access_token}',
        }
        user_info_response = requests.get(user_info_url, headers=headers)
        user_info = user_info_response.json()

        # 사용자 정보 처리
        kakao_id = user_info.get('id')
        kakao_account = user_info.get('kakao_account')
        pprint(kakao_account)
        # Django 사용자 생성 또는 조회
        # user, created = User.objects.get_or_create(username=kakao_id, defaults={'kakao_id': kakao_id})
        user, created = User.objects.get_or_create(username=kakao_id)

        auth_login(request, user)
        token, _ = Token.objects.get_or_create(user=user)

        #  프론트엔드로 토큰 반환
        return Response({'token': token.key}, status=200)

    return Response({'error': 'Failed to get access token'}, status=400)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    social = request.user.social_auth.get(provider='kakao')
    access_token =  social.extra_data['access_token']

    friend_uuid = request.data.get('uuid')
    friend_uuid = 'qZupnKWRppW5iLqKsoO3gbWEqJmom6-ZoJLx'  # 추후 수정해야함, 지금은 임광영

    url = "https://kapi.kakao.com/v1/api/talk/friends/message/send"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    template_args = {
        'trip_name': request.data.get('trip_name'), 
        'trip_id': request.data.get('trip_id'), 
    }
    
    template_args = {
            'trip_name': "둠파디파", 
            'trip_id': "5"
        }
    # 메시지 템플릿 데이터
    data = {
        'receiver_uuids': f'["{friend_uuid}"]',  # 친구의 uuid 배열
        'template_id': '112658', 
        'template_args': json.dumps(template_args), 
    }

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        return Response({"message": "메시지가 성공적으로 전송되었습니다."}, status=status.HTTP_200_OK)
    else:
        return Response({"Error": response.status_code, "Error Message": response.text}, status=status.HTTP_403_FORBIDDEN)