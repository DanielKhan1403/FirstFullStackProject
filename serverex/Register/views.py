from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from Register.models import CustomUser
from Register.seriallizers import RegisterSerializer, VerifyCodeSerializer, ResendCodeSerializer, \
    PasswordResetSerializer, PasswordResetConfirmSerializer


# Create your views here.



class RegisterAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class VerifyCodeAPIView(generics.CreateAPIView):
    serializer_class = VerifyCodeSerializer
    def post(self, request, *args, **kwargs):
        serializer = VerifyCodeSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.verify_code()
            return Response({"message": "Ваш аккаунт успешно верифицирован.", "user": user.username},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class ResendCodeAPIView(generics.CreateAPIView):
    serializer_class = ResendCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = ResendCodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.send_new_code()
            return Response({"detail": "Новый одноразовый код отправлен на ваш email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordConfirmView(generics.CreateAPIView):
    serializer_class = PasswordResetConfirmSerializer
    def get(self, request, user_id, token):

        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        if default_token_generator.check_token(user, token):
            return Response({"message": "Токен подтверждён. Можно продолжить."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Неверный или истёкший токен."}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, user_id, token):


        try:
            user = CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        if default_token_generator.check_token(user, token):
            new_password = request.data.get("password")
            if not new_password:
                return Response({"error": "Пароль не может быть пустым"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Пароль успешно изменён"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Неверный или истёкший токен."}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(generics.CreateAPIView):
    serializer_class = PasswordResetSerializer
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.send_reset_email()
            return Response({"detail": "Ссылка для восстановления пароля отправлена на ваш email."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)