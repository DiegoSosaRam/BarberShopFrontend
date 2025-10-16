--           MongoDB

-- ==== CARGA DE DATOS DE PRUEBA barber_shop ====

-- const now = new Date();

-- =============== tablas creadas dentro de Compass ===============

-- db.createCollection("servicios", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["nombre_servicio", "servicio_active", "created_at"],
--       properties: {
--         nombre_servicio: { bsonType: "string" },
--         description: { bsonType: ["string", "null"] },
--         servicio_active: { bsonType: "bool" },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.servicios.createIndex({ nombre_servicio: 1 });


-- db.createCollection("barberias", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["slug", "barberia_active", "created_at"],
--       properties: {
--         nombre_barberia: { bsonType: ["string", "null"] },
--         direccion: { bsonType: ["string", "null"] },
--         telefono: { bsonType: ["string", "null"] },
--         timezone: { bsonType: ["string", "null"] },
--         slug: { bsonType: "string" },
--         portada_url: { bsonType: ["string", "null"] },
--         barberia_active: { bsonType: "bool" },
--         created_at: { bsonType: "date" },
--         horarios: {
--           bsonType: ["array", "null"],
--           items: {
--             bsonType: "object",
--             properties: {
--               dia_semana: { bsonType: "int" },
--               hora_apertura: { bsonType: ["string", "null"] },
--               hora_cierre: { bsonType: ["string", "null"] },
--               abierto: { bsonType: "bool" }
--             }
--           }
--         }
--       }
--     }
--   }
-- });

-- db.barberias.createIndex({ slug: 1 }, { unique: true });


-- db.createCollection("profiles", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["is_active", "created_at"],
--       properties: {
--         role: { bsonType: ["string", "null"] },
--         full_name: { bsonType: ["string", "null"] },
--         phone: { bsonType: ["string", "null"] },
--         avatar_url: { bsonType: "string" },
--         is_active: { bsonType: "bool" },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.profiles.createIndex({ full_name: 1 });


-- db.createCollection("barberos", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["created_at"],
--       properties: {
--         barberiaId: { bsonType: ["objectId", "null"] },
--         calificacion: { bsonType: ["double", "decimal", "null"] },
--         nombre_barbero: { bsonType: ["string", "null"] },
--         foto_url: { bsonType: ["string", "null"] },
--         especialidades: { bsonType: ["string", "null"] },
--         anios_experiencia: { bsonType: ["int", "long", "null"] },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.barberos.createIndex({ barberiaId: 1 });
-- db.barberos.createIndex({ nombre_barbero: 1 });


-- db.createCollection("barberia_servicios", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["barberiaId", "servicioId", "created_at"],
--       properties: {
--         barberiaId: { bsonType: "objectId" },
--         servicioId: { bsonType: "objectId" },
--         precio_BarbServ: { bsonType: ["decimal", "double", "null"] },
--         duracion_min: { bsonType: ["string", "null"] },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.barberia_servicios.createIndex(
--   { barberiaId: 1, servicioId: 1 },
--   { unique: true }
-- );


-- db.createCollection("barbero_servicios", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["barberoId", "servicioId", "created_at"],
--       properties: {
--         barberoId: { bsonType: "objectId" },
--         servicioId: { bsonType: "objectId" },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.barbero_servicios.createIndex(
--   { barberoId: 1, servicioId: 1 },
--   { unique: true }
-- );


-- db.createCollection("citas", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["created_at"],
--       properties: {
--         clienteId: { bsonType: ["objectId", "null"] },
--         barberoId: { bsonType: ["objectId", "null"] },
--         servicioId: { bsonType: ["objectId", "null"] },
--         barberiaId: { bsonType: ["objectId", "null"] },
--         inicio: { bsonType: ["date", "null"] },
--         fin: { bsonType: ["date", "null"] },
--         estado: { bsonType: ["string", "null"] },
--         notas: { bsonType: ["string", "null"] },
--         creada_por: { bsonType: ["objectId", "null"] },
--         aprobada_por: { bsonType: ["objectId", "null"] },
--         rechazada_por: { bsonType: ["objectId", "null"] },
--         motivo_rechazo: { bsonType: ["string", "null"] },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.citas.createIndex({ barberiaId: 1, inicio: 1 });


-- db.createCollection("pagos", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["citaId", "monto", "created_at"],
--       properties: {
--         citaId: { bsonType: "objectId" },
--         monto: { bsonType: ["decimal", "double"] },
--         estado: { bsonType: ["string", "null"] },
--         proveedor: { bsonType: ["string", "null"] },
--         referencia_proveedor: { bsonType: ["string", "null"] },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.pagos.createIndex({ citaId: 1 });


-- db.createCollection("resenas", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["citaId", "barberoId", "calificacion", "created_at"],
--       properties: {
--         citaId: { bsonType: "objectId" },
--         barberoId: { bsonType: "objectId" },
--         calificacion: { bsonType: "int" },
--         comentario: { bsonType: ["string", "null"] },
--         created_at: { bsonType: "date" }
--       }
--     }
--   }
-- });

-- db.resenas.createIndex({ barberoId: 1 });
-- db.resenas.createIndex({ citaId: 1 });
