import environ, os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env = environ.Env()
# Antes: "../.env" — eso estaba mal
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "barbershop",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "HOST": env("PGHOST"),
        "PORT": env("PGPORT"),
        "NAME": env("PGDATABASE"),
        "USER": env("PGUSER"),
        "PASSWORD": env("PGPASSWORD"),

    }
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

TIME_ZONE = "America/Mexico_City"
USE_TZ = True
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", default="*").split(",")
SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ROOT_URLCONF = "api.urls"

# ===== Archivos estáticos (requerido por django.contrib.staticfiles) =====
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")      # para collectstatic en prod
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]    # opcional en dev (si creas /backend/static)

# ===== CORS Configuration =====
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8100",
    "http://localhost:4200",
    "http://127.0.0.1:8100",
    "http://127.0.0.1:4200",
]
CORS_ALLOW_CREDENTIALS = True

# (Opcional) Evitar warning de claves autoincrementales en apps nuevas
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
