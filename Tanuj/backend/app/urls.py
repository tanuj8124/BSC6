from django.urls import path
from .views import QueryAPIView, UploadPDFAPIView, ListFilesAPIView, DeleteFileAPIView, download_pdf

urlpatterns = [
    path('api/query/', QueryAPIView.as_view(), name='query-api'),
    path('api/upload-pdf/', UploadPDFAPIView.as_view(), name='upload-pdf'),
    path("api/list-files/", ListFilesAPIView.as_view(), name="list-files"),
    path("api/delete-file/", DeleteFileAPIView.as_view(), name="delete-file"),
    path("download/<str:filename>/", download_pdf, name="download_pdf"),
]

