<template>
  <div class="analizador">
    <div class="header">
      <h1>⚽ Análisis de Penaltis - Ligas Europeas</h1>
      <p>{{ metadatos.totalRegistros }} equipos limpios | Reducción: {{ metadatos.registrosBorrados }} registros vacíos</p>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <div class="grupo-filtro">
        <label>Temporada</label>
        <select v-model="filtroTemporada">
          <option v-for="t in temporadas" :key="t" :value="t">{{ t === 'Todos' ? 'Todas' : t }}</option>
        </select>
      </div>
      <div class="grupo-filtro">
        <label>País</label>
        <select v-model="filtroPais">
          <option v-for="p in paises" :key="p" :value="p">{{ p === 'Todos' ? 'Todos' : p }}</option>
        </select>
      </div>
      <div class="grupo-filtro">
        <label>Equipo</label>
        <select v-model="filtroEquipo">
          <option v-for="e in listaEquipos" :key="e" :value="e">{{ e === 'Todos' ? 'Todos' : e }}</option>
        </select>
      </div>
      <div class="grupo-filtro">
        <label>Ordenar por</label>
        <select v-model="ordenar">
          <option value="penaltis">Penaltis</option>
          <option value="saldo">Saldo</option>
          <option value="amarillas">Amarillas</option>
        </select>
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">{{ estadisticas.totalEquipos }}</div>
        <div class="stat-label">Equipos</div>
      </div>
      <div class="stat-card exito">
        <div class="stat-value">{{ estadisticas.totalPenaltisAFavor }}</div>
        <div class="stat-label">Penaltis Favor</div>
      </div>
      <div class="stat-card error">
        <div class="stat-value">{{ estadisticas.totalPenaltisEnContra }}</div>
        <div class="stat-label">Penaltis Contra</div>
      </div>
      <div class="stat-card info">
        <div class="stat-value">{{ estadisticas.promedioPenaltis }}</div>
        <div class="stat-label">Promedio/Equipo</div>
      </div>
    </div>

    <!-- Gráficas - Fila 1 -->
    <div class="graficas">
      <div class="grafica-contenedor">
        <h3>📊 Top 10 Equipos por Penaltis</h3>
        <canvas id="chartDistribucion"></canvas>
      </div>
      <div class="grafica-contenedor">
        <h3>📈 Tendencias de Penaltis por Temporada</h3>
        <canvas id="chartTendencias"></canvas>
      </div>
    </div>

    <!-- Gráficas - Fila 2 -->
    <div class="graficas">
      <div class="grafica-contenedor">
        <h3>🎯 Top 5 - Saldo de Penaltis</h3>
        <canvas id="chartSaldo"></canvas>
      </div>
      <div class="grafica-contenedor">
        <h3>🌍 Top 10 Países por Penaltis</h3>
        <canvas id="chartPaises"></canvas>
      </div>
    </div>

    <!-- Tablas -->
    <div class="tablas-container">
      <div class="tabla-seccion">
        <h3>📍 Distribución por País</h3>
        <table class="tabla">
          <thead>
            <tr>
              <th @click="ordenarPor('pais')" class="sorteable">
                País 
                <span v-if="ordenarTabla === 'pais'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="ordenarPor('equipos')" class="sorteable centrado">
                Equipos
                <span v-if="ordenarTabla === 'equipos'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="ordenarPor('penaltis')" class="sorteable centrado">
                Penaltis Total
                <span v-if="ordenarTabla === 'penaltis'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="ordenarPor('promedio')" class="sorteable centrado">
                Promedio
                <span v-if="ordenarTabla === 'promedio'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="ordenarPor('amarillas')" class="sorteable centrado">
                Amarillas
                <span v-if="ordenarTabla === 'amarillas'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pais, idx) in distribucionPaises.slice(0, 10)" :key="idx">
              <td class="pais">{{ pais.pais }}</td>
              <td class="centrado">{{ pais.cantidad }}</td>
              <td class="centrado exito">{{ pais.penaltis }}</td>
              <td class="centrado">{{ pais.promedioPenaltis }}</td>
              <td class="centrado">{{ pais.amarillas }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tabla-seccion">
        <h3>⚽ Equipos Filtrados ({{ equiposOrdenados.length }})</h3>
        <div class="tabla-scroll">
          <table class="tabla">
            <thead>
              <tr>
                <th @click="ordenarPor('equipo')" class="sorteable">
                  Equipo
                  <span v-if="ordenarTabla === 'equipo'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('pais')" class="sorteable">
                  País
                  <span v-if="ordenarTabla === 'pais'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('temporada')" class="sorteable centrado">
                  Año
                  <span v-if="ordenarTabla === 'temporada'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('aFavor')" class="sorteable centrado">
                  Favor
                  <span v-if="ordenarTabla === 'aFavor'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('enContra')" class="sorteable centrado">
                  Contra
                  <span v-if="ordenarTabla === 'enContra'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('saldo')" class="sorteable centrado">
                  Saldo
                  <span v-if="ordenarTabla === 'saldo'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('amarillas')" class="sorteable centrado">
                  Amarillas
                  <span v-if="ordenarTabla === 'amarillas'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="ordenarPor('rojas')" class="sorteable centrado">
                  Rojas
                  <span v-if="ordenarTabla === 'rojas'" class="sort-icon">{{ dirOrden === 'asc' ? '↑' : '↓' }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="eq in equiposOrdenados" :key="eq.id">
                <td class="equipo">{{ eq.equipo }}</td>
                <td>{{ eq.nombrePais }}</td>
                <td class="centrado">{{ eq.temporada }}</td>
                <td class="centrado exito">{{ eq.penaltis.aFavor }}</td>
                <td class="centrado error">{{ eq.penaltis.enContra }}</td>
                <td class="centrado" :class="eq.penaltis.saldo > 0 ? 'exito' : 'error'">
                  {{ eq.penaltis.saldo }}
                </td>
                <td class="centrado">{{ eq.tarjetas.amarillasAlRival + eq.tarjetas.amarillasRecibidas }}</td>
                <td class="centrado">{{ eq.tarjetas.rojasAlRival + eq.tarjetas.rojasRecibidas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { usePenaltisEuropa } from '@/composables/usePenaltisEuropa'
import Chart from 'chart.js/auto'

const {
  equiposOrdenados,
  metadatos,
  estadisticas,
  temporadas,
  paises,
  listaEquipos,
  filtroTemporada,
  filtroPais,
  filtroEquipo,
  ordenar,
  ordenarTabla,
  dirOrden,
  datosGraficaDistribucion,
  datosGraficaSaldo,
  datosGraficaTendencias,
  datosGraficaPaises,
  distribucionPaises,
  ordenarPor
} = usePenaltisEuropa()

let chartDistribucion: Chart
let chartSaldo: Chart
let chartTendencias: Chart
let chartPaises: Chart

const actualizarGraficas = () => {
  // Gráfica de distribución
  const ctxDist = document.getElementById('chartDistribucion') as HTMLCanvasElement
  if (chartDistribucion) chartDistribucion.destroy()
  chartDistribucion = new Chart(ctxDist, {
    type: 'bar',
    data: datosGraficaDistribucion.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      scales: {
        x: { beginAtZero: true },
        y: { stacked: false }
      },
      plugins: {
        legend: { position: 'top' }
      }
    }
  })

  // Gráfica de tendencias
  const ctxTendencias = document.getElementById('chartTendencias') as HTMLCanvasElement
  if (chartTendencias) chartTendencias.destroy()
  chartTendencias = new Chart(ctxTendencias, {
    type: 'line',
    data: datosGraficaTendencias.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })

  // Gráfica de saldo
  const ctxSaldo = document.getElementById('chartSaldo') as HTMLCanvasElement
  if (chartSaldo) chartSaldo.destroy()
  chartSaldo = new Chart(ctxSaldo, {
    type: 'bar',
    data: datosGraficaSaldo.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      scales: { x: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  })

  // Gráfica de países
  const ctxPaises = document.getElementById('chartPaises') as HTMLCanvasElement
  if (chartPaises) chartPaises.destroy()
  chartPaises = new Chart(ctxPaises, {
    type: 'bar',
    data: datosGraficaPaises.value,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'y',
      scales: { x: { beginAtZero: true } },
      plugins: { legend: { display: false } }
    }
  })
}

onMounted(() => {
  actualizarGraficas()
})

// Actualizar gráficas cuando cambian los filtros
watch([filtroTemporada, filtroPais, filtroEquipo], () => {
  actualizarGraficas()
})
</script>

<style scoped>
.analizador {
  width: 100%;
  padding: 2rem;
  background: var(--color-primary);
  color: var(--color-text);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--color-secondary);
  margin: 0 0 0.5rem 0;
}

.header p {
  opacity: 0.8;
  margin: 0;
  font-size: 0.95rem;
}

/* Filtros */
.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(79, 70, 229, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.grupo-filtro {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.grupo-filtro label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.grupo-filtro select {
  padding: 0.65rem;
  border: 1px solid var(--color-secondary);
  border-radius: 4px;
  background: var(--color-primary);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.grupo-filtro select:hover {
  border-color: #06b6d4;
  box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.1);
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  background: rgba(79, 70, 229, 0.1);
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-secondary);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.5rem;
}

.stat-card.exito .stat-value {
  color: #22c55e;
}

.stat-card.error .stat-value {
  color: #ef4444;
}

.stat-card.info .stat-value {
  color: #06b6d4;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Gráficas */
.graficas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.grafica-contenedor {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.grafica-contenedor:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.grafica-contenedor h3 {
  margin: 0 0 1.5rem 0;
  color: var(--color-secondary);
  font-size: 1.1rem;
}

/* Tablas */
.tablas-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.tabla-seccion {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.tabla-seccion:hover {
  border-color: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.tabla-seccion h3 {
  margin: 0 0 1rem 0;
  color: var(--color-secondary);
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabla thead {
  background: var(--color-secondary);
  color: white;
  position: sticky;
  top: 0;
}

.tabla th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  user-select: none;
}

.tabla th.sorteable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tabla th.sorteable:hover {
  background: rgba(79, 70, 229, 0.9);
  text-decoration: underline;
}

.sort-icon {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.tabla td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
}

.tabla tbody tr:hover {
  background: rgba(79, 70, 229, 0.1);
}

.tabla .centrado {
  text-align: center;
}

.tabla .exito {
  color: #22c55e;
  font-weight: 600;
}

.tabla .error {
  color: #ef4444;
  font-weight: 600;
}

.tabla .pais {
  font-weight: 600;
  color: var(--color-secondary);
}

.tabla .equipo {
  font-weight: 600;
}

.tabla-scroll {
  max-height: 400px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .graficas {
    grid-template-columns: 1fr;
  }
  .tablas-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analizador {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .tabla th,
  .tabla td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filtros {
    grid-template-columns: repeat(2, 1fr);
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .analizador {
    padding: 0.5rem;
  }

  .header h1 {
    font-size: 1.3rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .filtros {
    grid-template-columns: 1fr;
  }

  .tabla th,
  .tabla td {
    padding: 0.25rem;
    font-size: 0.7rem;
  }
}
</style>
