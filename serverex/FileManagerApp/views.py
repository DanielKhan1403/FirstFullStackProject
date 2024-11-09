from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Directory, File, AccessLink
from .serializers import DirectorySerializer, FileSerializer, AccessLinkSerializer
from django.conf import settings
# Представления для Directory
class DirectoryListCreateView(generics.ListCreateAPIView):
    serializer_class = DirectorySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Directory.objects.filter(user=self.request.user)
        else:
            return self.get_access_queryset()

    def get_access_queryset(self):
        access_token = self.request.GET.get('access_token')
        if access_token:
            try:
                access_link = AccessLink.objects.get(token=access_token)
                if access_link.is_valid():

                    if access_link.token_type == 'view':
                        return Directory.objects.filter(is_public=True)

                    elif access_link.token_type == 'edit':
                        raise PermissionDenied("Для редактирования необходимо зарегистрироваться.")
            except AccessLink.DoesNotExist:
                raise NotFound("Неверная ссылка доступа.")
        raise PermissionDenied("Для доступа к директориям нужно зарегистрироваться или предоставить корректную ссылку.")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DirectoryDetailView(generics.RetrieveAPIView):
    serializer_class = DirectorySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return Directory.objects.filter(pk=self.kwargs['id'])

    def get_object(self):
        directory = super().get_object()
        access_token = self.request.GET.get('access_token')
        if access_token:
            access_link = AccessLink.objects.filter(token=access_token, directory=directory).first()
            if access_link and access_link.is_valid():
                if access_link.token_type == 'view' or (access_link.token_type == 'edit' and self.request.user.is_authenticated):
                    return directory
                elif access_link.token_type == 'edit':
                    raise PermissionDenied("Для редактирования необходимо войти в аккаунт.")
            else:
                raise NotFound("Неверная или истекшая ссылка.")
        return directory


# Представления для File
class FileListCreateView(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return File.objects.filter(user=self.request.user)
        else:
            return self.get_access_queryset()

    def get_access_queryset(self):
        access_token = self.request.GET.get('token')
        if access_token:
            try:
                access_link = AccessLink.objects.get(token=access_token)
                if access_link.is_valid():
                    if access_link.token_type == 'view':
                        return File.objects.filter(is_public=True)
                    elif access_link.token_type == 'edit':
                        raise PermissionDenied("Для редактирования необходимо зарегистрироваться.")
            except AccessLink.DoesNotExist:
                raise NotFound("Неверная ссылка доступа.")
        raise PermissionDenied("Для доступа к файлам нужно зарегистрироваться или предоставить корректную ссылку.")

    def perform_create(self, serializer):
        directory = serializer.validated_data.get('directory')
        if not directory:
            root_directory, _ = Directory.objects.get_or_create(
                user=self.request.user, name="Root", parent_directory=None
            )
            serializer.save(user=self.request.user, directory=root_directory)
        else:
            serializer.save(user=self.request.user)


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

    def get_object(self):
        file = super().get_object()
        access_token = self.request.GET.get('access_token')
        if access_token:
            access_link = AccessLink.objects.filter(token=access_token, file=file).first()
            if access_link and access_link.is_valid():
                if access_link.token_type == 'view' or (access_link.token_type == 'edit' and self.request.user.is_authenticated):
                    return file
                elif access_link.token_type == 'edit':
                    raise PermissionDenied("Для редактирования необходимо войти в аккаунт.")
            else:
                raise NotFound("Неверная или истекшая ссылка.")
        return file




class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)


        if 'file' not in request.data:
            return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)


        if file_serializer.is_valid():
            file_serializer.save(user=request.user)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccessLinkListCreateView(generics.ListCreateAPIView):
    serializer_class = AccessLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return AccessLink.objects.filter(user=self.request.user)

    def perform_create(self, serializer):

        access_link = serializer.save(user=self.request.user)

        frontend_url = f"{settings.SITE_URL}/access/{access_link.token}"
        access_link.frontend_url = frontend_url
        access_link.save()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)


        response_data = {
            "link": serializer.data,
            "frontend_url": serializer.instance.frontend_url,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class AccessLinkDisableView(generics.DestroyAPIView):
    serializer_class = AccessLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return AccessLink.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):

        instance.delete()


class AccessLinkDetailView(generics.RetrieveAPIView):
    serializer_class = AccessLinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        token = self.kwargs.get('pk')
        access_link = AccessLink.objects.filter(token=token).first()

        if not access_link:
            raise NotFound("Access link not found.")

        return AccessLink.objects.filter(token=token)

    def get_object(self):
        return self.get_queryset().first()