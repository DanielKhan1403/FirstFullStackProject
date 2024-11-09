from django.contrib import admin

from Register.models import CustomUser, OneTimeCode

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(OneTimeCode)