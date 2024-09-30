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

    return Response(token.key, status=status.HTTP_202_ACCEPTED)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def send_message(request):
    social = request.user.social_auth.get(provider='kakao')
    access_token =  social.extra_data['access_token']

    # 친구의 uuid (friends_list에서 받아온 값)
    friend_uuid = 'qZupnKWRppW5iLqKsoO3gbWEqJmom6-ZoJLx'  # 추후 수정해야함, 지금은 임광영

    url = "https://kapi.kakao.com/v1/api/talk/friends/message/send"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    # 메시지 템플릿 데이터
    data = {
        'receiver_uuids': f'["{friend_uuid}"]',  # 친구의 uuid 배열
        'template_id': '112658', 
        'trip_name': "둠파디파"
    }

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        return Response({"message": "메시지가 성공적으로 전송되었습니다."}, status=status.HTTP_200_OK)
    else:
        return Response({"Error": response.status_code, "Error Message": response.text}, status=status.HTTP_403_FORBIDDEN)