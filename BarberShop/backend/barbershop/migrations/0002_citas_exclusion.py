from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('barbershop', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            """
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'btree_gist') THEN
                CREATE EXTENSION btree_gist;
              END IF;
            END$$;

            CREATE INDEX IF NOT EXISTS ix_citas_barbero_rango
            ON public.citas USING gist (id_barbero, tstzrange(inicio, fin, '[)'));

            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conname = 'citas_sin_empalme'
              ) THEN
                ALTER TABLE public.citas
                ADD CONSTRAINT citas_sin_empalme
                EXCLUDE USING gist (
                  id_barbero WITH =,
                  tstzrange(inicio, fin, '[)') WITH &&
                )
                WHERE (estado IN ('pendiente','aprobada'));
              END IF;
            END$$;
            """,
            reverse_sql="""
            ALTER TABLE IF EXISTS public.citas DROP CONSTRAINT IF EXISTS citas_sin_empalme;
            DROP INDEX IF EXISTS ix_citas_barbero_rango;
            """
        )
    ]
