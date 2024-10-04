from django.urls import path
from .views import *


app_name = 'accounts'
urlpatterns = [
    # path('kakao_login_success/', kakao_login_success),
    path('signup/', signup), 
    path('logout/', logout), 
    path('friend/', friend), 
    path('get_token/', get_token), 
]
