<template>
  <div class="analizador">
    <div class="header">
      <h1>⚽ Análisis de Penaltis - Ligas Europeas</h1>
      <p>Datos de {{ metadatos.totalRegistros.toLocaleString() }} equipos (1929-2023)</p>
    </div>

    <div v-if="estaCargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <div v-else class="content">
      <div class="filters">
        <select v-model="filtroTemporada">
          <option v-for="t in temporadas" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="filtroPais">
          <option v-for="p in paises" :key="p" :value="p">{{ p }}</option>
        </select>
        <select v-model="ordenar">
          <option value="penaltis">Penaltis</option>
          <option value="saldo">Saldo</option>
        </select>
      </div>

      <div class="stats">
        <div class="stat">{{ estadisticasFiltrados.total }} equipos</div>
        <div class="stat">{{ estadisticasFiltrados.totalPenaltisAFavor }} penaltis favor</div>
      </div>

      <div class="tables">
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>País</th>
              <th>Año</th>
              <th>Penaltis</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in equiposFiltrados" :key="eq.id">
              <td>{{ eq.equipo }}</td>
              <td>{{ eq.nombrePais }}</td>
              <td>{{ eq.temporada }}</td>
              <td class="ok">{{ eq.penaltis.aFavor }}</td>
              <td :class="eq.penaltis.saldo > 0 ? 'ok' : 'bad'">{{ eq.penaltis.saldo }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePenaltisEuropa } from '@/composables/usePenaltisEuropa'

const {
  equiposFiltrados,
  metadatos,
  estadisticasFiltrados,
  temporadas,
  paises,
  filtroTemporada,
  filtroPais,
  ordenar,
  estaCargando
} = usePenaltisEuropa()
</script>

<style scoped>
.analizador {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--color-text);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--color-secondary);
  margin: 0;
}

.header p {
  opacity: 0.8;
  margin: 0.5rem 0 0 0;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(79, 70, 229, 0.2);
  border-top: 4px solid var(--color-secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.content {
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 8px;
  padding: 2rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters select {
  padding: 0.75rem;
  border: 1px solid var(--color-secondary);
  border-radius: 4px;
  background: var(--color-primary);
  color: var(--color-text);
  cursor: pointer;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat {
  padding: 1rem;
  background: var(--color-secondary);
  color: white;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
}

.tables {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

thead {
  background: var(--color-secondary);
  color: white;
  position: sticky;
  top: 0;
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
}

tbody tr:hover {
  background: rgba(79, 70, 229, 0.1);
}

.ok {
  color: #22c55e;
  font-weight: 600;
}

.bad {
  color: #ef4444;
  font-weight: 600;
}
</style>
