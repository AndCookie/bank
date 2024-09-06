import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from shinhan_api.request import post


def issued_api_key():
    """
    앱 API KEY 발급
    """
    url = "edu/app/issuedApiKey/"
    body = {"managerId": "oodeng98@naver.com"}
    return post(url, body)


def re_issued_api_key():
    """
    앱 API KEY 재발급
    """
    url = "edu/app/reIssuedApiKey/"
    body = {"managerId": "oodeng98@naver.com"}
    return post(url, body)
    

if __name__ == "__main__":
    issued_api_key()
    # print(re_issued_api_key())