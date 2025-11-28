import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from django.db import connection

cursor = connection.cursor()
cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='profiles' AND column_name='id_barberia';")
result = cursor.fetchone()

if result:
    print("✓ Column 'id_barberia' EXISTS in 'profiles' table")
else:
    print("✗ Column 'id_barberia' DOES NOT EXIST in 'profiles' table")
