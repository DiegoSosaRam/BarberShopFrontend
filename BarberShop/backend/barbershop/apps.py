from django.apps import AppConfig

class BarbershopConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "barbershop"   # <— importante
    # No cambies label; si pusieras label="otra_cosa", entonces el app label cambia
