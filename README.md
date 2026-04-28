# Football Data Analyzer

Proyecto Vue 3 + Vite con modo claro y oscuro, paleta de colores interactiva y switch para cambiar temas.

## 🚀 Desarrollo Local

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

## 🏗️ Build para Producción

```bash
npm run build
```

Genera los archivos optimizados en la carpeta `dist/`.

## Preview de Build

```bash
npm run preview
```

## ☁️ Deployment en Cloudflare Pages

### Configuración en el Dashboard de Cloudflare Pages:

1. **Build Command:** `npm run build`
2. **Build Output Directory:** `dist`
3. **Node Version:** 18 o superior

### Pasos para Deployar:

1. Conecta tu repositorio GitHub a Cloudflare Pages
2. Configura los valores anteriores en el dashboard
3. Cloudflare Pages deployará automáticamente en cada push a `main`

### Alternativa: Deploy Manual

```bash
npm install -g wrangler
wrangler pages deploy dist/
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/
│   │   └── HelloWorld.vue      # Componente con paleta de colores
│   ├── assets/                  # Imágenes y recursos
│   ├── App.vue                  # Componente raíz con toggle de tema
│   ├── main.js                  # Punto de entrada
│   └── style.css                # Estilos globales con CSS variables
├── index.html                   # HTML principal
├── vite.config.js               # Configuración de Vite
├── wrangler.toml                # Configuración de Cloudflare Pages
├── .nvmrc                       # Versión de Node.js recomendada
└── package.json                 # Dependencias
```

## 🎨 Características

- **Vue 3** con `<script setup>` (Composition API)
- **Vite 8** para desarrollo rápido y build optimizado
- **Modo Claro/Oscuro** con switch animado
- **Paleta de 4 colores** para cada tema:
  - **Modo Claro:** Blanco, Indigo, Cyan, Gris
  - **Modo Oscuro:** Azul oscuro, Indigo claro, Cyan brillante, Gris oscuro
- **CSS Variables** para gestión dinámica de temas
- **Transiciones suaves** entre modos
- **Componentes modulares** siguiendo Agents.md

## 🛠️ Stack Tecnológico

- Vue 3.5.32
- Vite 8.0.10
- @vitejs/plugin-vue 6.0.6
- CSS Variables para temas
- Git Flow para versionamiento

## 📝 Git Flow

El proyecto sigue Git Flow:

```
main (producción)
  ↑
develop (desarrollo)
  ↑
feature/* (características)
```

## 🔧 Troubleshooting

**Error en Cloudflare Pages: "No package.json found"**

1. Asegúrate que el `package.json` está en la raíz del repositorio
2. Verifica que el build command es: `npm run build`
3. Verifica que el output directory es: `dist`
4. Comprueba que la rama deployada es `main`

**El proyecto no se construye localmente**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Learn More

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vite.dev/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

