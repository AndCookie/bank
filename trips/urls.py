from django.urls import path
from .views import *


app_name = 'trips'
urlpatterns = [
    path('', create_trip), 
    path('ongoing/', ongoing), 
    path('finish/', finish), 
    path('main/', trip_main), 
    path('member/', member), 
    path('budget/', budget), 
    path('save_image/', save_image), 
]
