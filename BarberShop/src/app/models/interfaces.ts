// Interfaces que corresponden a las tablas de la base de datos

export interface Barberia {
  id_barberias: number;
  nombre_barberia: string;
  direccion: string;
  telefono: string;
  timezone: string;
  slug: string;
  portada_url: string;
  barberia_active: boolean;
  created_at: string;
}

export interface Servicio {
  id_servicio: number;
  nombre_servicio: string;
  description: string;
  servicio_active: boolean;
  created_at: string;
}

export interface BarberiaServicio {
  id_barberia: number;
  id_servicio: number;
  precio_BarbServ: number;
  duracion_min: string;
  created_at: string;
}

export interface Barbero {
  id_barbero: number;
  id_barberia: number;
  calificacion: number;
  nombre_barbero: string;
  foto_url: string;
  especialidades: string;
  anios_experiencia: number;
  created_at: string;
}

export interface BarberoServicio {
  id_barbero: number;
  id_servicio: number;
  created_at: string;
}

export interface Profile {
  id_profile: number;
  role: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Cita {
  id_cita: number;
  id_cliente: number;
  id_barbero: number;
  id_servicio: number;
  id_barberia: number;
  inicio: string;
  fin: string;
  estado: string;
  notas: string;
  creada_por: number;
  aprobada_por?: number;
  rechazada_por?: number;
  motivo_rechazo?: string;
  created_at: string;
}

export interface HorarioBarberia {
  id_horario: number;
  id_barberia: number;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  abierto: boolean;
  created_at: string;
}

export interface Pago {
  pago_id: number;
  id_cita: number;
  monto: number;
  estado: string;
  proveedor: string;
  referencia_proveedor: string;
  created_at: string;
}

export interface Resena {
  id_resenia: number;
  id_cita: number;
  id_barbero: number;
  calificacion: number;
  comentario: string;
  created_at: string;
}

// Interfaces auxiliares para vistas combinadas (joins)
export interface ServicioConPrecio extends Servicio {
  precio_BarbServ: number;
  duracion_min: string;
}

export interface BarberoConBarberia extends Barbero {
  nombre_barberia: string;
  direccion: string;
}

export interface CitaCompleta extends Cita {
  nombre_cliente: string;
  nombre_barbero: string;
  nombre_servicio: string;
  nombre_barberia: string;
  precio_BarbServ: number;
  duracion_min: string;
}