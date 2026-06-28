export type EstadoPersona = 'Desaparecido' | 'Encontrado' | 'Reunificado'
export type UrgenciaNivel = 'Crítico' | 'Alto' | 'Medio' | 'Bajo'
export type FuenteTipo =
  | 'IAMET'
  | 'Protección Civil'
  | 'Bomberos'
  | 'Cruz Roja'
  | 'Gobierno'
  | 'Prensa verificada'
  | 'Scraping automático'
  | 'Ingesta manual'

export interface Persona {
  id: string
  nombre_completo: string
  edad?: number
  sexo?: 'M' | 'F' | 'O'
  descripcion?: string
  ultima_ubicacion?: string
  estado: EstadoPersona
  foto_url?: string
  reportado_por?: string
  contacto?: string
  telegram_chat_id?: number
  fecha_reporte: string
  fecha_actualizacion: string
  notas_internas?: string
}

export interface CentroAcopio {
  id: string
  nombre: string
  direccion: string
  zona: string
  referencia?: string
  latitud?: number
  longitud?: number
  responsable?: string
  telefono?: string
  activo: boolean
  capacidad_actual?: string
  horario?: string
  creado_en: string
  actualizado_en: string
  inventario_acopio?: InventarioItem[]
}

export interface InventarioItem {
  id: string
  centro_id: string
  insumo: string
  cantidad: number
  unidad: string
  urgencia: UrgenciaNivel
  donaciones: number
  distribuido: number
  actualizado_en: string
}

export interface AlertaNoticia {
  id: string
  titulo: string
  cuerpo: string
  fuente: FuenteTipo
  fuente_url?: string
  urgencia: UrgenciaNivel
  verificado: boolean
  publicado: boolean
  tags?: string[]
  fecha_evento?: string
  creado_en: string
  actualizado_en: string
}

export interface ReportePersonaForm {
  nombre_completo: string
  edad?: number
  sexo?: 'M' | 'F' | 'O'
  descripcion?: string
  ultima_ubicacion?: string
  contacto?: string
  reportado_por?: string
  foto_url?: string
}
