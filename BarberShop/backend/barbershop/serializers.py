from rest_framework import serializers
from .models import (
    Role, Profile,
    Barberia, Servicio, Barbero,
    BarberiaServicio, BarberoServicio,
    Cita, HorarioBarberia, Pago, Resena, BloqueoBarbero
)

# ========= ROLES / USUARIOS =========

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    # Mostrar el código de rol en vez de solo el id
    role_code = serializers.CharField(source="role.role_code", read_only=True)
    # Campo password: solo escritura, nunca se retorna en GET
    password = serializers.CharField(write_only=True, required=False, allow_blank=False, min_length=6)
    # Campo para recibir role_code al crear/actualizar
    role_code_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = [
            "id_profile",
            "role",
            "role_code",
            "role_code_input",
            "id_barberia",
            "full_name",
            "email",  # ✨ NUEVO
            "password",  # ✨ NUEVO (write_only)
            "phone",
            "avatar_url",
            "is_active",
            "created_at",
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'role': {'required': False}  # No requerido porque usaremos role_code_input
        }
    
    def create(self, validated_data):
        """Crear perfil con contraseña hasheada"""
        password = validated_data.pop('password', None)
        role_code_input = validated_data.pop('role_code_input', None)
        
        # Obtener rol por código
        if role_code_input:
            from barbershop.models import Role
            try:
                role = Role.objects.get(role_code=role_code_input)
                validated_data['role'] = role
            except Role.DoesNotExist:
                raise serializers.ValidationError(f"Role with code '{role_code_input}' does not exist")
        
        # Si no hay role en validated_data, establecer CLIENTE por defecto
        if 'role' not in validated_data:
            from barbershop.models import Role
            validated_data['role'] = Role.objects.get(role_code='CLIENTE')
        
        profile = Profile(**validated_data)
        
        if password:
            profile.set_password(password)
        
        profile.save()
        return profile
    
    def update(self, instance, validated_data):
        """Actualizar perfil, opcionalmente cambiar contraseña"""
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


# ========= NÚCLEO =========

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = "__all__"


class BarberiaServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberiaServicio
        fields = "__all__"


class BarberiaSerializer(serializers.ModelSerializer):
    barberos = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = Barberia
        fields = "__all__"


class BarberoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barbero
        fields = "__all__"


class BarberoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberoServicio
        fields = "__all__"


class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = "__all__"
    
    def create(self, validated_data):
        # Si no se proporciona estado, usar 'pendiente' por defecto (lowercase según constraint)
        if 'estado' not in validated_data or validated_data['estado'] is None:
            validated_data['estado'] = 'pendiente'
        return super().create(validated_data)


# ========= HORARIOS =========

class HorarioBarberiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioBarberia
        fields = "__all__"


# ========= PAGOS =========

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = "__all__"


# ========= RESEÑAS =========

class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = "__all__"


# ========= BLOQUEOS BARBERO =========

class BloqueoBarberoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloqueoBarbero
        fields = "__all__"
