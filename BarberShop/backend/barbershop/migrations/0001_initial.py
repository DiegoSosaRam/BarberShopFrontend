# Generated migration for existing database tables

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Barberia',
            fields=[
                ('id_barberias', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre_barberia', models.TextField(blank=True, null=True)),
                ('direccion', models.TextField(blank=True, null=True)),
                ('telefono', models.TextField(blank=True, null=True)),
                ('timezone', models.TextField(blank=True, null=True)),
                ('slug', models.TextField(unique=True)),
                ('portada_url', models.TextField(blank=True, null=True)),
                ('barberia_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'barberias',
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id_role', models.SmallAutoField(primary_key=True, serialize=False)),
                ('role_code', models.TextField(unique=True)),
            ],
            options={
                'db_table': 'roles',
            },
        ),
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id_servicio', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre_servicio', models.TextField(blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('servicio_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'servicios',
            },
        ),
        migrations.CreateModel(
            name='Barbero',
            fields=[
                ('id_barbero', models.BigAutoField(primary_key=True, serialize=False)),
                ('calificacion', models.DecimalField(blank=True, decimal_places=2, max_digits=6, null=True)),
                ('nombre_barbero', models.TextField(blank=True, null=True)),
                ('foto_url', models.TextField(blank=True, null=True)),
                ('especialidades', models.TextField(blank=True, null=True)),
                ('anios_experiencia', models.BigIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('id_barberia', models.ForeignKey(db_column='id_barberia', on_delete=django.db.models.deletion.CASCADE, related_name='barberos', to='barbershop.barberia')),
            ],
            options={
                'db_table': 'barberos',
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id_profile', models.BigAutoField(primary_key=True, serialize=False)),
                ('full_name', models.TextField(blank=True, null=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=128)),
                ('phone', models.TextField(blank=True, null=True)),
                ('avatar_url', models.TextField(default='URL')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('role', models.ForeignKey(db_column='role_id', on_delete=django.db.models.deletion.PROTECT, to='barbershop.role')),
            ],
            options={
                'db_table': 'profiles',
            },
        ),
        migrations.CreateModel(
            name='BarberoServicio',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('id_barbero', models.ForeignKey(db_column='id_barbero', on_delete=django.db.models.deletion.CASCADE, to='barbershop.barbero')),
                ('id_servicio', models.ForeignKey(db_column='id_servicio', on_delete=django.db.models.deletion.CASCADE, to='barbershop.servicio')),
            ],
            options={
                'db_table': 'barbero_servicios',
                'unique_together': {('id_barbero', 'id_servicio')},
            },
        ),
        migrations.CreateModel(
            name='BarberiaServicio',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('precio_BarbServ', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('duracion_min', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('id_barberia', models.ForeignKey(db_column='id_barberia', on_delete=django.db.models.deletion.CASCADE, to='barbershop.barberia')),
                ('id_servicio', models.ForeignKey(db_column='id_servicio', on_delete=django.db.models.deletion.CASCADE, to='barbershop.servicio')),
            ],
            options={
                'db_table': 'barberia_servicios',
                'unique_together': {('id_barberia', 'id_servicio')},
            },
        ),
        migrations.CreateModel(
            name='Cita',
            fields=[
                ('id_cita', models.BigAutoField(primary_key=True, serialize=False)),
                ('barberia_nombre', models.TextField(blank=True, null=True)),
                ('barbero_nombre', models.TextField(blank=True, null=True)),
                ('inicio', models.DateTimeField()),
                ('fin', models.DateTimeField()),
                ('estado', models.TextField(default='pendiente')),
                ('notas', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('id_barbero', models.ForeignKey(db_column='id_barbero', on_delete=django.db.models.deletion.PROTECT, related_name='citas', to='barbershop.barbero')),
                ('id_cliente', models.ForeignKey(db_column='id_cliente', on_delete=django.db.models.deletion.PROTECT, related_name='citas', to='barbershop.profile')),
            ],
            options={
                'db_table': 'citas',
            },
        ),
        migrations.AddIndex(
            model_name='barbero',
            index=models.Index(fields=['id_barberia', 'id_barbero'], name='barbershop_id_barb_b8c0a_idx'),
        ),
        migrations.AddIndex(
            model_name='barbero',
            index=models.Index(fields=['id_barberia', 'id_barbero', 'calificacion'], name='barbershop_id_barb_c9e1f_idx'),
        ),
    ]
