from django.urls import path
from .views import *


app_name = 'accounts'
urlpatterns = [
    path('kakao_login_success/', kakao_login_success),
    path('logout/', logout), 
    path('friend/', friend), 
    path('send_message/', send_message), 
]
