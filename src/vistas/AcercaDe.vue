<template>
  <div class="contenedor-pagina">
    <h1>Acerca de Football Data Analyzer</h1>
    
    <section class="seccion">
      <h2>Nuestra Misión</h2>
      <p>
        Football Data Analyzer nace con la misión de democratizar el acceso a datos y análisis
        avanzados de fútbol. Creemos que cada aficionado, analista y profesional del deporte
        merece acceso a herramientas potentes para entender el juego desde una perspectiva
        basada en datos.
      </p>
    </section>

    <section class="seccion">
      <h2>¿Qué Ofrecemos?</h2>
      <ul class="lista">
        <li>Análisis estadísticos profundos de equipos y jugadores</li>
        <li>Visualizaciones interactivas de datos históricos</li>
        <li>Proyecciones y predicciones basadas en machine learning</li>
        <li>Seguimiento en tiempo real de partidos y competiciones</li>
        <li>Comparativas detalladas entre jugadores y equipos</li>
        <li>Reportes personalizables y exportables</li>
      </ul>
    </section>

    <section class="seccion">
      <h2>Tecnología</h2>
      <p>
        Utilizamos las tecnologías más modernas en desarrollo web y análisis de datos:
      </p>
      <div class="tech-stack">
        <div class="tech-item">
          <strong>Frontend:</strong> Vue 3, Vite, TypeScript
        </div>
        <div class="tech-item">
          <strong>Data:</strong> Análisis estadístico avanzado, visualizaciones en tiempo real
        </div>
        <div class="tech-item">
          <strong>Infraestructura:</strong> Cloudflare Pages, APIs RESTful
        </div>
      </div>
    </section>

    <section class="seccion">
      <h2>Nuestro Equipo</h2>
      <p>
        Somos un equipo apasionado por el fútbol y la tecnología. Combinamos años de experiencia
        en análisis deportivo con conocimientos profundos en desarrollo de software para crear
        herramientas que realmente marcan la diferencia.
      </p>
    </section>

    <section class="seccion">
      <h2>Contacto</h2>
      <p>
        ¿Preguntas o sugerencias? Nos encantaría escucharte.
        <RouterLink to="/contacto" class="enlace">Ponte en contacto con nosotros</RouterLink>.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.contenedor-pagina {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--color-secondary);
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  text-align: center;
}

.seccion {
  margin-bottom: 3rem;
}

.seccion h2 {
  color: var(--color-secondary);
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

.seccion p {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 1rem;
  margin: 0 0 1rem 0;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lista li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: var(--color-text);
  line-height: 1.6;
}

.lista li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: bold;
  font-size: 1.2rem;
}

.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.tech-item {
  background-color: var(--color-primary);
  padding: 1rem;
  border-left: 4px solid var(--color-accent);
  border-radius: 4px;
  color: var(--color-text);
}

.tech-item strong {
  color: var(--color-secondary);
}

.enlace {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.enlace:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .contenedor-pagina {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .seccion h2 {
    font-size: 1.5rem;
  }

  .lista li {
    padding-left: 1.5rem;
  }
}
</style>
