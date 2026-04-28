<template>
  <div class="analizador-penaltis">
    <div class="encabezado-seccion">
      <h1>📊 Análisis de Penaltis - Competiciones Europeas</h1>
      <p>Estadísticas y análisis detallados de penaltis en competiciones europeas</p>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <div class="filtro-grupo">
        <label>Competición:</label>
        <select v-model="filtroCompeticion">
          <option v-for="comp in competiciones" :key="comp" :value="comp">
            {{ comp }}
          </option>
        </select>
      </div>

      <div class="filtro-grupo">
        <label>Equipo:</label>
        <select v-model="filtroEquipo">
          <option v-for="eq in equipos" :key="eq" :value="eq">
            {{ eq }}
          </option>
        </select>
      </div>

      <div class="filtro-grupo">
        <label>Ordenar por:</label>
        <select v-model="ordenar">
          <option value="fecha">Fecha (Reciente)</option>
          <option value="minuto">Minuto</option>
          <option value="jugador">Jugador</option>
        </select>
      </div>

      <button @click="limpiarFiltros" class="boton-limpiar">
        🔄 Limpiar Filtros
      </button>
    </div>

    <!-- Estadísticas Resumidas -->
    <div class="estadisticas-resumen">
      <div class="tarjeta-stat">
        <div class="numero">{{ estadisticasResultado.total }}</div>
        <div class="etiqueta">Total de Penaltis</div>
      </div>
      <div class="tarjeta-stat exito">
        <div class="numero">{{ estadisticasResultado.goles }}</div>
        <div class="etiqueta">Goles Convertidos</div>
      </div>
      <div class="tarjeta-stat advertencia">
        <div class="numero">{{ estadisticasResultado.parados }}</div>
        <div class="etiqueta">Penaltis Parados</div>
      </div>
      <div class="tarjeta-stat error">
        <div class="numero">{{ estadisticasResultado.fallidos }}</div>
        <div class="etiqueta">Fallos</div>
      </div>
    </div>

    <!-- Grid de Gráficos -->
    <div class="grid-graficos">
      <div class="grafico-contenedor">
        <h3>Resultados Totales</h3>
        <canvas id="graficaPie"></canvas>
      </div>

      <div class="grafico-contenedor">
        <h3>Penaltis por Competición</h3>
        <canvas id="graficaBarras"></canvas>
      </div>

      <div class="grafico-contenedor ancho-completo">
        <h3>Tendencia Temporal</h3>
        <canvas id="graficaLinea"></canvas>
      </div>
    </div>

    <!-- Tablas de Datos -->
    <div class="seccion-datos">
      <div class="tabla-contenedor">
        <h3>Equipos con Más Penaltis</h3>
        <table class="tabla">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Penaltis</th>
              <th>Conversión (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in equiposTopPenaltis" :key="eq.equipo">
              <td>{{ eq.equipo }}</td>
              <td class="centrado">{{ eq.penaltis }}</td>
              <td class="centrado">
                <span class="badge" :class="{ exito: eq.conversion > 75, advertencia: eq.conversion <= 75 }">
                  {{ eq.conversion }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tabla-contenedor">
        <h3>Mejores Tiradores</h3>
        <table class="tabla">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Penaltis</th>
              <th>Goles</th>
              <th>Conversión (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="jug in jugadoresTop" :key="jug.jugador">
              <td>{{ jug.jugador }}</td>
              <td class="centrado">{{ jug.penaltis }}</td>
              <td class="centrado">{{ jug.goles }}</td>
              <td class="centrado">
                <span class="badge" :class="{ exito: jug.tasaConversion > 75, advertencia: jug.tasaConversion <= 75 }">
                  {{ jug.tasaConversion }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabla Detallada de Penaltis -->
    <div class="tabla-detallada">
      <h3>Detalle de Penaltis ({{ penaltisFiltrados.length }})</h3>
      <div class="tabla-scroll">
        <table class="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Competición</th>
              <th>Equipo</th>
              <th>Rival</th>
              <th>Jugador</th>
              <th>Min.</th>
              <th>Resultado</th>
              <th>Razón</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pen in penaltisFiltrados" :key="pen.id" :class="['resultado-' + pen.resultado]">
              <td>{{ formatearFecha(pen.fecha) }}</td>
              <td><span class="badge-comp">{{ pen.competicion }}</span></td>
              <td class="equipo-local">{{ pen.equipo }}</td>
              <td class="equipo-visitante">{{ pen.rival }}</td>
              <td>{{ pen.jugador }}</td>
              <td class="centrado">{{ pen.minuto }}'</td>
              <td class="centrado">
                <span class="resultado-badge" :class="'resultado-' + pen.resultado">
                  {{ formatearResultado(pen.resultado) }}
                </span>
              </td>
              <td>{{ pen.razon }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePenaltisData } from '@/composables/usePenaltisData'
import Chart from 'chart.js/auto'

const {
  penaltisFiltrados,
  estadisticasResultado,
  competiciones,
  equipos,
  filtroCompeticion,
  filtroEquipo,
  ordenar,
  datosGraficaPie,
  datosGraficaBarras,
  datosGraficaLinea,
  equiposTopPenaltis,
  jugadoresTop
} = usePenaltisData()

// Variables para las gráficas
let chartPie: Chart
let chartBarras: Chart
let chartLinea: Chart

const limpiarFiltros = () => {
  filtroCompeticion.value = 'Todos'
  filtroEquipo.value = 'Todos'
  ordenar.value = 'fecha'
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatearResultado = (resultado: string) => {
  const resultados: Record<string, string> = {
    gol: '⚽ Gol',
    parado: '🛡️ Parado',
    fuera: '❌ Fuera'
  }
  return resultados[resultado] || resultado
}

onMounted(() => {
  // Gráfica de Pie
  const ctxPie = document.getElementById('graficaPie') as HTMLCanvasElement
  if (chartPie) chartPie.destroy()
  chartPie = new Chart(ctxPie, {
    type: 'doughnut',
    data: datosGraficaPie.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })

  // Gráfica de Barras
  const ctxBarras = document.getElementById('graficaBarras') as HTMLCanvasElement
  if (chartBarras) chartBarras.destroy()
  chartBarras = new Chart(ctxBarras, {
    type: 'bar',
    data: datosGraficaBarras.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  })

  // Gráfica de Línea
  const ctxLinea = document.getElementById('graficaLinea') as HTMLCanvasElement
  if (chartLinea) chartLinea.destroy()
  chartLinea = new Chart(ctxLinea, {
    type: 'line',
    data: datosGraficaLinea.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  })
})
</script>

<style scoped>
.analizador-penaltis {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-primary);
  color: var(--color-text);
}

.encabezado-seccion {
  margin-bottom: 2rem;
  text-align: center;
}

.encabezado-seccion h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-secondary);
}

.encabezado-seccion p {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

/* Filtros */
.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(79, 70, 229, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-secondary);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-grupo label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-secondary);
}

.filtro-grupo select {
  padding: 0.75rem;
  border: 1px solid var(--color-secondary);
  border-radius: 4px;
  background-color: var(--color-primary);
  color: var(--color-text);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filtro-grupo select:hover {
  border-color: var(--color-accent);
}

.boton-limpiar {
  padding: 0.75rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-end;
}

.boton-limpiar:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Estadísticas */
.estadisticas-resumen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.tarjeta-stat {
  padding: 1.5rem;
  background: rgba(79, 70, 229, 0.1);
  border: 2px solid var(--color-secondary);
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s ease;
}

.tarjeta-stat:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.2);
}

