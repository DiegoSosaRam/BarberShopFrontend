//                    MongoDB

// ==== CARGA DE DATOS DE PRUEBA barber_shop ====

const now = new Date();

// ==================== SERVICIOS ====================

const corteId = db.servicios.insertOne({
  nombre_servicio: "Corte de cabello",
  description: "Corte clásico con estilo personalizado",
  servicio_active: true,
  created_at: now
}).insertedId;

const barbaId = db.servicios.insertOne({
  nombre_servicio: "Afeitado de barba",
  description: "Afeitado con navaja caliente y toalla húmeda",
  servicio_active: true,
  created_at: now
}).insertedId;

const facialId = db.servicios.insertOne({
  nombre_servicio: "Limpieza facial",
  description: "Tratamiento facial básico post-corte",
  servicio_active: true,
  created_at: now
}).insertedId;


// ==================== BARBERÍAS ====================

const barberia1Id = db.barberias.insertOne({
  nombre_barberia: "Barbería El Estilo",
  direccion: "Av. Reforma 123, Oaxaca",
  telefono: "9511234567",
  timezone: "America/Mexico_City",
  slug: "barberia-el-estilo",
  portada_url: "https://example.com/portada.jpg",
  barberia_active: true,
  created_at: now,
  horarios: [
    { dia_semana: 1, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 2, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 3, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 4, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 5, hora_apertura: "10:00", hora_cierre: "18:00", abierto: true },
    { dia_semana: 6, hora_apertura: "10:00", hora_cierre: "15:00", abierto: true }
  ]
}).insertedId;

const barberia2Id = db.barberias.insertOne({
  nombre_barberia: "Caballeros del Sur",
  direccion: "Calle Hidalgo 456, Oaxaca",
  telefono: "9519988776",
  timezone: "America/Mexico_City",
  slug: "caballeros-del-sur",
  portada_url: "https://example.com/caballeros.jpg",
  barberia_active: true,
  created_at: now,
  horarios: [
    { dia_semana: 1, hora_apertura: "09:00", hora_cierre: "19:00", abierto: true },
    { dia_semana: 2, hora_apertura: "09:00", hora_cierre: "19:00", abierto: true },
    { dia_semana: 3, hora_apertura: "09:00", hora_cierre: "19:00", abierto: true },
    { dia_semana: 4, hora_apertura: "09:00", hora_cierre: "19:00", abierto: true },
    { dia_semana: 5, hora_apertura: "09:00", hora_cierre: "18:00", abierto: true },
    { dia_semana: 6, hora_apertura: "10:00", hora_cierre: "15:00", abierto: true }
  ]
}).insertedId;

const barberia3Id = db.barberias.insertOne({
  nombre_barberia: "Barber Shop Norte",
  direccion: "Blvd. Vasconcelos 120, Oaxaca",
  telefono: "9513344556",
  timezone: "America/Mexico_City",
  slug: "barber-shop-norte",
  portada_url: "https://example.com/norte.jpg",
  barberia_active: true,
  created_at: now,
  horarios: [
    { dia_semana: 1, hora_apertura: "10:00", hora_cierre: "21:00", abierto: true },
    { dia_semana: 2, hora_apertura: "10:00", hora_cierre: "21:00", abierto: true },
    { dia_semana: 3, hora_apertura: "10:00", hora_cierre: "21:00", abierto: true },
    { dia_semana: 4, hora_apertura: "10:00", hora_cierre: "21:00", abierto: true },
    { dia_semana: 5, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 6, hora_apertura: "11:00", hora_cierre: "17:00", abierto: true }
  ]
}).insertedId;

const barberia4Id = db.barberias.insertOne({
  nombre_barberia: "Zona Fade Studio",
  direccion: "Col. Reforma #78, Oaxaca Centro",
  telefono: "9511112233",
  timezone: "America/Mexico_City",
  slug: "zona-fade-studio",
  portada_url: "https://example.com/zona-fade.jpg",
  barberia_active: true,
  created_at: now,
  horarios: [
    { dia_semana: 1, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 2, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 3, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 4, hora_apertura: "10:00", hora_cierre: "20:00", abierto: true },
    { dia_semana: 5, hora_apertura: "10:00", hora_cierre: "18:00", abierto: true },
    { dia_semana: 6, hora_apertura: "11:00", hora_cierre: "16:00", abierto: true }
  ]
}).insertedId;


// ==================== BARBEROS ====================

// Barbería 1
const barbero1 = db.barberos.insertOne({
  barberiaId: barberia1Id,
  calificacion: 4.9,
  nombre_barbero: "Carlos Herrera",
  foto_url: "https://example.com/barbero1.jpg",
  especialidades: "Cortes modernos, degradados, barba",
  anios_experiencia: 7,
  created_at: now
}).insertedId;

