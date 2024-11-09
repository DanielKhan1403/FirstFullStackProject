from django.urls import path
from . import views




urlpatterns = [
    path('files/', views.FileListCreateView.as_view(), name='file-list-create'),
    path('files/<uuid:pk>/', views.FileDetailView.as_view(), name='file-detail'),
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
    path('directories/', views.DirectoryListCreateView.as_view(), name='directory-list-create'),
    path('directories/<uuid:id>/', views.DirectoryDetailView.as_view(), name='directory-detail'),
    path('access-links/', views.AccessLinkListCreateView.as_view(), name='access-link-create'),
    path('access-links/<uuid:pk>/', views.AccessLinkDetailView.as_view(), name='access-link-detail'),
    path('access-links/<uuid:pk>/disable/', views.AccessLinkDisableView.as_view(), name='access-link-disable'),
]
