from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from barbershop.views import (
    RoleViewSet, ProfileViewSet,
    BarberiaViewSet, ServicioViewSet, BarberoViewSet,
    BarberiaServicioViewSet, BarberoServicioViewSet,
    CitaViewSet, HorarioBarberiaViewSet,
    PagoViewSet, ResenaViewSet, BloqueoBarberoViewSet,
)

router = DefaultRouter()

# Usuarios / roles
router.register(r"roles", RoleViewSet, basename="role")
router.register(r"usuarios", ProfileViewSet, basename="usuario")

# Núcleo
router.register(r"barberias", BarberiaViewSet, basename="barberia")
router.register(r"servicios", ServicioViewSet, basename="servicio")
router.register(r"barberos", BarberoViewSet, basename="barbero")
router.register(r"barberia-servicios", BarberiaServicioViewSet, basename="barberia-servicio")
router.register(r"barbero-servicios", BarberoServicioViewSet, basename="barbero-servicio")
router.register(r"citas", CitaViewSet, basename="cita")

# Horarios
router.register(r"horarios-barberia", HorarioBarberiaViewSet, basename="horario-barberia")

# Pagos
router.register(r"pagos", PagoViewSet, basename="pago")

# Reseñas
router.register(r"resenas", ResenaViewSet, basename="resena")

# Bloqueos de barbero
router.register(r"bloqueos-barbero", BloqueoBarberoViewSet, basename="bloqueo-barbero")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    # opcional: exponer también en raíz
    path("", include(router.urls)),
]
