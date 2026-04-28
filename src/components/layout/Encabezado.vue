<template>
  <header class="encabezado">
    <div class="encabezado-contenedor">
      <div class="logo">
        <h1>📊 Analizador de Fútbol</h1>
      </div>
      
      <nav class="navegacion">
        <RouterLink 
          v-for="enlace in enlaces"
          :key="enlace.nombre"
          :to="enlace.ruta"
          class="enlace-nav"
          active-class="activo"
        >
          {{ enlace.nombre }}
        </RouterLink>
      </nav>

      <div class="controles">
        <label class="interruptor">
          <input type="checkbox" @change="toggleTema" :checked="esModoOscuro">
          <span class="deslizador"></span>
        </label>
        <span class="etiqueta-tema">{{ esModoOscuro ? '🌙' : '☀️' }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Enlace {
  nombre: string
  ruta: string
}

defineProps<{
  esModoOscuro: boolean
  enlaces: Enlace[]
}>()

const emit = defineEmits<{
  'toggle-tema': []
}>()

const toggleTema = () => {
  emit('toggle-tema')
}
</script>

<style scoped>
.encabezado {
  background-color: var(--color-secondary);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.encabezado-contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.navegacion {
  display: flex;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.enlace-nav {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.enlace-nav:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.enlace-nav.activo {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid white;
}

.controles {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.etiqueta-tema {
  font-size: 1.5rem;
  white-space: nowrap;
}

/* Interruptor de tema */
.interruptor {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.interruptor input {
  opacity: 0;
  width: 0;
  height: 0;
}

.deslizador {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  transition: 0.3s;
  border-radius: 28px;
}

.deslizador:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .deslizador {
  background-color: rgba(255, 255, 255, 0.5);
}

input:checked + .deslizador:before {
  transform: translateX(22px);
}

@media (max-width: 768px) {
  .encabezado-contenedor {
    flex-direction: column;
    gap: 1rem;
  }

  .navegacion {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .enlace-nav {
    display: block;
    width: 100%;
    text-align: center;
  }

  .controles {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
