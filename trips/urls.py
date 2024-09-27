from django.urls import path
from .views import *


app_name = 'trips'
urlpatterns = [
    path('', create_trip), 
    path('list/', list), 
    path('detail/', detail), 
    path('member/', member), 
    path('budget/', budget), 
    path('save_image/', save_image), 
]