// Barbería 2
const barbero2a = db.barberos.insertOne({
  barberiaId: barberia2Id,
  calificacion: 4.7,
  nombre_barbero: "Luis Mendoza",
  foto_url: "https://example.com/luis.jpg",
  especialidades: "Cortes juveniles, barba, cejas",
  anios_experiencia: 5,
  created_at: now
}).insertedId;

const barbero2b = db.barberos.insertOne({
  barberiaId: barberia2Id,
  calificacion: 4.5,
  nombre_barbero: "Erick Ramos",
  foto_url: "https://example.com/erick.jpg",
  especialidades: "Cortes clásicos, fade, delineado",
  anios_experiencia: 4,
  created_at: now
}).insertedId;

// Barbería 3
const barbero3a = db.barberos.insertOne({
  barberiaId: barberia3Id,
  calificacion: 4.8,
  nombre_barbero: "Fernando Cruz",
  foto_url: "https://example.com/fernando.jpg",
  especialidades: "Fade americano, barba y color",
  anios_experiencia: 6,
  created_at: now
}).insertedId;

const barbero3b = db.barberos.insertOne({
  barberiaId: barberia3Id,
  calificacion: 4.6,
  nombre_barbero: "Miguel García",
  foto_url: "https://example.com/miguel.jpg",
  especialidades: "Estilo urbano, tatuajes capilares",
  anios_experiencia: 5,
  created_at: now
}).insertedId;

// Barbería 4
const barbero4a = db.barberos.insertOne({
  barberiaId: barberia4Id,
  calificacion: 4.9,
  nombre_barbero: "Javier López",
  foto_url: "https://example.com/javier.jpg",
  especialidades: "Degradado alto, corte militar",
  anios_experiencia: 8,
  created_at: now
}).insertedId;

const barbero4b = db.barberos.insertOne({
  barberiaId: barberia4Id,
  calificacion: 4.8,
  nombre_barbero: "Andrés Torres",
  foto_url: "https://example.com/andres.jpg",
  especialidades: "Barba, cejas, estilo ejecutivo",
  anios_experiencia: 7,
  created_at: now
}).insertedId;


// ==================== RELACIÓN BARBERÍA - SERVICIOS ====================

const barberias = [barberia1Id, barberia2Id, barberia3Id, barberia4Id];

barberias.forEach(b => {
  db.barberia_servicios.insertMany([
    { barberiaId: b, servicioId: corteId, precio_BarbServ: NumberDecimal("150.00"), duracion_min: "30", created_at: now },
    { barberiaId: b, servicioId: barbaId, precio_BarbServ: NumberDecimal("100.00"), duracion_min: "20", created_at: now },
    { barberiaId: b, servicioId: facialId, precio_BarbServ: NumberDecimal("250.00"), duracion_min: "40", created_at: now }
  ]);
});


// ==================== RELACIÓN BARBERO - SERVICIOS ====================

const barberos = [barbero1, barbero2a, barbero2b, barbero3a, barbero3b, barbero4a, barbero4b];

barberos.forEach(b => {
  db.barbero_servicios.insertMany([
    { barberoId: b, servicioId: corteId, created_at: now },
    { barberoId: b, servicioId: barbaId, created_at: now }
  ]);
});


// ==================== CLIENTE (PROFILE) ====================

const clienteId = db.profiles.insertOne({
  role: "cliente",
  full_name: "Juan Pérez",
  phone: "9517654321",
  avatar_url: "https://example.com/cliente.jpg",
  is_active: true,
  created_at: now
}).insertedId;


// ==================== CITA ====================

const citaId = db.citas.insertOne({
  clienteId: clienteId,
  barberoId: barbero1,
  servicioId: corteId,
  barberiaId: barberia1Id,
  inicio: new Date("2025-10-20T15:00:00Z"),
  fin: new Date("2025-10-20T15:30:00Z"),
  estado: "pendiente",
  notas: "Cliente nuevo, corte moderno",
  creada_por: clienteId,
  created_at: now
}).insertedId;


// ==================== PAGO ====================

db.pagos.insertOne({
  citaId: citaId,
  monto: NumberDecimal("150.00"),
  estado: "pendiente",
  proveedor: "efectivo",
  referencia_proveedor: "N/A",
  created_at: now
});


// ==================== RESEÑA ====================

db.resenas.insertOne({
  citaId: citaId,
  barberoId: barbero1,
  calificacion: 5,
  comentario: "Excelente atención, corte perfecto.",
  created_at: now
});

print("✅ Datos insertados correctamente en barber_shop");
