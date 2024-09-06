# views.py (callback 처리 부분)
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status

class KFTCCallbackView(APIView):
    def get(self, request):
        # 금융결제원이 리다이렉트한 후 전달한 인증 코드
        authorization_code = request.GET.get('code')

        if not authorization_code:
            return Response({"error": "Authorization code not found"}, status=status.HTTP_400_BAD_REQUEST)

        # 액세스 토큰을 요청할 URL
        token_url = 'https://api.kftc.or.kr/oauth/token'

        # 액세스 토큰 요청 파라미터
        data = {
            'grant_type': 'authorization_code',
            'code': authorization_code,
            'redirect_uri': 'https://yourdomain.com/auth/kftc/callback',  # 등록된 리다이렉트 URI
            'client_id': settings.KFTC_CLIENT_ID,
            'client_secret': settings.KFTC_CLIENT_SECRET,
        }

        # 액세스 토큰 요청
        response = requests.post(token_url, data=data)
        token_data = response.json()

        if response.status_code == 200:
            # 액세스 토큰 발급 성공
            access_token = token_data.get('access_token')
            return Response(token_data)  # 클라이언트에 토큰 데이터를 반환하거나 저장
        else:
            return Response(token_data, status=status.HTTP_400_BAD_REQUEST)


# 카드 결제 내역을 조회하는 API 호출
class KFTCTransactionView(APIView):
    def get(self, request):
        access_token = request.headers.get('Authorization')

        if not access_token:
            return Response({"error": "Access token missing"}, status=status.HTTP_400_BAD_REQUEST)

        # 금융결제원 API 호출
        api_url = 'https://api.kftc.or.kr/card/transaction-history'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(api_url, headers=headers)
        transaction_data = response.json()

        if response.status_code == 200:
            return Response(transaction_data)
        else:
            return Response(transaction_data, status=status.HTTP_400_BAD_REQUEST)
