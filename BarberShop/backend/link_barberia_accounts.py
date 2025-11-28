import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from django.db import connection

cursor = connection.cursor()

# Mapping of barbería emails to their id_barberias
barberia_mappings = {
    'barberia_the-classic-barber@barbershop.com': 1,
    'barberia_el-barbero-moderno@barbershop.com': 2,
    'barberia_estilo-elegancia@barbershop.com': 3,
    'barberia_barberia-premium@barbershop.com': 4,
    'barberia_cortes-express@barbershop.com': 5,
    'barberia_tijeras-estilo@barbershop.com': 6,
}

print("Linking barbería user accounts to their respective barberías...\n")

for email, barberia_id in barberia_mappings.items():
    cursor.execute(
        "UPDATE profiles SET id_barberia = %s WHERE email = %s",
        [barberia_id, email]
    )
    rows_updated = cursor.rowcount
    if rows_updated > 0:
        print(f"✓ {email} → id_barberia: {barberia_id}")
    else:
        print(f"✗ {email} → NOT FOUND")

connection.commit()
print("\n✓ All barbería accounts linked successfully!")
