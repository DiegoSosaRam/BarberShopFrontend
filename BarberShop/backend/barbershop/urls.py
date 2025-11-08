from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BarberiaViewSet, ServicioViewSet, BarberoViewSet, CitaViewSet

router = DefaultRouter()
router.register(r'barberias', BarberiaViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'barberos', BarberoViewSet)
router.register(r'citas', CitaViewSet)

urlpatterns = [ path('', include(router.urls)) ]
