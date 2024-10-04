from django.urls import path
from .views import *


app_name = 'accounts'
urlpatterns = [
    # path('kakao_login_success/', kakao_login_success),
    path('login/', login), 
    path('signup/', signup), 
    path('logout/', logout), 
    path('friend/', friend), 
    path('send_message/', send_message), 
    path('kakao_callback/', kakao_callback), 
    path('get_token/', get_token), 
]
