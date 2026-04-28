<script setup>
import { ref } from 'vue'
import Encabezado from './components/layout/Encabezado.vue'
import Pie from './components/layout/Pie.vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

// Set initial theme
document.documentElement.setAttribute('data-theme', 'light')

const enlaces = [
  { nombre: 'Inicio', ruta: '/' },
  { nombre: 'Europa', ruta: '/penaltis-europa' },
  { nombre: 'Penaltis', ruta: '/penaltis' },
  { nombre: 'Acerca de', ruta: '/acerca-de' },
  { nombre: 'Contacto', ruta: '/contacto' }
]
</script>

<template>
  <div class="aplicacion">
    <Encabezado 
      :es-modo-oscuro="isDarkMode"
      :enlaces="enlaces"
      @toggle-tema="toggleDarkMode"
    />

    <main class="contenido-principal">
      <RouterView />
    </main>

    <Pie />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-primary);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.aplicacion {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contenido-principal {
  flex: 1;
  width: 100%;
}
</style>
