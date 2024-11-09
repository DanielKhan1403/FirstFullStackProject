from django.utils import timezone
from rest_framework import serializers
from .models import Directory, File, AccessLink



class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'user', 'file', 'name', 'file_size', 'directory', 'is_public']
        read_only_fields = ['file_size']


class DirectorySerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Directory
        fields = ['id', 'name', 'parent_directory', 'is_public', 'user', 'files']
        read_only_fields = ['user']
class AccessLinkSerializer(serializers.ModelSerializer):
    directory = DirectorySerializer(read_only=True)
    directory_id = serializers.CharField(write_only=True)
    class Meta:
        model = AccessLink
        fields = '__all__'

    def validate(self, data):

        if data['expiration_date'] <= timezone.now():
            raise serializers.ValidationError("Дата истечения не может быть в прошлом.")
        return data

    def create(self, validated_data):
        directory_id = validated_data.pop('directory_id')
        access_link = AccessLink.objects.create(directory_id=directory_id, **validated_data)
        return access_link



