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
    # Mostrar el código de rol en vez de solo el id si quieres
    role_code = serializers.CharField(source="role.role_code", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id_profile",
            "role",
            "role_code",
            "full_name",
            "phone",
            "avatar_url",
            "is_active",
            "created_at",
        ]


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
