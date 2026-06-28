# EncuentraBot VZL — Despliegue Local

Sistema de coordinación de emergencia post-sismo para Caracas y La Guaira.
**Stack:** n8n (orquestador) + Supabase (PostgreSQL) + Telegram Bot.

---

## Requisitos previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Docker Desktop | 4.x | `docker --version` |
| Ngrok | 3.x | `ngrok --version` |
| Cuenta Supabase | — | supabase.com |
| Bot de Telegram | — | @BotFather |

---

## Paso 1 — Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

**Campos obligatorios en `.env`:**
- `TELEGRAM_BOT_TOKEN` → obtenido de @BotFather
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` → Supabase Dashboard → Project Settings → API
- `WEBHOOK_URL` → se completa en el Paso 3

---

## Paso 2 — Levantar n8n

```bash
docker compose up -d
```

Verifica que esté corriendo:

```bash
docker compose ps
# Accede en: http://localhost:5678
# Usuario: admin / Contraseña: la que pusiste en .env
```

---

## Paso 3 — Exponer con Ngrok y registrar webhook

```bash
# En una terminal separada (mantener abierta):
ngrok http 5678
```

Copia la URL HTTPS que aparece (ej: `https://abcd-1234.ngrok-free.app`).

Actualiza `.env`:
```
WEBHOOK_URL=https://abcd-1234.ngrok-free.app
```

Reinicia el contenedor para aplicar el cambio:
```bash
docker compose restart n8n
```

> **Nota:** Con Ngrok gratuito la URL cambia cada reinicio. Para producción usa un dominio fijo.

---

## Paso 4 — Inicializar la base de datos en Supabase

1. Ve a [supabase.com](https://supabase.com) → tu proyecto → **SQL Editor** → **New query**
2. Pega el contenido completo de `init.sql`
3. Haz clic en **Run**

Deberías ver las tablas creadas en **Table Editor**:
- `personas`
- `centros_acopio`
- `inventario_acopio`
- `alertas_noticias`

---

## Paso 5 — Registrar el webhook de Telegram

Desde cualquier navegador (reemplaza los valores):

```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<WEBHOOK_URL>/webhook/telegram
```

Respuesta esperada: `{"ok":true,"result":true}`

---

## Paso 6 — Importar flujos en n8n

1. Accede a `http://localhost:5678`
2. **Workflows → Import from file** (los flujos `.json` van en `/workflows/`)
3. Activa cada flujo con el toggle

---

## Comandos del bot

| Comando | Función |
|---|---|
| `/buscar <nombre>` | Busca persona en la tabla `personas` |
| `/reportar` | Inicia formulario para reportar persona |
| `/acopio` | Lista centros activos con inventario crítico |
| `/noticias` | Muestra las últimas 3 alertas publicadas |
| `/ayuda` | Muestra este menú |

---

## Arquitectura

```
Telegram ──► Ngrok ──► n8n (localhost:5678)
                            │
                    ┌───────┼────────┐
                    │       │        │
                 /buscar  /acopio  /noticias
                    │       │        │
                    └───────┴────────┘
                            │
                    Supabase PostgreSQL
                    ┌───────────────────┐
                    │ personas          │
                    │ centros_acopio    │
                    │ inventario_acopio │
                    │ alertas_noticias  │
                    └───────────────────┘
```

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f n8n

# Detener todo
docker compose down

# Detener y borrar datos (¡destructivo!)
docker compose down -v

# Backup del volumen n8n
docker run --rm -v encuentrabot-vzl_n8n_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/n8n_backup_$(date +%Y%m%d).tar.gz /data
```

---

## Hoja de ruta hacia producción

- [ ] Reemplazar Ngrok por dominio propio con SSL (Traefik o Caddy)
- [ ] Habilitar autenticación n8n con SSO
- [ ] Endurecer políticas RLS en Supabase por rol de usuario
- [ ] Agregar `pgvector` para búsqueda semántica de personas
- [ ] Panel web (Next.js) conectado a Supabase Realtime
- [ ] Alertas automáticas por scraping de fuentes oficiales (IAMET, Protección Civil)
