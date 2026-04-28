# Agents.md - Directrices de Desarrollo para fm-image-visualizer

## 📋 Propósito

Este documento define los estándares y directrices que **toda IA (o humano) debe seguir** al desarrollar la aplicación `fm-image-visualizer` con Vue 3. El objetivo es mantener un código limpio, mantenible, escalable y fácil de entender.

---

## 🎯 Principios Fundamentales

### 1. **KISS primero** (Keep It Simple, Stupid)
- Evita complejidad innecesaria
- Soluciona el problema directamente sin sobre-ingeniería
- Si algo puede hacerse en 5 líneas, no hagas 20
- Código simple > código inteligente

### 2. **SOLID después**
Una vez que el código es simple, aplica SOLID:
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### 3. **Máxima Modularización**
- Componentes lo más pequeños y reutilizables posible
- Cada componente debe tener **una** razón de ser
- Composables para lógica compartida
- Fácil de testear, entender y mantener

---

## 🏗️ Arquitectura y Estructura

### Organización de Carpetas

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── atomic/         # Componentes atómicos (Button, Input, etc)
│   ├── composed/        # Composiciones de átomos (FormGroup, Card, etc)
│   └── layout/         # Layout y estructura (Header, Sidebar, etc)
├── views/              # Páginas/vistas completas (enrutables)
├── composables/        # Lógica reutilizable (useXXX.js)
├── stores/             # Estado global (Pinia, si lo usas)
├── utils/              # Funciones utilitarias puras
├── services/           # Interacción con APIs
├── types/              # TypeScript types y interfaces
├── assets/             # Imágenes, estilos globales, fuentes
└── main.js             # Punto de entrada
```

### Responsabilidades de Cada Carpeta

| Carpeta | Responsabilidad | Ejemplo |
|---------|-----------------|---------|
| `components/atomic` | Componentes base, sin lógica compleja | `Button.vue`, `Input.vue`, `Icon.vue` |
| `components/composed` | Composiciones de componentes atómicos | `FormField.vue`, `SearchBox.vue` |
| `components/layout` | Estructura de la app | `AppHeader.vue`, `AppSidebar.vue` |
| `views` | Páginas completas, enrutables | `HomePage.vue`, `SettingsPage.vue` |
| `composables` | Lógica reutilizable | `useFetch.js`, `useLocalStorage.js` |
| `stores` | Estado global | Pinia stores |
| `utils` | Funciones puras sin estado | `formatDate.js`, `validators.js` |
| `services` | APIs y comunicación externa | `apiClient.js`, `imageService.js` |
| `types` | TypeScript types globales | `types.ts`, `interfaces.ts` |

### Patrones de Imports/Exports

**✅ BIEN - Importa solo lo que necesitas:**
```javascript
import { computed } from 'vue'
import { useImageStore } from '@/stores/imageStore'
import { formatFileSize } from '@/utils/formatters'
```

**❌ MAL - Importa todo:**
```javascript
import * as Vue from 'vue'
import * as stores from '@/stores'
import * as utils from '@/utils'
```

---

## 🧩 Patrones de Componentes Vue 3

### 1. Componentes Presentacionales (Dumb)

Máxima simplicidad. Solo reciben props, emiten eventos, no tienen lógica.

**✅ BIEN:**
```vue
<template>
  <button 
    :class="['btn', variant]"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn.primary {
  background: #007bff;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

**❌ MAL - Lógica innecesaria:**
```vue
<template>
  <button @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup>
// ❌ Props sin tipos
const props = defineProps(['label', 'variant'])

// ❌ Lógica que no pertenece aquí
function handleClick() {
  if (props.variant === 'primary') {
    console.log('Primary button clicked')
    // ... lógica de negocio
  }
}
</script>
```

---

### 2. Componentes Contenedores (Smart)

Manejan lógica, estado, comunicación con APIs.

**✅ BIEN:**
```vue
<template>
  <div class="image-uploader">
    <DropZone @drop="handleDrop">
      <slot>Arrastra imágenes aquí</slot>
    </DropZone>
    
    <div v-if="uploading" class="progress">
      <ProgressBar :value="uploadProgress" />
    </div>
    
    <div v-if="uploadedImages.length" class="gallery">
      <ImageCard 
        v-for="img in uploadedImages"
        :key="img.id"
        :image="img"
        @delete="removeImage(img.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useImageStore } from '@/stores/imageStore'
import { uploadImages } from '@/services/imageService'
import DropZone from './DropZone.vue'
import ImageCard from './ImageCard.vue'
import ProgressBar from './ProgressBar.vue'

const imageStore = useImageStore()
const uploading = ref(false)
const uploadProgress = ref(0)

const uploadedImages = computed(() => imageStore.images)

async function handleDrop(files: File[]) {
  uploading.value = true
  try {
    await uploadImages(files, (progress) => {
      uploadProgress.value = progress
    })
    imageStore.fetchImages()
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    uploading.value = false
  }
}

function removeImage(imageId: string) {
  imageStore.deleteImage(imageId)
}
</script>
```

---

### 3. Usar `<script setup>` Siempre

Es la forma moderna y limpia en Vue 3.

**✅ BIEN:**
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

const increment = () => count.value++
</script>
```

**❌ ANTIGUO - No uses:**
```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

---

### 4. Props - Específicos y Tipados

Props son el contrato de tu componente.

**✅ BIEN:**
```vue
<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  required?: boolean
  maxLength?: number
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  maxLength: 255
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()
</script>
```

**❌ MAL - Props genéricos:**
```vue
<script setup>
const props = defineProps({
  options: Object,        // ❌ ¿Qué estructura tiene?
  data: Array,           // ❌ ¿Qué contiene?
  config: Object         // ❌ ¿Qué opciones?
})
</script>
```

---

### 5. Slots - Máxima Flexibilidad

Los slots hacen componentes reutilizables.

**✅ BIEN:**
```vue
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header" />
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div class="card-footer">
      <slot name="footer">
        <button @click="$emit('action')">{{ actionLabel }}</button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  actionLabel?: string
}>()

defineEmits<{
  action: []
}>()
</script>
```

**❌ MAL - Hardcodeado:**
```vue
<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <button @click="handleAction">{{ buttonText }}</button>
  </div>
</template>
```

---

### 6. Composables - Lógica Reutilizable

Extrae lógica común a composables con patrón `useXXX`.

**✅ BIEN - `useImageLoader.ts`:**
```typescript
import { ref, computed } from 'vue'
import { loadImage } from '@/services/imageService'

export function useImageLoader() {
  const images = ref<Image[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const hasImages = computed(() => images.value.length > 0)

  const fetch = async (folderId: string) => {
    loading.value = true
    error.value = null
    try {
      images.value = await loadImage(folderId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  const clear = () => {
    images.value = []
  }

  return {
    images,
    loading,
    error,
    hasImages,
    fetch,
    clear
  }
}
```

**Uso en componente:**
```vue
<script setup lang="ts">
import { useImageLoader } from '@/composables/useImageLoader'

const { images, loading, hasImages, fetch } = useImageLoader()

fetch('folder-123')
</script>
```

**❌ MAL - Lógica duplicada en múltiples componentes:**
```vue
<!-- ❌ Repetido en ImageList.vue, ImageGrid.vue, etc -->
<script setup>
const images = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    const response = await fetch('/api/images')
    images.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
```

---

## 📐 SOLID Aplicado a Vue

### S - Single Responsibility Principle

**Un componente = una responsabilidad.**

**❌ MAL - Componente hace demasiado:**
```vue
<template>
  <div>
    <!-- ❌ Renderiza, filtra, ordena, busca, descarga, todo aquí -->
    <input v-model="searchQuery" placeholder="Buscar..." />
    <select v-model="sortBy">
      <option>Nombre</option>
      <option>Fecha</option>
    </select>
    
    <table>
      <tr v-for="image in filteredAndSorted" :key="image.id">
        <td>{{ image.name }}</td>
        <button @click="downloadImage(image.id)">Descargar</button>
        <button @click="deleteImage(image.id)">Eliminar</button>
      </tr>
    </table>
  </div>
</template>
```

**✅ BIEN - Separado en componentes::**
```
ImageGallery.vue (contenedor)
├── ImageFilters.vue (búsqueda y ordenamiento)
├── ImageList.vue (renderiza lista)
│   └── ImageItem.vue (cada imagen)
└── ImageActions.vue (descargar, eliminar)
```

---

### O - Open/Closed Principle

**Abierto para extensión, cerrado para modificación.**

**❌ MAL - Hay que modificar el componente para cada caso:**
```vue
<template>
  <div v-if="type === 'alert'" class="alert">{{ message }}</div>
  <div v-else-if="type === 'success'" class="success">{{ message }}</div>
  <div v-else-if="type === 'error'" class="error">{{ message }}</div>
  <!-- ❌ Cada nuevo tipo requiere modificación -->
</template>
```

**✅ BIEN - Extensible via props:**
```vue
<!-- Alert.vue -->
<template>
  <div :class="['alert', variant]" :style="styles">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info'
})

const styles = computed(() => ({
  borderLeftColor: {
    info: '#007bff',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545'
  }[props.variant]
}))
</script>

<!-- Uso - ninguna modificación al componente -->
<Alert variant="success">✓ Guardado correctamente</Alert>
<Alert variant="error" icon="warning">✗ Error al procesar</Alert>
```

---

### L - Liskov Substitution Principle

**Componentes intercambiables que implementan el mismo contrato.**

**✅ BIEN - Ambos componentes tienen el mismo contrato:**
```vue
<!-- ButtonPrimary.vue y ButtonSecondary.vue comparten la misma interfaz -->

<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  click: []
}>()
</script>
```

Puedes cambiar uno por otro sin romper la app:
```vue
<template>
  <!-- Esos dos son intercambiables -->
  <ButtonPrimary label="Guardar" @click="save" />
  <ButtonSecondary label="Cancelar" @click="cancel" />
</template>
```

**❌ MAL - Contratos diferentes:**
```vue
<!-- Button1.vue: props diferentes -->
<script setup>
defineProps(['text']) // ← 'text'
</script>

<!-- Button2.vue: props diferentes -->
<script setup>
defineProps(['label']) // ← 'label'
</script>

<!-- No son intercambiables -->
```

---

### I - Interface Segregation Principle

**Props específicos, no genéricos con "todo".**

**❌ MAL - Props genérico:**
```vue
<script setup>
const props = defineProps({
  config: Object  // ¿Qué debe contener config?
})

// ¿Es config.title o config.name?
// ¿Tiene config.onClick o config.onAction?
</script>
```

**✅ BIEN - Props específicos:**
```vue
<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
  actions?: Array<{ label: string; onClick: () => void }>
}

defineProps<Props>()
</script>
```

---

### D - Dependency Inversion Principle

**No hardcodees dependencias; inyéctalas.**

**❌ MAL - Hardcodeada:**
```vue
<script setup>
import { useImageStore } from '@/stores/imageStore'
import { fetchFromAPI } from '@/services/api'

// ❌ Componente acoplado a implementación específica
const store = useImageStore()
const data = await fetchFromAPI()
</script>
```

**✅ BIEN - Inyectada via props o composable:**
```vue
<script setup lang="ts">
defineProps<{
  onFetch: () => Promise<Image[]>
  onSave: (image: Image) => Promise<void>
}>()

// Componente agnóstico de la implementación
</script>
```

O con composables:
```typescript
// useImageRepository.ts - abstracción
export function useImageRepository(source: 'api' | 'storage') {
  if (source === 'api') {
    return useAPIImageRepository()
  }
  return useLocalImageRepository()
}
```

---

## 🎚️ Granularidad y Modularización

### Niveles de Componentes

```
ATÓMICOS
├─ Button, Input, Icon, Badge
├─ Simple, sin lógica, altamente reutilizable

MOLECULARES
├─ FormGroup, SearchBox, Card
├─ Combinación de átomos

ORGÁNICOS
├─ ImageGallery, UploadForm, Settings
├─ Lógica compleja, pueden contener moléculas

PÁGINAS
├─ HomePage, SettingsPage, GalleryPage
└─ Vistas completas, enrutables
```

### Regla del Pulgar: ¿Cuándo Crear un Componente?

| Pregunta | Respuesta | Acción |
|----------|-----------|--------|
| ¿Se repite en 2+ lugares? | Sí | Extraer a componente |
| ¿Tiene lógica específica? | Sí | Considerar componente |
| ¿Es complejo de entender? | Sí | Dividir en componentes menores |
| ¿Son solo 2-3 líneas? | Sí | Dejar donde está (KISS) |
| ¿Se puede entender en 30 segundos? | Sí | OK mantener unido |

---

### Ejemplo: Refactorizar de Grande a Granular

**❌ MAL - Un componente gigante (300+ líneas):**
```vue
<!-- ImageGalleryMonolithic.vue -->
<template>
  <!-- Todo aquí: filtros, renderizado, acciones -->
</template>

<script setup>
// Lógica de filtrado, ordenamiento, búsqueda, 
// carga de datos, eliminación, descarga, etc.
// ❌ Imposible de testear, mantener, reutilizar
</script>
```

**✅ BIEN - Varios componentes pequeños:**
```
src/components/
├── ImageGallery.vue (20 líneas - contenedor)
├── ImageFilters.vue (40 líneas - UI de filtros)
├── ImageGrid.vue (30 líneas - renderiza grid)
├── ImageCard.vue (35 líneas - cada imagen)
└── ImageToolbar.vue (25 líneas - acciones)

src/composables/
├── useImageLoader.ts (45 líneas - carga de datos)
├── useImageFilter.ts (40 líneas - lógica de filtrado)
└── useImageActions.ts (50 líneas - edición y eliminación)
```

**Beneficios:**
- ✅ Cada componente testeable en aislamiento
- ✅ Fácil de encontrar y modificar
- ✅ Lógica reutilizable
- ✅ Mantenible

---

## 📝 Convenciones de Código

### Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes Vue | PascalCase | `ImageCard.vue`, `UserProfile.vue` |
| Archivos componentes | kebab-case | `image-card.vue`, `user-profile.vue` |
| Composables | camelCase con `use` prefix | `useImageLoader.ts`, `useFormValidation.ts` |
| Stores | camelCase | `imageStore.ts`, `userStore.ts` |
| Funciones utilitarias | camelCase | `formatDate.ts`, `parseImageUrl.ts` |
| Variables/constantes | camelCase | `imageCount`, `isLoading` |
| Props booleanos | `is*`, `has*` | `isLoading`, `hasError` |
| Funciones event handlers | `handle*` o `on*` | `handleClick`, `onSubmit` |

**✅ BIEN:**
```vue
<script setup lang="ts">
import { useImageLoader } from '@/composables/useImageLoader'
import { formatFileSize } from '@/utils/formatters'

const { images, isLoading } = useImageLoader()

const handleImageSelect = (imageId: string) => {
  // ...
}
</script>
```

**❌ MAL:**
```vue
<script setup>
import { img_loader } from '@/composables' // ❌ snake_case
import { Format_FileSize } from '@/utils'  // ❌ PascalCase

const imgs = ref([])
const loading = ref(false)

const ImageSelect = () => {} // ❌ PascalCase para función
const on_image_click = () => {} // ❌ snake_case
</script>
```

---

### 🇪🇸 Idioma - Español Obligatorio

**TODO el código, documentación y comentarios DEBE estar en español.**

Esto incluye:
- **Nombres de variables y funciones** → camelCase en español
- **Nombres de componentes** → PascalCase en español  
- **Comentarios en el código** → español
- **Documentación de props** → español
- **Textos en templates** → español
- **Errores y mensajes** → español
- **Valores mágicos y constantes** → documentados en español

**✅ BIEN - Todo en español:**
```typescript
// composables/useGaleriaDatos.ts
import { ref, computed } from 'vue'

export function useGaleriaDatos() {
  const imagenes = ref<Imagen[]>([])
  const estaCargando = ref(false)
  const errorMensaje = ref<string | null>(null)

  /** Obtiene las imágenes del servidor */
  const cargarImagenes = async () => {
    estaCargando.value = true
    errorMensaje.value = null
    try {
      const respuesta = await fetch('/api/imagenes')
      imagenes.value = await respuesta.json()
    } catch (error) {
      errorMensaje.value = error instanceof Error ? error.message : 'Error desconocido'
    } finally {
      estaCargando.value = false
    }
  }

  // Filtra imágenes por término de búsqueda
  const imagenesFiltrables = computed(() => {
    const termino = terminoBusqueda.value.toLowerCase()
    return imagenes.value.filter(img =>
      img.nombre.toLowerCase().includes(termino)
    )
  })

  return {
    imagenes,
    estaCargando,
    errorMensaje,
    cargarImagenes,
    imagenesFiltrables
  }
}
```

**✅ BIEN - Componente en español:**
```vue
<template>
  <div class="tarjeta-imagen">
    <img 
      :src="imagen.miniatura"
      :alt="imagen.nombre"
      class="miniatura"
    />
    
    <div class="informacion">
      <h3>{{ imagen.nombre }}</h3>
      <span class="tamanio">{{ formatearTamanioArchivo(imagen.tamanio) }}</span>
    </div>
    
    <div class="acciones">
      <Boton 
        variante="fantasma"
        tamanio="pequeño"
        @click="$emit('descargar')"
        titulo="Descargar archivo"
      >
        <IconoDescargar />
      </Boton>
      <Boton 
        variante="peligro"
        tamanio="pequeño"
        @click="$emit('eliminar')"
        titulo="Eliminar imagen"
      >
        <IconoBasura />
      </Boton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatearTamanioArchivo } from '@/utilidades/formateadores'
import type { Imagen } from '@/tipos'

defineProps<{
  imagen: Imagen
}>()

defineEmits<{
  descargar: []
  eliminar: []
}>()
</script>

<style scoped>
.tarjeta-imagen {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.miniatura {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.informacion {
  flex: 1;
}

.tamanio {
  font-size: 0.875rem;
  color: #666;
}
</style>
```

**❌ MAL - Mezcla de idiomas:**
```typescript
// ❌ Nombres en inglés
const imageList = ref([])
const loadImages = () => {}
const handleClick = () => {}
const errorMessage = ref('')

// ❌ Comentarios en inglés
// This function loads all images from the server
const obtenerImagenes = () => {}

// ❌ Props sin traducir
defineProps<{
  title: string      // ¿Por qué no "titulo"?
  loading: boolean   // ¿Por qué no "estaCargando"?
}>()
```

**Excepciones (solo valores técnicos internos):**
```typescript
// ✅ OK - Imports de librerías externas (no se traducen)
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// ✅ OK - Nombres de APIs externas
const respuesta = await fetch('https://api.externa.com/imagenes')

// ✅ OK - Valores técnicos inamovibles
const solicitudHTTP = await fetch(url, { method: 'POST' })

// ✅ OK - Métodos de librerías
imagenes.value.filter(img => img.nombre.includes(termino))
```

---

### Estructura Interna de Componentes

```vue
<template>
  <!-- Estructura clara y legible -->
</template>

<script setup lang="ts">
// 1. Imports (Vue primero, luego others)
import { computed, ref, onMounted } from 'vue'
import { useImageStore } from '@/stores/imageStore'
import ChildComponent from './ChildComponent.vue'

// 2. Types/Interfaces
interface ImageData {
  id: string
  name: string
}

// 3. Props
const props = defineProps<{
  imageId: string
}>()

// 4. Emits
const emits = defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()

// 5. Refs (state local)
const selectedIndex = ref(0)
const isEditing = ref(false)

// 6. Composables y stores
const imageStore = useImageStore()

// 7. Computed (propiedades derivadas)
const currentImage = computed(() => 
  imageStore.images[selectedIndex.value]
)

// 8. Funciones
const handleSelect = (index: number) => {
  selectedIndex.value = index
  emits('select', imageStore.images[index].id)
}

// 9. Lifecycle hooks
onMounted(() => {
  imageStore.fetchImages()
})
</script>

<style scoped>
/* Estilos locales */
</style>
```

---

### TypeScript Siempre

Vue 3 con TypeScript hace el código más seguro.

**✅ BIEN:**
```vue
<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
}

const props = defineProps<{
  user: User
  onUpdate: (user: User) => Promise<void>
}>()

const handleSave = async (updatedUser: User): Promise<void> => {
  await props.onUpdate(updatedUser)
}
</script>
```

**❌ MAL - Sin tipos:**
```vue
<script setup>
const props = defineProps({
  user: Object,
  onUpdate: Function
})

const handleSave = async (user) => {
  await props.onUpdate(user)
}
</script>
```

---

### Organización dentro de `<script setup>`

**✅ Orden correcto:**
1. Imports
2. Types/Interfaces
3. Props
4. Emits
5. Local refs
6. Stores/Composables
7. Computed
8. Funciones
9. Lifecycle hooks

---

## 🔧 Mantenibilidad

### 1. Documentación de Props

Todos los props deben estar documentados:

**✅ BIEN:**
```vue
<script setup lang="ts">
interface Props {
  /** ID único de la imagen para identificación */
  imageId: string
  
  /** Texto alternativo para accesibilidad */
  alt?: string
  
  /** Si la imagen es seleccionable (default: true) */
  selectable?: boolean
  
  /** Tamaño en píxeles (default: 'md') */
  size?: 'sm' | 'md' | 'lg'
  
  /** Callback al hacer click, recibe el imageId */
  onClick?: (imageId: string) => void
}

withDefaults(defineProps<Props>(), {
  selectable: true,
  size: 'md'
})
</script>
```

---

### 2. Formato de Código

Usa Prettier + ESLint (configurados en el proyecto):

```bash
npm run lint      # ESLint
npm run format    # Prettier
```

**Reglas base:**
- Línea máx 100 caracteres
- 2 espacios de indentación
- Semicolons
- Single quotes para strings

---

### 3. Testing Mindset

Escribe componentes pensando en testing:

**✅ Testeable:**
```vue
<script setup lang="ts">
// ✅ Fácil de testear: solo recibe props, emite eventos
const props = defineProps<{ label: string }>()
const emit = defineEmits<{ click: [] }>()

const handleClick = () => emit('click')
</script>
```

**❌ Difícil de testear:**
```vue
<script setup>
// ❌ Dependencias hardcodeadas, lógica acoplada
const store = useImageStore()
const api = new ImageAPI()

onMounted(() => {
  api.fetchImages().then(images => {
    store.setImages(images)
  })
})
</script>
```

---

### 4. Refactoring Preventivo

No esperes a que el código esté roto para refactorizar:

- Si un componente crece > 150 líneas, divide
- Si ves lógica repetida en 2+ componentes, extrae a composable
- Si un prop tiene 10+ opciones, probablemente necesita redesign
- Si tomas > 5 segundos para entender qué hace, simplifica

---

## 📚 Ejemplos Prácticos

### Ejemplo 1: Componente Mal Hecho vs. Bien Hecho

**❌ MAL - ImageGallery (145 líneas de caos):**
```vue
<template>
  <div>
    <input v-model="q" @input="search" placeholder="Busca..." />
    <select v-model="sort">
      <option>A-Z</option>
      <option>Reciente</option>
    </select>
    
    <div class="loader" v-if="loading">Cargando...</div>
    
    <table v-else>
      <tr v-for="img in filtered" :key="img.id">
        <td>
          <img :src="img.thumb" :alt="img.name" />
          {{ img.name }}
          <span v-if="img.size">{{ Math.round(img.size / 1024) }}KB</span>
        </td>
        <td>
          <button @click="download(img.id)">
            <i class="icon-download" />
          </button>
          <button @click="delete_(img.id)">
            <i class="icon-trash" />
          </button>
          <button @click="edit(img)">
            <i class="icon-edit" />
          </button>
        </td>
      </tr>
    </table>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const q = ref('')
const sort = ref('A-Z')
const images = ref([])
const loading = ref(false)
const error = ref(null)

const filtered = computed(() => {
  let result = images.value.filter(img =>
    img.name.toLowerCase().includes(q.value.toLowerCase())
  )
  
  if (sort.value === 'A-Z') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  return result
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await fetch('/api/images')
    images.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const search = () => {}

const download = async (id) => {
  const res = await fetch(`/api/images/${id}/download`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = images.value.find(img => img.id === id)?.name
  a.click()
}

const delete_ = async (id) => {
  if (!confirm('¿Seguro?')) return
  await fetch(`/api/images/${id}`, { method: 'DELETE' })
  images.value = images.value.filter(img => img.id !== id)
}

const edit = (img) => {
  // ...
}
</script>
```

**✅ BIEN - Dividido en componentes:**

`ImageGallery.vue` (40 líneas - contenedor):
```vue
<template>
  <div class="gallery">
    <ImageFilters 
      v-model:query="filterQuery"
      v-model:sort="sortBy"
    />
    
    <div v-if="loading" class="loader">
      <Spinner />
    </div>
    
    <ImageList 
      v-else
      :images="filteredImages"
      @download="handleDownload"
      @delete="handleDelete"
      @edit="handleEdit"
    />
    
    <Alert v-if="error" variant="error">
      {{ error }}
    </Alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useImageLoader } from '@/composables/useImageLoader'
import ImageFilters from './ImageFilters.vue'
import ImageList from './ImageList.vue'

const filterQuery = ref('')
const sortBy = ref<'name' | 'date'>('name')

const { images, loading, error } = useImageLoader()
const { handleDownload, handleDelete } = useImageActions()

const filteredImages = computed(() =>
  filterImages(images.value, filterQuery.value, sortBy.value)
)

onMounted(() => {
  images.value = fetchImages()
})
</script>
```

`ImageFilters.vue` (35 líneas):
```vue
<template>
  <div class="filters">
    <SearchInput 
      :model-value="query"
      @update:model-value="$emit('update:query', $event)"
      placeholder="Buscar imágenes..."
    />
    
    <SortSelect
      :model-value="sort"
      @update:model-value="$emit('update:sort', $event)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  query: string
  sort: 'name' | 'date'
}>()

defineEmits<{
  'update:query': [value: string]
  'update:sort': [value: 'name' | 'date']
}>()
</script>
```

`ImageList.vue` (45 líneas):
```vue
<template>
  <div class="list">
    <ImageCard
      v-for="image in images"
      :key="image.id"
      :image="image"
      @download="$emit('download', image.id)"
      @delete="$emit('delete', image.id)"
      @edit="$emit('edit', image)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Image } from '@/types'

defineProps<{
  images: Image[]
}>()

defineEmits<{
  download: [id: string]
  delete: [id: string]
  edit: [image: Image]
}>()
</script>
```

`ImageCard.vue` (50 líneas - presentacional):
```vue
<template>
  <div class="card">
    <img 
      :src="image.thumb"
      :alt="image.name"
      class="thumbnail"
    />
    
    <div class="info">
      <h3>{{ image.name }}</h3>
      <span class="size">{{ formatFileSize(image.size) }}</span>
    </div>
    
    <div class="actions">
      <Button 
        variant="ghost"
        size="sm"
        @click="$emit('download')"
        title="Descargar"
      >
        <IconDownload />
      </Button>
      <Button 
        variant="ghost"
        size="sm"
        @click="$emit('edit')"
        title="Editar"
      >
        <IconEdit />
      </Button>
      <Button 
        variant="danger"
        size="sm"
        @click="$emit('delete')"
        title="Eliminar"
      >
        <IconTrash />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Image } from '@/types'
import { formatFileSize } from '@/utils/formatters'

defineProps<{
  image: Image
}>()

defineEmits<{
  download: []
  edit: []
  delete: []
}>()
</script>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
```

**Comparación:**
- ❌ MAL: 1 fichero, 145 líneas, imposible de testear, acoplado
- ✅ BIEN: 4 ficheros, cada uno ~50 líneas, testeable, reutilizable

---

### Ejemplo 2: Composable de Lógica Común

`useImageActions.ts`:
```typescript
import { ref } from 'vue'
import type { Image } from '@/types'
import { downloadImage, deleteImage } from '@/services/imageService'

export function useImageActions() {
  const error = ref<string | null>(null)
  const isProcessing = ref(false)

  const handleDownload = async (imageId: string) => {
    isProcessing.value = true
    error.value = null
    try {
      await downloadImage(imageId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Download failed'
    } finally {
      isProcessing.value = false
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('¿Estás seguro?')) return
    
    isProcessing.value = true
    error.value = null
    try {
      await deleteImage(imageId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Delete failed'
    } finally {
      isProcessing.value = false
    }
  }

  return {
    error,
    isProcessing,
    handleDownload,
    handleDelete
  }
}
```

**Uso en cualquier componente:**
```vue
<script setup lang="ts">
const { handleDownload, handleDelete, error } = useImageActions()

// Ya tienes la lógica, solo usarla
const downloadBtn = async () => await handleDownload(imageId)
</script>
```

---

## ⚠️ Anti-Patrones a Evitar

| Anti-patrón | ❌ Problema | ✅ Solución |
|------------|-----------|----------|
| Props drilling (pasar props por múltiples niveles) | Acoplamiento innecesario | Usar provide/inject o store |
| Lógica en template | Difícil testear, ilegible | Mover a `<script setup>` |
| Componentes gigantes (200+ líneas) | Incomprensible, no testeable | Dividir en componentes menores |
| Two-way binding en props (🚫 `v-model` mal usado) | Efectos secundarios inesperados | Usar emits explícitos |
| API calls en mounted sin cleanup | Memory leaks, requests innecesarias | Usar AbortController, cleanup en unmounted |
| Computed sin dependencias claras | Lógica magica, bugs sutiles | Escribir funciones explícitas |
| Refs en lugar de computed | Reactividad perdida | Usar computed para datos derivados |
| Mutation de props | Violarás el contrato | Emitir cambios, no mutar |

---

## 🧪 Testing

Aunque este proyecto use herramientas específicas de testing, sigue estos principios:

- **Aislamiento**: Un componente debe poder testearse sin sus hijos
- **Mocking**: Las dependencias externas deben ser mocked
- **Semantics**: Testea comportamiento, no detalles de implementación
- **Coverage**: Apunta a >80% de cobertura

**Ejemplo conceptual:**
```typescript
// ✅ BIEN - Testeable
describe('ImageCard', () => {
  it('emits delete when delete button clicked', () => {
    const wrapper = mount(ImageCard, {
      props: { image: mockImage }
    })
    
    wrapper.find('[title="Eliminar"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })
})

// ❌ MAL - Acoplado a detalles internos
it('calls deleteImage api when button clicked', async () => {
  // Testea implementación, no comportamiento
})
```

---

## 🚀 Checklist antes de Hacer Commit

Antes de hacer commit, verifica:

- [ ] **TODO en español**: Variables, funciones, comentarios, documentación en español
- [ ] Código sigue nombrado correcto (PascalCase componentes, camelCase funciones)
- [ ] Props tipados con TypeScript
- [ ] Componentes < 150 líneas (si no, dividir)
- [ ] Lógica repetida está en composables
- [ ] Sin console.log en producción
- [ ] Estilos locales (scoped)
- [ ] Sin hardcoding de valores mágicos
- [ ] Funciones documentadas
- [ ] Props documentados
- [ ] Componente testeable en aislamiento
- [ ] KISS primero, SOLID después
- [ ] Ejecuta `npm run lint` y `npm run format`

---

## 🌿 Flujo de Trabajo con Ramas

Este proyecto utiliza un **Git Flow** simplificado para desarrollo y cambios. Sigue este flujo para todas las nuevas características, correcciones y mejoras.

### Estructura de Ramas

```
main (producción)
  ↑
  └─ develop (desarrollo e integración)
      ↑
      ├─ feature/* (nuevas características)
      ├─ fix/* (correcciones de bugs)
      └─ improve/* (mejoras y refactoring)
```

### Ramas Principales

| Rama | Propósito | Regla |
|------|-----------|-------|
| `main` | Código en producción | Solo merges desde `develop` |
| `develop` | Integración de cambios | Recibe PRs de feature/fix/improve |

### Ramas de Trabajo

| Patrón | Propósito | Ejemplo |
|--------|-----------|---------|
| `feature/*` | Nueva característica | `feature/galeria-imagenes` |
| `fix/*` | Corrección de bug | `fix/tema-oscuro-no-persiste` |
| `improve/*` | Mejora o refactoring | `improve/optimizar-componentes` |

### Proceso Paso a Paso

#### 1. **Crear una Rama para tu Trabajo**

```bash
# Asegúrate de estar en develop y actualizado
git checkout develop
git pull origin develop

# Crea tu rama de trabajo desde develop
git checkout -b feature/nombre-descriptivo

# O directamente:
git checkout -b feature/nombre-descriptivo origin/develop
```

**Convención de nombres:**
- Usa kebab-case: `feature/agregar-busqueda`
- Descriptivo y corto: ¿Qué hace? → nombre
- ❌ MAL: `feature/cambios`, `feature/fix1`
- ✅ BIEN: `feature/filtro-imagenes`, `fix/error-carga`

---

#### 2. **Trabajar en tu Rama**

```bash
# Desarrolla normalmente
git add archivo.vue
git commit -m "Agregar componente Filtro"

# Commit messages en español, explicativos
# ✅ BIEN: "Añadir filtro por tamaño en galería"
# ❌ MAL: "cambios", "fix"
```

**Checklist antes de commitear:**
- [ ] TODO en español ✓
- [ ] Componentes < 150 líneas
- [ ] Props tipados
- [ ] Sin console.log
- [ ] Estilos scoped
- [ ] KISS primero, SOLID después
- [ ] `npm run lint` pasa

---

#### 3. **Push a Remote y Crear PR**

```bash
# Push tu rama a origin
git push -u origin feature/nombre-descriptivo

# Crear PR usando GitHub CLI
gh pr create --base develop --title "Descripción breve" \
  --body "
## Resumen
Qué cambios haces

## Verificación
- [ ] npm run lint sin errores
- [ ] npm run build exitoso
- [ ] Cambios probados localmente

## Type
- [ ] Feature
- [ ] Fix
- [ ] Improvement
"
```

**Estructura de PR:**
- Título: claro y descriptivo (< 70 caracteres)
- Descripción: qué, por qué, cómo
- Checklist: verificación manual

---

#### 4. **Revisión y Aprobación**

- La PR será revisada según directrices de Agents.md
- Integra feedback
- Asegura que CI/CD pase (si está configurado)

---

#### 5. **Merge a develop**

```bash
# Una vez aprobada, merge desde GitHub (opción "Squash and merge" recomendado)
# O mediante CLI:
gh pr merge <número> --squash --body "Commit message"
```

---

#### 6. **Limpieza de Rama Local**

```bash
# Elimina tu rama local
git branch -D feature/nombre-descriptivo

# Actualiza develop local
git checkout develop
git pull origin develop
```

---

### Flujo Completo para Producción

```bash
# 1. Desarrollo en feature (descrito arriba)

# 2. Merge feature → develop (vía PR)

# 3. Cuando develop está listo para producción:
git checkout main
git pull origin main
git merge develop
git push origin main

# 4. Crear release tag (opcional):
git tag v0.2.0
git push origin v0.2.0

# 5. Después de merge a main, sincronizar develop:
git checkout develop
git pull origin develop
```

---

### Ejemplo Real: Agregar Nueva Característica

```bash
# 1. Crear rama
git checkout develop
git pull origin develop
git checkout -b feature/agregar-descarga-imagenes

# 2. Crear componentes
# (Crear DescargadorImagenes.vue, useDescargas.ts, etc)
# Seguir patrones de Agents.md

# 3. Commits locales
git add src/components/
git commit -m "Agregar componente DescargadorImagenes"
git add src/composables/
git commit -m "Agregar lógica de descargas con useDescargas"

# 4. Push y PR
git push -u origin feature/agregar-descarga-imagenes
gh pr create --base develop \
  --title "Agregar descarga de imágenes" \
  --body "Permite descargar imágenes individuales o en lotes"

# 5. (Usuario revisa y aprueba)

# 6. Merge (desde GitHub)

# 7. Actualizar local
git checkout develop
git pull origin develop
git branch -D feature/agregar-descarga-imagenes
```

---

### Reglas de Oro

✅ **SIEMPRE:**
- Crear rama desde `develop`
- PR para cualquier cambio (incluso pequeños)
- Hacer commits descriptivos en español
- Revisar código antes de mergear
- Mantener ramas limpias y actualizadas

❌ **NUNCA:**
- Commitear directamente a `main` o `develop`
- Push force (`git push --force`)
- Ignorar linting o errores de build
- Mezclar múltiples características en una PR
- Dejar ramas abandonadas sin eliminar

---

### troubleshooting

**¿Mi rama está desactualizada?**
```bash
git fetch origin
git rebase origin/develop
```

**¿Cometí error en el commit?**
```bash
# Cambiar mensaje: git commit --amend
# Deshacer commit: git reset HEAD~1
```

**¿Necesito mergear develop en mi rama?**
```bash
git fetch origin
git merge origin/develop
```

---

## 📞 Dudas o Preguntas

Si algo no está claro:
1. Revisa esta guía nuevamente
2. Busca ejemplos en el proyecto existente
3. Aplica KISS: solución más simple primero
4. Si aún tienes dudas, consulta con el equipo

---

**Última actualización:** 2026-04-25
**Versión:** 1.1 (Incluye flujo de ramas)
