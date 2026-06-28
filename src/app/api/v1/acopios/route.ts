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
    const zona  = searchParams.get('zona')?.trim()
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10) || 50, 200)

    const db = supabase()
    let query = db
      .from('centros_acopio')
      .select(`
        id,
        nombre,
        zona,
        direccion,
        referencia,
        latitud,
        longitud,
        responsable,
        telefono,
        horario,
        activo,
        creado_en,
        actualizado_en,
        inventario_acopio (
          id,
          insumo,
          urgencia,
          cantidad_actual,
          cantidad_requerida,
          unidad
        )
      `)
      .eq('activo', true)
      .order('nombre', { ascending: true })
      .limit(limit)

    if (zona) {
      query = query.ilike('zona', `%${zona}%`)
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
