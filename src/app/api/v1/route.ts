import { NextResponse } from 'next/server'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=45',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  return NextResponse.json(
    {
      name: 'Levanta Venezuela — API Pública',
      version: '1.0.0',
      description: 'API de acceso libre para datos de emergencia: personas desaparecidas, centros de acopio y alertas verificadas.',
      base_url: 'https://levanta-venezuela.vercel.app/api/v1',
      contact: 'G-Talent Labs — tecnologiagtalent@gmail.com',
      endpoints: [
        {
          path: '/api/v1/personas',
          method: 'GET',
          description: 'Lista personas reportadas. Soporta filtros opcionales.',
          params: [
            { name: 'nombre', type: 'string', required: false, example: '?nombre=Juan' },
            { name: 'estado', type: 'string', required: false, enum: ['Desaparecido', 'Encontrado', 'Reunificado'], example: '?estado=Desaparecido' },
            { name: 'limit',  type: 'number', required: false, default: 50, example: '?limit=20' },
          ],
          example_response: {
            ok: true,
            total: 1,
            data: [{
              id: 'uuid',
              nombre_completo: 'Juan Pérez',
              estado: 'Desaparecido',
              ultima_ubicacion: 'Chacao',
              fecha_reporte: '2026-06-27T10:00:00Z',
            }],
          },
        },
        {
          path: '/api/v1/acopios',
          method: 'GET',
          description: 'Lista centros de acopio activos con inventario.',
          params: [
            { name: 'zona', type: 'string', required: false, example: '?zona=La Guaira' },
          ],
          example_response: {
            ok: true,
            total: 1,
            data: [{
              id: 'uuid',
              nombre: 'Centro Chacao',
              zona: 'Chacao',
              direccion: 'Av. Principal',
              activo: true,
            }],
          },
        },
        {
          path: '/api/v1/noticias',
          method: 'GET',
          description: 'Alertas y noticias verificadas, ordenadas por fecha descendente.',
          params: [
            { name: 'urgencia', type: 'string', required: false, enum: ['Crítico', 'Alto', 'Medio', 'Bajo'], example: '?urgencia=Crítico' },
            { name: 'limit',    type: 'number', required: false, default: 20, example: '?limit=10' },
          ],
          example_response: {
            ok: true,
            total: 1,
            data: [{
              id: 'uuid',
              titulo: 'Alerta sísmica',
              urgencia: 'Crítico',
              fuente: 'FUNVISIS',
              creado_en: '2026-06-27T10:00:00Z',
            }],
          },
        },
      ],
    },
    { headers: CORS }
  )
}
