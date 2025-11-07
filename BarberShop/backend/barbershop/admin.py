from django.contrib import admin
from .models import (
    Role, Profile,
    Barberia, Servicio, Barbero,
    BarberiaServicio, BarberoServicio,
    Cita, HorarioBarberia, Pago, Resena, BloqueoBarbero
)

# ======= CATÁLOGOS / USERS =======

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id_role", "role_code")
    search_fields = ("role_code",)
    ordering = ("id_role",)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id_profile", "full_name", "role", "phone", "is_active", "created_at")
    list_filter = ("is_active", "role")
    search_fields = ("full_name", "phone")
    raw_id_fields = ("role",)
    ordering = ("-created_at",)


# ======= NÚCLEO =======

@admin.register(Barberia)
class BarberiaAdmin(admin.ModelAdmin):
    list_display = ("id_barberias", "nombre_barberia", "slug", "barberia_active", "created_at")
    list_filter = ("barberia_active",)
    search_fields = ("nombre_barberia", "slug", "direccion", "telefono")
    ordering = ("-created_at",)


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ("id_servicio", "nombre_servicio", "servicio_active", "created_at")
    list_filter = ("servicio_active",)
    search_fields = ("nombre_servicio", "description")
    ordering = ("-created_at",)


@admin.register(Barbero)
class BarberoAdmin(admin.ModelAdmin):
    list_display = ("id_barbero", "nombre_barbero", "id_barberia", "calificacion", "anios_experiencia", "created_at")
    list_filter = ("id_barberia",)
    search_fields = ("nombre_barbero", "especialidades")
    raw_id_fields = ("id_barberia",)
    ordering = ("-created_at",)


# Relaciones

@admin.register(BarberiaServicio)
class BarberiaServicioAdmin(admin.ModelAdmin):
    list_display = ("id", "id_barberia", "id_servicio", "precio_BarbServ", "duracion_min", "created_at")
    list_filter = ("id_barberia", "id_servicio")
    search_fields = ("id_barberia__nombre_barberia", "id_servicio__nombre_servicio")
    raw_id_fields = ("id_barberia", "id_servicio")
    ordering = ("id",)


@admin.register(BarberoServicio)
class BarberoServicioAdmin(admin.ModelAdmin):
    list_display = ("id", "id_barbero", "id_servicio", "created_at")
    list_filter = ("id_barbero", "id_servicio")
    search_fields = ("id_barbero__nombre_barbero", "id_servicio__nombre_servicio")
    raw_id_fields = ("id_barbero", "id_servicio")
    ordering = ("id",)


# Citas / Agenda / Pagos

@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ("id_cita", "id_cliente", "id_barbero", "id_servicio", "id_barberia", "inicio", "fin", "estado", "created_at")
    list_filter = ("estado", "id_barberia", "id_barbero", "id_servicio")
    search_fields = ("id_cliente__full_name", "id_barbero__nombre_barbero", "id_servicio__nombre_servicio", "id_barberia__nombre_barberia", "notas")
    raw_id_fields = ("id_cliente", "id_barbero", "id_servicio", "id_barberia", "creada_por", "aprobada_por", "rechazada_por")
    date_hierarchy = "inicio"
    ordering = ("-inicio",)


@admin.register(HorarioBarberia)
class HorarioBarberiaAdmin(admin.ModelAdmin):
    list_display = ("id_horario", "id_barberia", "dia_semana", "hora_apertura", "hora_cierre", "abierto", "created_at")
    list_filter = ("id_barberia", "dia_semana", "abierto")
    search_fields = ("id_barberia__nombre_barberia",)
    raw_id_fields = ("id_barberia",)
    ordering = ("id_horario",)


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ("pago_id", "id_cita", "monto", "estado", "proveedor", "referencia_proveedor", "created_at")
    list_filter = ("estado", "proveedor")
    search_fields = ("referencia_proveedor", "id_cita__id_cita")
    raw_id_fields = ("id_cita",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)


@admin.register(Resena)
class ResenaAdmin(admin.ModelAdmin):
    list_display = ("id_resenia", "id_cita", "id_barbero", "calificacion", "created_at")
    list_filter = ("calificacion", "id_barbero")
    search_fields = ("id_barbero__nombre_barbero", "id_cita__id_cita", "comentario")
    raw_id_fields = ("id_cita", "id_barbero")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)


@admin.register(BloqueoBarbero)
class BloqueoBarberoAdmin(admin.ModelAdmin):
    list_display = ("id_bloqueo", "id_barbero", "inicio", "fin", "motivo", "created_at")
    list_filter = ("id_barbero",)
    search_fields = ("id_barbero__nombre_barbero", "motivo")
    raw_id_fields = ("id_barbero",)
    date_hierarchy = "inicio"
    ordering = ("-inicio",)
