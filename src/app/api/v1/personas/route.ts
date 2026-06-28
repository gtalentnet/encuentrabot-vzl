import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
}

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key)
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const nombre  = searchParams.get('nombre')?.trim()
    const estado  = searchParams.get('estado')?.trim()
    const limit   = Math.min(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 200)

    const db = supabase()
    let query = db
      .from('personas')
      .select('id, nombre_completo, edad, sexo, estado, ultima_ubicacion, descripcion, contacto, foto_url, reportado_por, fecha_reporte, actualizado_en')
      .order('fecha_reporte', { ascending: false })
      .limit(limit)

    if (nombre) {
      query = query.ilike('nombre_completo', `%${nombre}%`)
    }

    if (estado) {
      const allowed = ['Desaparecido', 'Encontrado', 'Reunificado']
      if (!allowed.includes(estado)) {
        return NextResponse.json(
          { ok: false, error: `estado inválido. Valores permitidos: ${allowed.join(', ')}` },
          { status: 400, headers: CORS }
        )
      }
      query = query.eq('estado', estado)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json(
      { ok: true, total: count ?? data?.length ?? 0, data: data ?? [] },
      { headers: CORS }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: CORS }
    )
  }
}
