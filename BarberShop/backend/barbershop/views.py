from rest_framework import viewsets
from .models import (
    Role, Profile,
    Barberia, Servicio, Barbero,
    BarberiaServicio, BarberoServicio,
    Cita, HorarioBarberia, Pago, Resena, BloqueoBarbero
)
from .serializers import (
    RoleSerializer, ProfileSerializer,
    BarberiaSerializer, ServicioSerializer, BarberoSerializer,
    BarberiaServicioSerializer, BarberoServicioSerializer,
    CitaSerializer, HorarioBarberiaSerializer,
    PagoSerializer, ResenaSerializer, BloqueoBarberoSerializer
)


# ========= ROLES / USUARIOS =========

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    """
    Este es tu endpoint de USUARIOS.
    /api/usuarios/  -> Profile
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


# ========= NÚCLEO =========

class BarberiaViewSet(viewsets.ModelViewSet):
    queryset = Barberia.objects.all()
    serializer_class = BarberiaSerializer


class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer


class BarberoViewSet(viewsets.ModelViewSet):
    queryset = Barbero.objects.all()
    serializer_class = BarberoSerializer


class BarberiaServicioViewSet(viewsets.ModelViewSet):
    queryset = BarberiaServicio.objects.all()
    serializer_class = BarberiaServicioSerializer


class BarberoServicioViewSet(viewsets.ModelViewSet):
    queryset = BarberoServicio.objects.all()
    serializer_class = BarberoServicioSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer


# ========= HORARIOS =========

class HorarioBarberiaViewSet(viewsets.ModelViewSet):
    queryset = HorarioBarberia.objects.all()
    serializer_class = HorarioBarberiaSerializer


# ========= PAGOS =========

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


# ========= RESEÑAS =========

class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer


# ========= BLOQUEOS BARBERO =========

class BloqueoBarberoViewSet(viewsets.ModelViewSet):
    queryset = BloqueoBarbero.objects.all()
    serializer_class = BloqueoBarberoSerializer
