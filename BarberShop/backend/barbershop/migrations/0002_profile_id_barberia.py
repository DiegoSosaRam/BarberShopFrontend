# Migration to add id_barberia foreign key to Profile model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('barbershop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='id_barberia',
            field=models.ForeignKey(blank=True, db_column='id_barberia', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='perfiles', to='barbershop.barberia'),
        ),
    ]
