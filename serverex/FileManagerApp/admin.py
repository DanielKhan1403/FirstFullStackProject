from django.contrib import admin

from FileManagerApp.models import File, Directory, AccessLink

# Register your models here.

admin.site.register(File)
admin.site.register(Directory)
admin.site.register(AccessLink)

