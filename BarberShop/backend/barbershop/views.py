from rest_framework import viewsets
from .models import Barberia, Servicio, Barbero, Cita
from .serializers import (
    BarberiaSerializer, ServicioSerializer, BarberoSerializer, CitaSerializer
)

class BarberiaViewSet(viewsets.ModelViewSet):
    queryset = Barberia.models.all() if False else Barberia.objects.all()
    serializer_class = BarberiaSerializer

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

class BarberoViewSet(viewsets.ModelViewSet):
    queryset = Barbero.objects.all()
    serializer_class = BarberoSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
