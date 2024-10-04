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
from social_django.models import UserSocialAuth
from django.contrib.auth import authenticate


User = get_user_model()


@api_view(['POST'])
def login(request):
    user = authenticate(request, username=request.data.get('username'), password=request.data.get('username'))
    
    if user is not None:
        auth_login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)
    return Response({'error': "로그인 실패"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def signup(request):
    if request.method == "POST":
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            auth_login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def kakao_callback(request):
    code = request.GET.get('code')
    return redirect(f"{settings.SOCIAL_AUTH_LOGIN_REDIRECT_URL}/?code={code}")


@api_view(['POST'])
def get_token(request):
    code = request.data.get('code')
    
    # 인가 코드를 사용해 액세스 토큰 발급
    access_token = get_kakao_access_token(code)
    if not access_token:
        return Response({"error": 'login_failed'}, status=status.HTTP_204_NO_CONTENT)
    
    # 액세스 토큰을 사용해 사용자 정보 조회
    kakao_user_info = get_kakao_user_info(access_token)
    if not kakao_user_info:
        return Response({"error": 'login_failed'}, status=status.HTTP_204_NO_CONTENT)

    kakao_user_id = kakao_user_info['id']  # 카카오에서 제공하는 고유 ID

    try:
        social_user = UserSocialAuth.objects.get(provider='kakao', uid=kakao_user_id)
        user = social_user.user
    except UserSocialAuth.DoesNotExist:
        user = User.objects.create(username=f'kakao_{kakao_user_id}')
        UserSocialAuth.objects.create(user=user, provider='kakao', uid=kakao_user_id)

    auth_login(request, user)
    token, created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_200_OK)


def get_kakao_access_token(code):
    url = 'https://kauth.kakao.com/oauth/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'authorization_code',
        'client_id': '<YOUR_KAKAO_CLIENT_ID>',
        'redirect_uri': 'http://127.0.0.1:8000/api/auth/complete/kakao/',
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