
# EncuentraBot VZL â€” Despliegue Local

Sistema de coordinaciÃ³n de emergencia post-sismo para Caracas y La Guaira.
**Stack:** n8n (orquestador) + Supabase (PostgreSQL) + Telegram Bot.

---

## Requisitos previos

| Herramienta | VersiÃ³n mÃ­nima | Verificar con |
|---|---|---|
| Docker Desktop | 4.x | `docker --version` |
| Ngrok | 3.x | `ngrok --version` |
| Cuenta Supabase | â€” | supabase.com |
| Bot de Telegram | â€” | @BotFather |

---

## Paso 1 â€” Configurar variables de entorno

```bash
cp .env.example .env
# Edita .env con tus credenciales reales
```

**Campos obligatorios en `.env`:**
- `TELEGRAM_BOT_TOKEN` â†’ obtenido de @BotFather
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` â†’ Supabase Dashboard â†’ Project Settings â†’ API
- `WEBHOOK_URL` â†’ se completa en el Paso 3

---

## Paso 2 â€” Levantar n8n

```bash
docker compose up -d
```

Verifica que estÃ© corriendo:

```bash
docker compose ps
# Accede en: http://localhost:5678
# Usuario: admin / ContraseÃ±a: la que pusiste en .env
```

---

## Paso 3 â€” Exponer con Ngrok y registrar webhook

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

> **Nota:** Con Ngrok gratuito la URL cambia cada reinicio. Para producciÃ³n usa un dominio fijo.

---

## Paso 4 â€” Inicializar la base de datos en Supabase

1. Ve a [supabase.com](https://supabase.com) â†’ tu proyecto â†’ **SQL Editor** â†’ **New query**
2. Pega el contenido completo de `init.sql`
3. Haz clic en **Run**

DeberÃ­as ver las tablas creadas en **Table Editor**:
- `personas`
- `centros_acopio`
- `inventario_acopio`
- `alertas_noticias`

---

## Paso 5 â€” Registrar el webhook de Telegram

Desde cualquier navegador (reemplaza los valores):

```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<WEBHOOK_URL>/webhook/telegram
```

Respuesta esperada: `{"ok":true,"result":true}`

---

## Paso 6 â€” Importar flujos en n8n

1. Accede a `http://localhost:5678`
2. **Workflows â†’ Import from file** (los flujos `.json` van en `/workflows/`)
3. Activa cada flujo con el toggle

---

## Comandos del bot

| Comando | FunciÃ³n |
|---|---|
| `/buscar <nombre>` | Busca persona en la tabla `personas` |
| `/reportar` | Inicia formulario para reportar persona |
| `/acopio` | Lista centros activos con inventario crÃ­tico |
| `/noticias` | Muestra las Ãºltimas 3 alertas publicadas |
| `/ayuda` | Muestra este menÃº |

---

## Arquitectura

```
Telegram â”€â”€â–º Ngrok â”€â”€â–º n8n (localhost:5678)
                            â”‚
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚       â”‚        â”‚
                 /buscar  /acopio  /noticias
                    â”‚       â”‚        â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                            â”‚
                    Supabase PostgreSQL
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ personas          â”‚
                    â”‚ centros_acopio    â”‚
                    â”‚ inventario_acopio â”‚
                    â”‚ alertas_noticias  â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Comandos Ãºtiles

```bash
# Ver logs en tiempo real
docker compose logs -f n8n

# Detener todo
docker compose down

# Detener y borrar datos (Â¡destructivo!)
docker compose down -v

# Backup del volumen n8n
docker run --rm -v encuentrabot-vzl_n8n_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/n8n_backup_$(date +%Y%m%d).tar.gz /data
```

---

## Hoja de ruta hacia producciÃ³n

- [ ] Reemplazar Ngrok por dominio propio con SSL (Traefik o Caddy)
- [ ] Habilitar autenticaciÃ³n n8n con SSO
- [ ] Endurecer polÃ­ticas RLS en Supabase por rol de usuario
- [ ] Agregar `pgvector` para bÃºsqueda semÃ¡ntica de personas
- [ ] Panel web (Next.js) conectado a Supabase Realtime
- [ ] Alertas automÃ¡ticas por scraping de fuentes oficiales (IAMET, ProtecciÃ³n Civil)

