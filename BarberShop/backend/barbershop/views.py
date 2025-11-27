from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Endpoint de autenticación: POST /api/usuarios/login/
        Body: { "email": "...", "password": "..." }
        """
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile = Profile.objects.get(email=email)
            
            if not profile.is_active:
                return Response(
                    {'error': 'Usuario inactivo'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if not profile.check_password(password):
                return Response(
                    {'error': 'Credenciales incorrectas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            serializer = self.get_serializer(profile)
            return Response({
                'user': serializer.data,
                'message': 'Login exitoso'
            })
            
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )


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
