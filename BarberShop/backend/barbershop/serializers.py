from rest_framework import serializers
from .models import Barberia, Servicio, Barbero, Cita, BarberiaServicio

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

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = "__all__"
