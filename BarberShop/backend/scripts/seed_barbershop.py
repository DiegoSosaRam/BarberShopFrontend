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
    """Crea datos de prueba para barberías, barberos, servicios, etc."""
    print("Creando datos de barbería...")
    
    # 1. Barberias
    barberia1, b1_created = Barberia.objects.get_or_create(
        slug="premium-cuts",
        defaults={
            "nombre_barberia": "Premium Cuts",
            "direccion": "Av. Principal 123",
            "telefono": "555-1234",
            "timezone": "America/Mexico_City",
            "portada_url": "URL_PORTADA",
            "barberia_active": True
        }
    )
    if b1_created: print(f"Barbería CREADA: {barberia1.nombre_barberia}")
    else: print(f"Barbería OBTENIDA: {barberia1.nombre_barberia}")

    barberia2, b2_created = Barberia.objects.get_or_create(
        slug="barberia-central",
        defaults={
            "nombre_barberia": "Barbería Central",
            "direccion": "Calle Central 456",
            "telefono": "555-2345",
            "timezone": "America/Mexico_City",
            "portada_url": "URL_PORTADA",
            "barberia_active": True
        }
    )
    if b2_created: print(f"Barbería CREADA: {barberia2.nombre_barberia}")
    else: print(f"Barbería OBTENIDA: {barberia2.nombre_barberia}")

    barberia3, b3_created = Barberia.objects.get_or_create(
        slug="barber-co",
        defaults={
            "nombre_barberia": "Barber & Co",
            "direccion": "Plaza Mayor 789",
            "telefono": "555-3456",
            "timezone": "America/Mexico_City",
            "portada_url": "URL_PORTADA",
            "barberia_active": True
        }
    )
    if b3_created: print(f"Barbería CREADA: {barberia3.nombre_barberia}")
    else: print(f"Barbería OBTENIDA: {barberia3.nombre_barberia}")

    # 2. Servicios
    print("Creando servicios...")
    servicios_data = [
        {"nombre": "Corte Clásico", "desc": "Corte tradicional con tijeras y máquina"},
        {"nombre": "Fade Moderno", "desc": "Degradado moderno con técnicas actuales"},
        {"nombre": "Corte + Barba", "desc": "Servicio completo de corte y arreglo de barba"},
        {"nombre": "Arreglo de Barba", "desc": "Perfilado y mantenimiento de barba"},
        {"nombre": "Corte Infantil", "desc": "Corte especializado para niños"},
        {"nombre": "Paquete Premium", "desc": "Corte + barba + shampoo + masaje"},
    ]
    
    for servicio_info in servicios_data:
        servicio, s_created = Servicio.objects.get_or_create(
            nombre_servicio=servicio_info["nombre"],
            defaults={
                "description": servicio_info["desc"],
                "servicio_active": True
            }
        )
        if s_created: print(f"Servicio CREADO: {servicio.nombre_servicio}")
        else: print(f"Servicio OBTENIDO: {servicio.nombre_servicio}")

    # 3. Barberos
    print("Creando barberos...")
    barberos_data = [
        {"nombre": "Carlos Mendoza", "barberia": barberia1, "especialidades": "Fade y Degradados", "experiencia": 8, "calificacion": 4.9},
        {"nombre": "Alexis Vargas", "barberia": barberia1, "especialidades": "Fade y Degradados", "experiencia": 5, "calificacion": 4.7},
        {"nombre": "Samuel Herrera", "barberia": barberia2, "especialidades": "Fade y Degradados", "experiencia": 7, "calificacion": 4.8},
        {"nombre": "Miguel Torres", "barberia": barberia1, "especialidades": "Cortes Clásicos", "experiencia": 12, "calificacion": 4.8},
        {"nombre": "Eduardo Morales", "barberia": barberia2, "especialidades": "Cortes Clásicos", "experiencia": 20, "calificacion": 4.9},
        {"nombre": "Pablo Jiménez", "barberia": barberia3, "especialidades": "Cortes Clásicos", "experiencia": 14, "calificacion": 4.7},
    ]
    
    for barbero_info in barberos_data:
        barbero, barb_created = Barbero.objects.get_or_create(
            nombre_barbero=barbero_info["nombre"],
            id_barberia=barbero_info["barberia"],
            defaults={
                "especialidades": barbero_info["especialidades"],
                "anios_experiencia": barbero_info["experiencia"],
                "calificacion": barbero_info["calificacion"],
                "foto_url": "https://example.com/foto.jpg"
            }
        )
        if barb_created: print(f"Barbero CREADO: {barbero.nombre_barbero}")
        else: print(f"Barbero OBTENIDO: {barbero.nombre_barbero}")

    # 4. Horarios (ejemplo Lunes a Viernes 9-6)
    print("Creando horarios...")
    for barberia in [barberia1, barberia2, barberia3]:
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