# 🚀 Guía de Deployment a Cloudflare Pages

## Opción 1: Deployment Manual (Dashboard)

### Paso 1: Conectar Repositorio

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Selecciona tu dominio
3. Ve a **Pages** en el menú lateral
4. Haz clic en **Create a project**
5. Selecciona **Connect to Git**
6. Autoriza GitHub y selecciona tu repositorio

### Paso 2: Configurar Build

En la pantalla de "Set up builds and deployments":

- **Project name:** `football-data-analyzer` (o el que prefieras)
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (dejar vacío o `/`)

Cloudflare detectará automáticamente que es un proyecto Node.js.

### Paso 3: Variables de Entorno (Opcional)

Si necesitas variables de entorno:

1. En el dashboard de Cloudflare Pages
2. Ve a **Settings** → **Environment variables**
3. Agrega las variables necesarias

Para este proyecto, no hay variables requeridas.

### Paso 4: Deploy

1. Haz clic en **Save and Deploy**
2. Cloudflare Pages compilará tu proyecto
3. Verás el status del deployment
4. Una vez completado, tu sitio estará disponible en `https://project-name.pages.dev`

---

## Opción 2: GitHub Actions (Recomendado)

Este proyecto incluye un workflow de GitHub Actions en `.github/workflows/deploy.yml`.

### Paso 1: Configurar Credenciales

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** → **Secrets and variables** → **Actions**
3. Agrega dos secrets:

   **CLOUDFLARE_API_TOKEN:**
   - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Haz clic en **Create Token**
   - Usa el template "Edit Cloudflare Workers"
   - Copia el token

   **CLOUDFLARE_ACCOUNT_ID:**
   - Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
   - Encuentra tu Account ID en la sección "API Tokens"
   - Copia y guarda

### Paso 2: Agregar el Workflow

El workflow ya está en `.github/workflows/deploy.yml`. No necesitas hacer nada más.

### Paso 3: Deploy Automático

Ahora, cada vez que hagas push a `main`:

```bash
git push origin main
```

GitHub Actions:
1. Checkea el código
2. Instala dependencias
3. Compila el proyecto
4. Sube a Cloudflare Pages automáticamente

---

## Opción 3: Deploy Local con Wrangler

Si prefieres deployar desde tu máquina local:

```bash
# 1. Instala Wrangler globalmente
npm install -g wrangler

# 2. Autentica con Cloudflare
wrangler login

# 3. Compila el proyecto
npm run build

# 4. Deploya a Cloudflare Pages
wrangler pages deploy dist/
```

---

## Troubleshooting

### ❌ "Build command failed"

**Solución:**
```bash
# En tu máquina local, verifica que todo funciona
npm install
npm run build
```

Si funciona localmente pero no en Cloudflare:
- Verifica el Node version en Cloudflare (debe ser 18+)
- Revisa los logs de deployment en el dashboard

### ❌ "No output directory dist found"

**Solución:**
- Verifica que `npm run build` genera la carpeta `dist/`
- Comprueba que en el dashboard el "Build output directory" sea `dist`
- Usa `/dist` si `dist` no funciona

### ❌ "package.json not found"

**Solución:**
- El `package.json` debe estar en la raíz del repositorio
- Verifica que no hay subcarpetas que causen problemas
- Revisa que el "Root directory" en Cloudflare sea `/`

### ❌ "Error: ENOENT: no such file or directory"

**Solución:**
- Limpia el caché: `rm -rf node_modules package-lock.json`
- Reinstala: `npm install`
- Asegúrate que todos los archivos estén trackeados en Git:
  ```bash
  git status
  git add .
  git commit -m "Fix: include all necessary files"
  git push
  ```

---

## URLs de Deployment

Una vez deployado, tu sitio estará disponible en:

- **URL por defecto:** `https://football-data-analyzer.pages.dev`
- **Con dominio personalizado:** `https://tudominio.com`

Para conectar un dominio personalizado:
1. Ve a Cloudflare Pages
2. Selecciona tu proyecto
3. Ve a **Custom domains**
4. Agrega tu dominio

---

## Verificar que todo está bien

Después de deployar:

1. Visita tu URL
2. Comprueba que la aplicación Vue carga correctamente
3. Prueba el switch de modo claro/oscuro
4. Verifica la paleta de colores en ambos modos

---

## Recursos

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages GitHub Integration](https://developers.cloudflare.com/pages/platform/github-integration/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
