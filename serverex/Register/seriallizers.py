from django.contrib.auth.tokens import default_token_generator
from Register.models import CustomUser,OneTimeCode
from django.utils import timezone
from rest_framework import serializers
from django.core.mail import send_mail
import pyotp
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'date_joined','date_of_birth')

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            date_of_birth=validated_data['date_of_birth'],
            email=validated_data['email'],
            is_active=False,
        )
        user.set_password(validated_data['password'])
        user.save()

        self.send_one_time_code(user)
        return user

    def send_one_time_code(self, user):
        # OneTimeCode.objects.filter(user=user).delete()

        totp = pyotp.TOTP(pyotp.random_base32(), digits=6)
        code = totp.now()

        one_time_code = OneTimeCode.objects.update_or_create(user=user, defaults={'code': code, 'user': user})

        send_mail(
            'Ваш одноразовый код',
            f'Ваш одноразовый код для подтверждения аккаунта: {code}',
            'from@example.com',
            [user.email],
            fail_silently=False,
        )

    def validate(self, data):
        if data['date_of_birth'] >= timezone.now().date():
            raise serializers.ValidationError('Дата рождения не может быть бoльше текущей')
        return data
class ResendCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value

    def send_new_code(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)

        if user.is_active:
            raise serializers.ValidationError("Этот аккаунт уже подтвержден.")

        serializer = RegisterSerializer()
        serializer.send_one_time_code(user)
        return {"detail": "Новый одноразовый код отправлен на ваш email."}

class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = CustomUser.objects.get(email=data['email'])
            one_time_code = OneTimeCode.objects.get(user=user)
        except (CustomUser.DoesNotExist, OneTimeCode.DoesNotExist):
            raise serializers.ValidationError("Неверный email или одноразовый код.")

        if one_time_code.code != data['code']:
            raise serializers.ValidationError("Неверный одноразовый код.")
        return data

    def verify_code(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        user.is_active = True
        user.save()
        return user

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value

    def send_reset_email(self):
        user = CustomUser.objects.get(email=self.validated_data['email'])
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:3000/reset-password/{user.pk}/{token}/"


        send_mail(
            "Восстановление пароля",
            f"Чтобы сбросить пароль, перейдите по ссылке: {reset_link}",
            'from@example.com',
            [user.email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = CustomUser.objects.get(pk=data['user_id'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Пользователь не найден.")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Неверный токен.")

        return data

    def set_new_password(self):
        user = CustomUser.objects.get(pk=self.validated_data['user_id'])
        user.set_password(self.validated_data['new_password'])
        user.save()