import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
}

const URGENCIAS_VALIDAS = ['Crítico', 'Alto', 'Medio', 'Bajo'] as const
type Urgencia = typeof URGENCIAS_VALIDAS[number]

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
    const urgencia = searchParams.get('urgencia')?.trim()
    const fuente   = searchParams.get('fuente')?.trim()
    const limit    = Math.min(parseInt(searchParams.get('limit') ?? '20', 10) || 20, 100)

    if (urgencia && !URGENCIAS_VALIDAS.includes(urgencia as Urgencia)) {
      return NextResponse.json(
        { ok: false, error: `urgencia inválida. Valores permitidos: ${URGENCIAS_VALIDAS.join(', ')}` },
        { status: 400, headers: CORS }
      )
    }

    const db = supabase()
    let query = db
      .from('alertas_noticias')
      .select('id, titulo, cuerpo, urgencia, fuente, fuente_url, tags, creado_en, actualizado_en')
      .eq('activo', true)
      .order('creado_en', { ascending: false })
      .limit(limit)

    if (urgencia) {
      query = query.eq('urgencia', urgencia)
    }

    if (fuente) {
      query = query.ilike('fuente', `%${fuente}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(
      { ok: true, total: data?.length ?? 0, data: data ?? [] },
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
