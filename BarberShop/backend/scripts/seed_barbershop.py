# scripts/seed_barbershop.py
import os
import django
import sys
from datetime import datetime, time

# --- Configuración de Django ---
# 1. Añadir el directorio 'backend' (donde está manage.py) al path de Python
#    Esto permite que Python encuentre 'api.settings' y 'barbershop.models'
#    os.path.dirname(__file__) -> .../backend/scripts
#    os.path.join(..., '..')   -> .../backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 2. Establecer la variable de entorno para los settings de Django
#    (Basado en tu estructura de carpetas, el módulo de settings está en 'api')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

# 3. Cargar la configuración de Django
try:
    django.setup()
except Exception as e:
    print(f"Error al configurar Django: {e}")
    print("Asegúrate de que DJANGO_SETTINGS_MODULE ('api.settings') es correcto.")
    sys.exit(1)
# --- Fin de la Configuración ---

# 4. Importar modelos DESPUÉS de django.setup()
try:
    from barbershop.models import Role, Profile, Barberia, Barbero, Servicio, HorarioBarberia
except ImportError as e:
    print(f"Error al importar modelos: {e}")
    print("Asegúrate de que tus modelos están en 'barbershop.models' y no tienen errores de sintaxis.")
    sys.exit(1)


def seed_roles():
    """Crea los roles básicos si no existen."""
    print("Creando/verificando roles...")
    roles = ["CLIENTE", "BARBERO", "ADMIN"]
    for role_name in roles:
        role, created = Role.objects.get_or_create(role_code=role_name)
        if created:
            print(f"Rol CREADO: {role.role_code}")
        else:
            print(f"Rol OBTENIDO: {role.role_code}")
    print("--- Roles listos.")
    return Role.objects.get(role_code="CLIENTE")

def seed_profiles(cliente_role):
    """Crea un perfil de cliente de prueba."""
    print("Creando/verificando perfil de cliente 'Carlos Test'...")
    
    # ¡ESTA ES LA CORRECCIÓN!
    # Usamos el objeto 'cliente_role' que obtuvimos de la BD,
    # en lugar del string "CLIENTE".
    cliente, created = Profile.objects.get_or_create(
        full_name="Carlos Test",
        defaults={
            "role": cliente_role,  # <-- Se pasa el objeto Role
            "phone": "951-555-0000",
            "avatar_url": "URL",
            "is_active": True
        }
    )
    
    if created:
        print(f"Perfil CREADO: {cliente.full_name} (ID: {cliente.id_profile})")
    else:
        print(f"Perfil OBTENIDO: {cliente.full_name} (ID: {cliente.id_profile})")
    print("--- Perfiles listos.")

def seed_barberia_data():
    """Crea datos de prueba para barberías, barberos, etc."""
    print("Creando datos de barbería...")
    
    # 1. Barberia
    barberia, b_created = Barberia.objects.get_or_create(
        slug="la-barba-dorada",
        defaults={
            "nombre_barberia": "La Barba Dorada",
            "direccion": "Calle Falsa 123",
            "telefono": "555-1234",
            "timezone": "America/Mexico_City",
            "portada_url": "URL_PORTADA",
            "barberia_active": True
        }
    )
    if b_created: print(f"Barbería CREADA: {barberia.nombre_barberia}")
    else: print(f"Barbería OBTENIDA: {barberia.nombre_barberia}")

    # 2. Horarios (ejemplo Lunes a Viernes 9-6)
    print("Creando horarios...")
    for dia in range(1, 6): # 1=Lunes a 5=Viernes
        HorarioBarberia.objects.get_or_create(
            id_barberia=barberia,
            dia_semana=dia,
            defaults={
                "hora_apertura": time(9, 0), # 09:00
                "hora_cierre": time(18, 0), # 18:00
                "abierto": True
            }
        )
    # Sábado
    HorarioBarberia.objects.get_or_create(
            id_barberia=barberia,
            dia_semana=6, # Sábado
            defaults={
                "hora_apertura": time(10, 0), # 10:00
                "hora_cierre": time(15, 0), # 15:00
                "abierto": True
            }
        )
    # Domingo
    HorarioBarberia.objects.get_or_create(
            id_barberia=barberia,
            dia_semana=0, # Domingo
            defaults={"abierto": False}
        )
    print("--- Horarios listos.")
    # (Puedes añadir más datos de barberos, servicios, etc. aquí)


def seed():
    print("=========================")
    print("INICIANDO SCRIPT DE SEED")
    print("=========================")
    
    # 1. Crear roles (fundamental)
    cliente_role = seed_roles()
    
    # 2. Crear perfiles (depende de roles)
    seed_profiles(cliente_role)
    
    # 3. Crear otros datos (barbería, horarios, etc.)
    seed_barberia_data()
    
    print("=========================")
    print("SEEDING COMPLETADO")
    print("=========================")

# --- Ejecutar el script ---
if __name__ == "__main__":
    seed()