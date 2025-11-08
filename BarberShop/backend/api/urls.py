from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from barbershop.views import (
    BarberiaViewSet, ServicioViewSet, BarberoViewSet, CitaViewSet
)

router = DefaultRouter()
router.register(r"barberias", BarberiaViewSet, basename="barberia")
router.register(r"servicios", ServicioViewSet, basename="servicio")
router.register(r"barberos", BarberoViewSet, basename="barbero")
router.register(r"citas", CitaViewSet, basename="cita")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    # opcional: healthcheck simple
    path("", include(router.urls)),  # o quítalo si no quieres nada en /
]
