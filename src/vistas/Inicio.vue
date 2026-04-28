<template>
  <div class="contenedor-inicio">
    <section class="seccion-bienvenida">
      <div class="contenido-bienvenida">
        <h2>Bienvenido a Football Data Analyzer</h2>
        <p>
          Plataforma especializada en análisis y visualización de datos de fútbol.
          Descubre estadísticas, análisis detallados y proyecciones de tu equipo favorito.
        </p>
        <button class="boton-primario">Comenzar Análisis</button>
      </div>
    </section>

    <section class="seccion-caracteristicas">
      <h2>Características Principales</h2>
      <div class="caracteristicas-grid">
        <div class="caracteristica-card">
          <div class="icono">📊</div>
          <h3>Análisis Estadístico</h3>
          <p>Análisis profundo de estadísticas de equipos y jugadores</p>
        </div>
        <div class="caracteristica-card">
          <div class="icono">📈</div>
          <h3>Visualizaciones</h3>
          <p>Gráficos interactivos y dashboards personalizables</p>
        </div>
        <div class="caracteristica-card">
          <div class="icono">🎯</div>
          <h3>Proyecciones</h3>
          <p>Predicciones basadas en datos históricos y tendencias</p>
        </div>
        <div class="caracteristica-card">
          <div class="icono">⚡</div>
          <h3>Actualizaciones en Tiempo Real</h3>
          <p>Información siempre actualizada de matches y jugadores</p>
        </div>
      </div>
    </section>

    <section class="seccion-llamada">
      <h2>¿Listo para empezar?</h2>
      <p>Accede a herramientas avanzadas de análisis de fútbol</p>
      <button class="boton-secundario">Explorar Herramientas</button>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.contenedor-inicio {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.seccion-bienvenida {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-secondary) 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-bottom: 4rem;
  text-align: center;
}

.contenido-bienvenida h2 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.contenido-bienvenida p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.boton-primario {
  background-color: white;
  color: var(--color-secondary);
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.boton-primario:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.seccion-caracteristicas {
  margin-bottom: 4rem;
}

.seccion-caracteristicas h2 {
  text-align: center;
  font-size: 2rem;
  margin: 0 0 3rem 0;
  color: var(--color-text);
}

.caracteristicas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.caracteristica-card {
  background-color: var(--color-primary);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(79, 70, 229, 0.1);
}

.caracteristica-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(79, 70, 229, 0.15);
}

.icono {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.caracteristica-card h3 {
  font-size: 1.3rem;
  margin: 0 0 0.75rem 0;
  color: var(--color-secondary);
  font-weight: 700;
}

.caracteristica-card p {
  margin: 0;
  color: var(--color-shadow);
  line-height: 1.5;
  font-size: 0.95rem;
}

.seccion-llamada {
  background-color: var(--color-secondary);
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  text-align: center;
}

.seccion-llamada h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.seccion-llamada p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
}

.boton-secundario {
  background-color: transparent;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.boton-secundario:hover {
  background-color: white;
  color: var(--color-secondary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contenedor-inicio {
    padding: 1rem;
  }

  .seccion-bienvenida {
    padding: 2rem 1.5rem;
    margin-bottom: 2rem;
  }

  .contenido-bienvenida h2 {
    font-size: 1.8rem;
  }

  .contenido-bienvenida p {
    font-size: 1rem;
  }

  .seccion-caracteristicas h2 {
    font-size: 1.5rem;
  }

  .caracteristicas-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .seccion-llamada {
    padding: 2rem 1.5rem;
  }

  .seccion-llamada h2 {
    font-size: 1.5rem;
  }
}
</style>
