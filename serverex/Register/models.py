from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)

    REQUIRED_FIELDS = [
        'date_of_birth',
        'email'
    ]



class OneTimeCode(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} - {self.code}'