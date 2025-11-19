from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RoleViewSet, ProfileViewSet,
    BarberiaViewSet, ServicioViewSet, BarberoViewSet,
    BarberiaServicioViewSet, BarberoServicioViewSet,
    CitaViewSet, HorarioBarberiaViewSet,
    PagoViewSet, ResenaViewSet, BloqueoBarberoViewSet,
)

router = DefaultRouter()

router.register(r"roles", RoleViewSet)
router.register(r"usuarios", ProfileViewSet)
router.register(r"barberias", BarberiaViewSet)
router.register(r"servicios", ServicioViewSet)
router.register(r"barberos", BarberoViewSet)
router.register(r"barberia-servicios", BarberiaServicioViewSet)
router.register(r"barbero-servicios", BarberoServicioViewSet)
router.register(r"citas", CitaViewSet)
router.register(r"horarios-barberia", HorarioBarberiaViewSet)
router.register(r"pagos", PagoViewSet)
router.register(r"resenas", ResenaViewSet)
router.register(r"bloqueos-barbero", BloqueoBarberoViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
