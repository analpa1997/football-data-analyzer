<template>
  <footer class="pie">
    <div class="pie-contenedor">
      <section class="pie-seccion">
        <h3>Enlaces Rápidos</h3>
        <nav class="enlaces-pie">
          <a 
            v-for="enlace in enlacesPie"
            :key="enlace.nombre"
            :href="enlace.url"
            :target="enlace.externo ? '_blank' : '_self'"
            :rel="enlace.externo ? 'noopener noreferrer' : ''"
            class="enlace-pie"
          >
            {{ enlace.nombre }}
          </a>
        </nav>
      </section>

      <section class="pie-seccion">
        <h3>Información</h3>
        <p class="texto-pie">
          {{ descripcion }}
        </p>
      </section>

      <section class="pie-seccion">
        <h3>Redes Sociales</h3>
        <div class="redes-sociales">
          <a 
            v-for="red in redesSociales"
            :key="red.nombre"
            :href="red.url"
            :title="red.nombre"
            target="_blank"
            rel="noopener noreferrer"
            class="enlace-red"
          >
            {{ red.icono }}
          </a>
        </div>
      </section>
    </div>

    <div class="pie-inferior">
      <p>&copy; {{ anio }} {{ nombre }}. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface EnlacePie {
  nombre: string
  url: string
  externo?: boolean
}

interface RedSocial {
  nombre: string
  icono: string
  url: string
}

const anio = ref(new Date().getFullYear())
const nombre = ref('Football Data Analyzer')
const descripcion = ref('Plataforma de análisis y visualización de datos de fútbol.')

const enlacesPie = ref<EnlacePie[]>([
  { nombre: 'Inicio', url: '/' },
  { nombre: 'Acerca de', url: '/acerca-de' },
  { nombre: 'Contacto', url: '/contacto' },
  { nombre: 'Política de Privacidad', url: '/privacidad' }
])

const redesSociales = ref<RedSocial[]>([
  { nombre: 'GitHub', icono: '🐙', url: 'https://github.com' },
  { nombre: 'Twitter', icono: '𝕏', url: 'https://twitter.com' },
  { nombre: 'LinkedIn', icono: '🔗', url: 'https://linkedin.com' }
])
</script>

<style scoped>
.pie {
  background-color: var(--color-secondary);
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pie-contenedor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.pie-seccion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pie-seccion h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.enlaces-pie {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.enlace-pie {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: fit-content;
}

.enlace-pie:hover {
  color: white;
  transform: translateX(4px);
}

.texto-pie {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.redes-sociales {
  display: flex;
  gap: 1rem;
}

.enlace-red {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
}

.enlace-red:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
}

.pie-inferior {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pie-inferior p {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .pie-contenedor {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }

  .pie-seccion h3 {
    font-size: 1rem;
  }

  .enlaces-pie {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .redes-sociales {
    gap: 0.5rem;
  }

  .enlace-red {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
}
</style>