.tarjeta-stat .numero {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}

.tarjeta-stat.exito .numero {
  color: #22c55e;
}

.tarjeta-stat.advertencia .numero {
  color: #f59e0b;
}

.tarjeta-stat.error .numero {
  color: #ef4444;
}

.tarjeta-stat .etiqueta {
  font-size: 0.95rem;
  opacity: 0.8;
}

/* Gráficos */
.grid-graficos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.grafico-contenedor {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
}

.grafico-contenedor.ancho-completo {
  grid-column: 1 / -1;
}

.grafico-contenedor h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-secondary);
  font-size: 1.2rem;
}

/* Tablas */
.seccion-datos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.tabla-contenedor {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
}

.tabla-contenedor h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-secondary);
  font-size: 1.1rem;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead {
  background: var(--color-secondary);
  color: white;
}

.tabla th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.tabla td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
}

.tabla tbody tr:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

.tabla td.centrado {
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge.exito {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.badge.advertencia {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.badge-comp {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: var(--color-accent);
  color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Tabla Detallada */
.tabla-detallada {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.tabla-detallada h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-secondary);
  font-size: 1.2rem;
}

.tabla-scroll {
  overflow-x: auto;
}

.tabla tbody tr.resultado-gol {
  border-left: 4px solid #22c55e;
}

.tabla tbody tr.resultado-parado {
  border-left: 4px solid #ef4444;
}

.tabla tbody tr.resultado-fuera {
  border-left: 4px solid #f59e0b;
}

.resultado-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
}

.resultado-badge.resultado-gol {
  background-color: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.resultado-badge.resultado-parado {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.resultado-badge.resultado-fuera {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.equipo-local {
  font-weight: 600;
  color: var(--color-secondary);
}

.equipo-visitante {
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .analizador-penaltis {
    padding: 1rem;
  }

  .encabezado-seccion h1 {
    font-size: 1.8rem;
  }

  .grid-graficos {
    grid-template-columns: 1fr;
  }

  .tabla-scroll {
    overflow-x: auto;
  }

  .tabla th,
  .tabla td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}
</style>
