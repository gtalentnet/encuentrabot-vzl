import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAlertas(limit = 5) {
  const { data, error } = await supabase
    .from('alertas_noticias')
    .select('*')
    .eq('publicado', true)
    .order('creado_en', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function buscarPersonas(termino: string, limit = 10) {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .ilike('nombre_completo', `%${termino}%`)
    .order('fecha_reporte', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function getPersonas(estado?: string, limit = 20) {
  let query = supabase
    .from('personas')
    .select('*')
    .order('fecha_reporte', { ascending: false })
    .limit(limit)
  if (estado) query = query.eq('estado', estado)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getCentrosAcopio() {
  const { data, error } = await supabase
    .from('centros_acopio')
    .select('*, inventario_acopio(*)')
    .eq('activo', true)
    .order('zona', { ascending: true })
  if (error) throw error
  return data
}

export async function reportarPersona(persona: {
  nombre_completo: string
  edad?: number
  sexo?: string
  descripcion?: string
  ultima_ubicacion?: string
  contacto?: string
  reportado_por?: string
  foto_url?: string
}) {
  const { data, error } = await supabase
    .from('personas')
    .insert([{ ...persona, estado: 'Desaparecido' }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function uploadFoto(file: File, personaId: string) {
  const ext = file.name.split('.').pop()
  const path = `personas/${personaId}.${ext}`
  const { error } = await supabase.storage
    .from('fotos-emergencia')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('fotos-emergencia').getPublicUrl(path)
  return data.publicUrl
}

export async function getStatsGenerales() {
  const [personas, centros, alertas] = await Promise.all([
    supabase.from('personas').select('estado', { count: 'exact' }),
    supabase.from('centros_acopio').select('id', { count: 'exact' }).eq('activo', true),
    supabase.from('alertas_noticias').select('id', { count: 'exact' }).eq('publicado', true),
  ])
  return {
    totalPersonas: personas.count ?? 0,
    desaparecidos: 0,
    centrosActivos: centros.count ?? 0,
    alertasActivas: alertas.count ?? 0,
  }
}
