# barbershop/models.py
from django.db import models

# ==========================================================
# MODELO 'Role' AÑADIDO
# ==========================================================
class Role(models.Model):
    id_role = models.SmallAutoField(primary_key=True)
    role_code = models.TextField(unique=True, null=False, blank=False)

    class Meta:
        db_table = "roles"

    def __str__(self):
        return self.role_code
# ==========================================================

class Barberia(models.Model):
    id_barberias = models.BigAutoField(primary_key=True)
    nombre_barberia = models.TextField(null=True, blank=True)
    direccion = models.TextField(null=True, blank=True)
    telefono = models.TextField(null=True, blank=True)
    timezone = models.TextField(null=True, blank=True)
    slug = models.TextField(unique=True)
    portada_url = models.TextField(null=True, blank=True)
    barberia_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "barberias"

class Servicio(models.Model):
    id_servicio = models.BigAutoField(primary_key=True)
    nombre_servicio = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    servicio_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "servicios"

class Barbero(models.Model):
    id_barbero = models.BigAutoField(primary_key=True)
    id_barberia = models.ForeignKey(Barberia, on_delete=models.CASCADE, db_column="id_barberia", related_name="barberos")
    calificacion = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    nombre_barbero = models.TextField(null=True, blank=True)
    foto_url = models.TextField(null=True, blank=True)
    especialidades = models.TextField(null=True, blank=True)
    anios_experiencia = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "barberos"
        indexes = [
            models.Index(fields=["id_barberia", "id_barbero"]),
            models.Index(fields=["id_barberia", "id_barbero", "calificacion"]),
        ]

# ==========================================================
# MODELO 'BarberiaServicio' CORREGIDO
# ==========================================================
class BarberiaServicio(models.Model):
    # 1. Se añade la nueva PK 'id' que coincide con tu 'BIGSERIAL'
    id = models.BigAutoField(primary_key=True)
    
    # 2. Se mantienen las llaves foráneas
    id_barberia = models.ForeignKey(Barberia, on_delete=models.CASCADE, db_column="id_barberia")
    id_servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, db_column="id_servicio")
    
    # 3. Se mantienen los otros campos
    precio_BarbServ = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    duracion_min = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "barberia_servicios"
        # 4. Se mantiene la restricción de unicidad que creaste en SQL
        unique_together = (("id_barberia", "id_servicio"),)

# ==========================================================
# MODELO 'BarberoServicio' CORREGIDO
# ==========================================================
class BarberoServicio(models.Model):
    # 1. Se añade la nueva PK 'id'
    id = models.BigAutoField(primary_key=True)
    
    # 2. Se mantienen las llaves foráneas
    id_barbero = models.ForeignKey(Barbero, on_delete=models.CASCADE, db_column="id_barbero")
    id_servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, db_column="id_servicio")
    
    # 3. Se mantienen los otros campos
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "barbero_servicios"
        # 4. Se mantiene la restricción de unicidad
        unique_together = (("id_barbero", "id_servicio"),)

# ==========================================================
# MODELO 'Profile' CORREGIDO
# ==========================================================
class Profile(models.Model):
    id_profile = models.BigAutoField(primary_key=True)
    
    # Corregido: ForeignKey a Role usando la columna 'role_id'
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        db_column="role_id",
        null=False
    )
    
    full_name = models.TextField(null=True, blank=True)
    phone = models.TextField(null=True, blank=True)
    avatar_url = models.TextField(default="URL")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "profiles"
# ==========================================================

class Cita(models.Model):
    id_cita = models.BigAutoField(primary_key=True)
    id_cliente = models.ForeignKey(Profile, on_delete=models.PROTECT, db_column="id_cliente", related_name="citas")
    id_barbero = models.ForeignKey(Barbero, on_delete=models.PROTECT, db_column="id_barbero", related_name="citas")
    id_servicio = models.ForeignKey(Servicio, on_delete=models.PROTECT, db_column="id_servicio")
    id_barberia = models.ForeignKey(Barberia, on_delete=models.PROTECT, db_column="id_barberia")
    inicio = models.DateTimeField()
    fin = models.DateTimeField()
    estado = models.TextField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)
    creada_por = models.ForeignKey(Profile, on_delete=models.PROTECT, db_column="creada_por", related_name="citas_creadas", null=True, blank=True)
    aprobada_por = models.ForeignKey(Barbero, on_delete=models.PROTECT, db_column="aprobada_por", related_name="citas_aprobadas", null=True, blank=True)
    rechazada_por = models.ForeignKey(Barbero, on_delete=models.PROTECT, db_column="rechazada_por", related_name="citas_rechazadas", null=True, blank=True)
    motivo_rechazo = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "citas"
        indexes = [
            models.Index(fields=["id_barbero", "inicio", "fin"]),
            models.Index(fields=["id_cliente", "inicio"]),
            models.Index(fields=["id_barberia", "inicio"]),
        ]

class HorarioBarberia(models.Model):
    id_horario = models.BigAutoField(primary_key=True)
    id_barberia = models.ForeignKey(Barberia, on_delete=models.CASCADE, db_column="id_barberia", related_name="horarios")
    dia_semana = models.IntegerField()
    hora_apertura = models.TimeField()
    hora_cierre = models.TimeField()
    abierto = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "horarios_barberia"
        indexes = [models.Index(fields=["id_barberia", "dia_semana"])]

class Pago(models.Model):
    pago_id = models.BigAutoField(primary_key=True)
    id_cita = models.ForeignKey(Cita, on_delete=models.CASCADE, db_column="id_cita", related_name="pagos")
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    estado = models.TextField(null=True, blank=True)
    proveedor = models.TextField(null=True, blank=True)
    referencia_proveedor = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pagos"
        indexes = [
            models.Index(fields=["id_cita"]),
            models.Index(fields=["estado", "created_at"]),
        ]

class Resena(models.Model):
    id_resenia = models.BigAutoField(primary_key=True)
    id_cita = models.ForeignKey(Cita, on_delete=models.CASCADE, db_column="id_cita")
    id_barbero = models.ForeignKey(Barbero, on_delete=models.CASCADE, db_column="id_barbero")
    calificacion = models.IntegerField()
    comentario = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "resena"
        indexes = [models.Index(fields=["id_barbero", "-created_at"])]

class BloqueoBarbero(models.Model):
    id_bloqueo = models.BigAutoField(primary_key=True)
    id_barbero = models.ForeignKey(Barbero, on_delete=models.CASCADE, db_column="id_barbero")
    inicio = models.DateTimeField()
    fin = models.DateTimeField()
    motivo = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bloqueos_barbero"
        indexes = [models.Index(fields=["id_barbero", "inicio", "fin"])]