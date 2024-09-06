from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError    
    

class User(AbstractUser):
    user_key = models.CharField(max_length=36, null=False, blank=False)
    email = models.EmailField()
