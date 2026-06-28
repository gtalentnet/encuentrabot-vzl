-- ============================================================
-- EncuentraBot VZL — Script de Inicialización de Base de Datos
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Habilitar extensión para UUIDs (ya viene activa en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- PILAR 1: PERSONAS DESAPARECIDAS / ENCONTRADAS
-- ============================================================

CREATE TYPE estado_persona AS ENUM ('Desaparecido', 'Encontrado', 'Reunificado');

CREATE TABLE IF NOT EXISTS personas (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_completo TEXT NOT NULL,
    edad            SMALLINT,
    sexo            CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    descripcion     TEXT,                          -- rasgos físicos, ropa, señas
    ultima_ubicacion TEXT,                         -- zona / dirección aproximada
    estado          estado_persona NOT NULL DEFAULT 'Desaparecido',
    foto_url        TEXT,                          -- URL de imagen (Storage Supabase)
    reportado_por   TEXT,                          -- nombre o @usuario Telegram
    contacto        TEXT,                          -- teléfono / usuario del reportante
    telegram_chat_id BIGINT,                       -- para notificación automática
    fecha_reporte   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notas_internas  TEXT                           -- uso interno de coordinadores
);

-- Índices para búsquedas rápidas por nombre y estado
CREATE INDEX IF NOT EXISTS idx_personas_nombre  ON personas USING GIN (to_tsvector('spanish', nombre_completo));
CREATE INDEX IF NOT EXISTS idx_personas_estado  ON personas (estado);

-- Trigger: actualiza fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_personas_updated
    BEFORE UPDATE ON personas
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();


-- ============================================================
-- PILAR 2: CENTROS DE ACOPIO E INVENTARIO
-- ============================================================

CREATE TYPE urgencia_nivel AS ENUM ('Crítico', 'Alto', 'Medio', 'Bajo');

CREATE TABLE IF NOT EXISTS centros_acopio (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre      TEXT NOT NULL,
    direccion   TEXT NOT NULL,
    zona        TEXT NOT NULL,                     -- ej: "Chacao", "La Guaira", "Catia"
    referencia  TEXT,                              -- punto de referencia cercano
    -- Geolocalización (compatibles con PostGIS si se habilita en el futuro)
    latitud     DECIMAL(10, 7),
    longitud    DECIMAL(10, 7),
    responsable TEXT,                              -- nombre del coordinador del centro
    telefono    TEXT,
    activo      BOOLEAN NOT NULL DEFAULT TRUE,
    capacidad_actual TEXT,                         -- ej: "80%" — texto libre por ahora
    horario     TEXT,                              -- ej: "Lun-Dom 8am-6pm"
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_centros_zona   ON centros_acopio (zona);
CREATE INDEX IF NOT EXISTS idx_centros_activo ON centros_acopio (activo);

CREATE TRIGGER trg_centros_updated
    BEFORE UPDATE ON centros_acopio
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- Inventario por centro de acopio
CREATE TABLE IF NOT EXISTS inventario_acopio (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centro_id   UUID NOT NULL REFERENCES centros_acopio(id) ON DELETE CASCADE,
    insumo      TEXT NOT NULL,                     -- ej: "Agua potable (1.5L)", "Pañales talla M"
    cantidad    INTEGER NOT NULL DEFAULT 0,
    unidad      TEXT NOT NULL DEFAULT 'unidades',  -- ej: "cajas", "litros", "kg"
    urgencia    urgencia_nivel NOT NULL DEFAULT 'Medio',  -- nivel de necesidad del insumo
    donaciones  INTEGER NOT NULL DEFAULT 0,        -- entradas acumuladas
    distribuido INTEGER NOT NULL DEFAULT 0,        -- salidas acumuladas
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventario_centro  ON inventario_acopio (centro_id);
CREATE INDEX IF NOT EXISTS idx_inventario_urgencia ON inventario_acopio (urgencia);

CREATE TRIGGER trg_inventario_updated
    BEFORE UPDATE ON inventario_acopio
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();


-- ============================================================
-- PILAR 3: ALERTAS Y NOTICIAS CONFIRMADAS
-- ============================================================

CREATE TYPE fuente_tipo AS ENUM (
    'IAMET',           -- Instituto de Meteorología
    'Protección Civil',
    'Bomberos',
    'Cruz Roja',
    'Gobierno',
    'Prensa verificada',
    'Scraping automático',
    'Ingesta manual'
);

CREATE TABLE IF NOT EXISTS alertas_noticias (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo      TEXT NOT NULL,
    cuerpo      TEXT NOT NULL,
    fuente      fuente_tipo NOT NULL DEFAULT 'Ingesta manual',
    fuente_url  TEXT,                              -- URL original si aplica
    urgencia    urgencia_nivel NOT NULL DEFAULT 'Medio',
    verificado  BOOLEAN NOT NULL DEFAULT FALSE,    -- aprobado por moderador
    publicado   BOOLEAN NOT NULL DEFAULT FALSE,    -- visible en el bot
    tags        TEXT[],                            -- ej: {"sismo","Caracas","agua"}
    fecha_evento TIMESTAMPTZ,                      -- cuándo ocurrió (diferente a ingreso)
    creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alertas_urgencia  ON alertas_noticias (urgencia);
CREATE INDEX IF NOT EXISTS idx_alertas_publicado ON alertas_noticias (publicado);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha     ON alertas_noticias (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_titulo    ON alertas_noticias USING GIN (to_tsvector('spanish', titulo));

CREATE TRIGGER trg_alertas_updated
    BEFORE UPDATE ON alertas_noticias
    FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();


-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Base para producción
-- Habilitar RLS ahora; políticas permisivas para arrancar.
-- Endurecer con roles específicos antes de pasar a producción.
-- ============================================================

ALTER TABLE personas          ENABLE ROW LEVEL SECURITY;
ALTER TABLE centros_acopio    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_acopio ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_noticias  ENABLE ROW LEVEL SECURITY;

-- Política temporal: service_role (n8n) puede hacer todo
-- anon solo puede leer datos públicos
CREATE POLICY "service_role full access personas"
    ON personas FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon puede leer personas"
    ON personas FOR SELECT TO anon USING (true);

CREATE POLICY "service_role full access centros"
    ON centros_acopio FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon puede leer centros activos"
    ON centros_acopio FOR SELECT TO anon USING (activo = true);

CREATE POLICY "service_role full access inventario"
    ON inventario_acopio FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon puede leer inventario"
    ON inventario_acopio FOR SELECT TO anon USING (true);

CREATE POLICY "service_role full access alertas"
    ON alertas_noticias FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "anon puede leer alertas publicadas"
    ON alertas_noticias FOR SELECT TO anon USING (publicado = true);


-- ============================================================
-- DATOS SEMILLA (seed) — para probar el bot de inmediato
-- ============================================================

INSERT INTO centros_acopio (nombre, direccion, zona, referencia, latitud, longitud, responsable, telefono, horario) VALUES
('Centro Acopio Chacao',    'Av. Francisco de Miranda, frente al CCCT', 'Chacao',    'Frente al CC Tamanaco',  10.4880, -66.8538, 'María González', '0414-1234567', 'Lun-Dom 7am-7pm'),
('Centro Acopio La Guaira', 'Av. Soublette, sector Macuto',             'La Guaira', 'Al lado del Puerto',     10.6033, -66.8771, 'Carlos Peña',    '0416-7654321', 'Lun-Dom 8am-6pm'),
('Centro Acopio Petare',    'Frente a la Plaza Petare',                  'Petare',    'Junto a la Alcaldía',    10.4800, -66.7960, 'Ana Rodríguez',  '0424-1112233', 'Lun-Vie 8am-5pm');

INSERT INTO inventario_acopio (centro_id, insumo, cantidad, unidad, urgencia)
SELECT id, 'Agua potable (1.5L)', 200, 'botellas', 'Crítico' FROM centros_acopio WHERE zona = 'La Guaira';

INSERT INTO inventario_acopio (centro_id, insumo, cantidad, unidad, urgencia)
SELECT id, 'Medicamentos básicos', 50, 'kits', 'Alto' FROM centros_acopio WHERE zona = 'Chacao';

INSERT INTO alertas_noticias (titulo, cuerpo, fuente, urgencia, verificado, publicado, tags) VALUES
(
    'Sismo 5.2 Richter — Caracas 27/06/2026',
    'A las 03:14 AM se registró un sismo de magnitud 5.2 con epicentro en La Guaira. Se reportan cortes de luz en Maiquetía. Evite zonas costeras por precaución.',
    'IAMET',
    'Crítico',
    true,
    true,
    ARRAY['sismo', 'Caracas', 'La Guaira', 'emergencia']
),
(
    'Habilitados albergues en instalaciones deportivas',
    'Protección Civil habilitó albergues en el Poliedro de Caracas y la Ciudad Deportiva de La Rinconada. Capacidad para 1,200 personas.',
    'Protección Civil',
    'Alto',
    true,
    true,
    ARRAY['albergue', 'Caracas', 'refugio']
);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
