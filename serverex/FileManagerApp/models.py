import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
class Directory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('Register.CustomUser', on_delete=models.CASCADE, related_name='directories',null=True, blank=True)
    name = models.CharField(max_length=100)
    parent_directory = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subdirectories')
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('Register.CustomUser', on_delete=models.CASCADE, related_name='files',null=True, blank=True)
    file = models.FileField(upload_to='files')
    name = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    directory = models.ForeignKey(Directory, on_delete=models.CASCADE, null=True, blank=True, related_name='files')
    is_public = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.file.name

        if self.file:
            self.file_size = self.file.size

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class AccessLink(models.Model):
    TOKEN_TYPE_CHOICES = [
        ('view', 'Просмотр'),
        ('edit', 'Редактирование'),
    ]

    directory = models.ForeignKey(Directory, on_delete=models.CASCADE, related_name='access_links')
    token_type = models.CharField(max_length=10, choices=TOKEN_TYPE_CHOICES)
    expiration_date = models.DateTimeField(default=timezone.now() + timedelta(days=7))
    user = models.ForeignKey('Register.CustomUser', on_delete=models.CASCADE, null=True, blank=True,
                             related_name='access_links')


    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    def is_valid(self):
        return self.expiration_date > timezone.now()

    def __str__(self):
        return f"{self.token} ({self.get_token_type_display()}) - истекает {self.expiration_date}"

    def get_directory_name(self):
        return self.directory.name if self.directory else 'Unknown Directory'