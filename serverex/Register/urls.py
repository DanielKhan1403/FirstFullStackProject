from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from Register.views import RegisterAPIView, VerifyCodeAPIView, ResendCodeAPIView, ResetPasswordConfirmView, \
    PasswordResetView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('verify-code/', VerifyCodeAPIView.as_view(), name='verify_code'),
    path('resend-code/', ResendCodeAPIView.as_view(), name='resend_code'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('reset-password/<int:user_id>/<str:token>/', ResetPasswordConfirmView.as_view(),
         name='reset-password-confirm'),
]