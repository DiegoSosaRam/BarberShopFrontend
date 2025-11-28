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
    
    @action(detail=False, methods=['get'])
    def por_barberia(self, request):
        """Obtener servicios con precios para una barbería específica"""
        id_barberia = request.query_params.get('id_barberia')
        if not id_barberia:
            return Response(
                {'error': 'Se requiere el parámetro id_barberia'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener servicios activos con sus precios para esta barbería
        from django.db.models import Q
        
        servicios_con_precio = []
        barberia_servicios = BarberiaServicio.objects.filter(
            id_barberia=id_barberia
        ).select_related('id_servicio')
        
        for bs in barberia_servicios:
            servicio = bs.id_servicio
            servicios_con_precio.append({
                'id_servicio': servicio.id_servicio,
                'nombre_servicio': servicio.nombre_servicio,
                'description': servicio.description,
                'precio_BarbServ': float(bs.precio_BarbServ) if bs.precio_BarbServ else 0,
                'duracion_min': bs.duracion_min
            })
        
        return Response(servicios_con_precio)


class BarberoViewSet(viewsets.ModelViewSet):
    queryset = Barbero.objects.all()
    serializer_class = BarberoSerializer
    
    def get_queryset(self):
        """Permitir filtrar barberos por id_barberia"""
        queryset = Barbero.objects.all()
        id_barberia = self.request.query_params.get('id_barberia')
        if id_barberia:
            queryset = queryset.filter(id_barberia=id_barberia)
        return queryset.order_by('-calificacion')


class BarberiaServicioViewSet(viewsets.ModelViewSet):
    queryset = BarberiaServicio.objects.all()
    serializer_class = BarberiaServicioSerializer


class BarberoServicioViewSet(viewsets.ModelViewSet):
    queryset = BarberoServicio.objects.all()
    serializer_class = BarberoServicioSerializer


class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    @action(detail=False, methods=['get'])
    def por_cliente(self, request):
        """Obtener todas las citas de un cliente específico"""
        id_cliente = request.query_params.get('id_cliente')
        if not id_cliente:
            return Response(
                {'error': 'Se requiere el parámetro id_cliente'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        citas = Cita.objects.filter(id_cliente=id_cliente).select_related(
            'id_barbero', 'id_servicio', 'id_barberia'
        ).order_by('-inicio')
        
        # Enriquecer las citas con información de barbero, servicio, barbería, precio y duración
        citas_data = []
        for cita in citas:
            cita_dict = CitaSerializer(cita).data
            cita_dict['barbero_nombre'] = cita.id_barbero.nombre_barbero if cita.id_barbero else 'Sin asignar'
            cita_dict['servicio_nombre'] = cita.id_servicio.nombre_servicio if cita.id_servicio else 'Sin nombre'
            cita_dict['barberia_nombre'] = cita.id_barberia.nombre_barberia if cita.id_barberia else 'Sin barbería'
            
            # Buscar el precio y duración en barberia_servicios
            try:
                barberia_servicio = BarberiaServicio.objects.get(
                    id_barberia=cita.id_barberia,
                    id_servicio=cita.id_servicio
                )
                cita_dict['precio_BarbServ'] = float(barberia_servicio.precio_BarbServ) if barberia_servicio.precio_BarbServ else 0
                cita_dict['duracion_min'] = barberia_servicio.duracion_min or '30'
            except BarberiaServicio.DoesNotExist:
                cita_dict['precio_BarbServ'] = 0
                cita_dict['duracion_min'] = '30'
            
            citas_data.append(cita_dict)
        
        return Response(citas_data)

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancelar una cita"""
        cita = self.get_object()
        if cita.estado not in ['pendiente', 'aprobada']:
            return Response(
                {'error': 'Solo se pueden cancelar citas pendientes o aprobadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cita.estado = 'cancelada'
        cita.save()
        return Response(CitaSerializer(cita).data)

    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        """Aprobar una cita pendiente"""
        cita = self.get_object()
        if cita.estado != 'pendiente':
            return Response(
                {'error': 'Solo se pueden aprobar citas pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cita.estado = 'confirmada'
        cita.save()
        return Response({
            'message': 'Cita aprobada exitosamente',
            'cita': CitaSerializer(cita).data
        })

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        """Rechazar una cita pendiente"""
        cita = self.get_object()
        if cita.estado != 'pendiente':
            return Response(
                {'error': 'Solo se pueden rechazar citas pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        motivo = request.data.get('motivo', 'No especificado')
        cita.estado = 'rechazada'
        cita.motivo_rechazo = motivo
        cita.save()
        return Response({
            'message': 'Cita rechazada',
            'cita': CitaSerializer(cita).data
        })

    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        """Obtener todas las citas (pendientes, confirmadas, rechazadas) con información completa"""
        citas = Cita.objects.filter(
            estado__in=['pendiente', 'confirmada', 'rechazada']
        ).select_related(
            'id_barbero', 'id_servicio', 'id_barberia', 'id_cliente'
        ).order_by('-inicio')  # Más recientes primero
        
        citas_data = []
        for cita in citas:
            cita_dict = CitaSerializer(cita).data
            cita_dict['nombre_barbero'] = cita.id_barbero.nombre_barbero if cita.id_barbero else 'Sin asignar'
            cita_dict['nombre_servicio'] = cita.id_servicio.nombre_servicio if cita.id_servicio else 'Sin nombre'
            cita_dict['nombre_barberia'] = cita.id_barberia.nombre_barberia if cita.id_barberia else 'Sin barbería'
            cita_dict['nombre_usuario'] = cita.id_cliente.full_name if cita.id_cliente else 'Sin nombre'
            cita_dict['email_usuario'] = cita.id_cliente.email if cita.id_cliente else ''
            
            # Extraer fecha y hora del campo inicio
            if cita.inicio:
                cita_dict['fecha_cita'] = cita.inicio.strftime('%Y-%m-%d')
                cita_dict['hora_cita'] = cita.inicio.strftime('%H:%M')
            
            citas_data.append(cita_dict)
        
        return Response(citas_data)


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
