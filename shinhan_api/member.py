from shinhan_api.request import post
from dotenv import load_dotenv
import os


load_dotenv()
API_KEY = os.getenv('API_KEY')


def signup(email):
    """
    2.2.1 사용자 계정 생성
    """
    url = "member"
    body = {"apiKey": API_KEY, "userId": email}
    '''
    {'userId': 'oodeng98@gmail.com', 'userName': 'oodeng98', 'institutionCode': '00100', 'userKey': '62ce827d-2f7e-49be-b77d-9482df614445', 'created': '2024-08-17T12:05:41.879020702+09:00', 'modified': '2024-08-17T12:05:41.879020702+09:00'}
    '''
    return post(url, body)


def search(email):
    """
    2.2.2 사용자 계정 조회
    """
    url = "member/search"
    body = {"apiKey": API_KEY, "userId": email}
    '''
    {'userId': 'oodeng98@naver.com', 'userName': 'oodeng98', 'institutionCode': '00100', 'userKey': '6bd20a95-537b-48b6-9684-20511f7edf89', 'created': '2024-08-17T12:04:43.125979+09:00', 'modified': '2024-08-17T12:04:43.125976+09:00'}
    '''
    return post(url, body)
    

if __name__ == "__main__":
    # signup("oodeng98@naver.com")
    print(search("oodeng98@naver.com"))