import { ref, computed, onMounted } from 'vue'
import resumenDatos from '@/data/penaltis-europa-resumen.json'

export function usePenaltisEuropa() {
  const equipos = ref<any[]>([])
  const resumen = ref(resumenDatos.resumen)
  const metadatos = ref(resumenDatos.metadatos)
  const estaCargando = ref(false)

  // Cargar todos los chunks de equipos
  const cargarEquipos = async () => {
    estaCargando.value = true
    try {
      const totalChunks = 31
      let todosEquipos = []
      
      for (let i = 0; i < totalChunks; i++) {
        const response = await import(`@/data/penaltis-europa-equipos-${i}.json`)
        todosEquipos = [...todosEquipos, ...response.registros]
      }
      
      equipos.value = todosEquipos
    } catch (error) {
      console.error('Error cargando equipos:', error)
    } finally {
      estaCargando.value = false
    }
  }

  // Cargar datos al montar el composable
  onMounted(() => {
    cargarEquipos()
  })

  // Filtros
  const filtroTemporada = ref(metadatos.value.temporadas[metadatos.value.temporadas.length - 1])
  const filtroPais = ref('Todos')
  const ordenar = ref('penaltis')

  // Obtener años únicos
  const temporadas = computed(() => {
    const anos = ['Todos', ...metadatos.value.temporadas.filter(t => !isNaN(t))]
    return anos.sort((a, b) => {
      if (a === 'Todos') return 1
      if (b === 'Todos') return -1
      return b - a
    })
  })

  // Obtener países únicos
  const paises = computed(() => {
    return ['Todos', ...metadatos.value.paises]
  })

  // Filtrar equipos
  const equiposFiltrados = computed(() => {
    let resultado = equipos.value

    if (filtroTemporada.value !== 'Todos') {
      resultado = resultado.filter(e => e.temporada === parseInt(filtroTemporada.value))
    }

    if (filtroPais.value !== 'Todos') {
      resultado = resultado.filter(e => e.nombrePais === filtroPais.value)
    }

    // Ordenar
    if (ordenar.value === 'penaltis') {
      resultado = resultado.sort((a, b) => b.penaltis.aFavor - a.penaltis.aFavor)
    } else if (ordenar.value === 'saldo') {
      resultado = resultado.sort((a, b) => b.penaltis.saldo - a.penaltis.saldo)
    } else if (ordenar.value === 'amarillas') {
      const getTotalAmarillas = (e) => e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas
      resultado = resultado.sort((a, b) => getTotalAmarillas(b) - getTotalAmarillas(a))
    } else if (ordenar.value === 'equipo') {
      resultado = resultado.sort((a, b) => a.equipo.localeCompare(b.equipo))
    }

    return resultado.slice(0, 500)
  })

  // Estadísticas de los filtrados
  const estadisticasFiltrados = computed(() => {
    const filtrados = equiposFiltrados.value
    return {
      total: filtrados.length,
      totalPenaltisAFavor: filtrados.reduce((sum, e) => sum + e.penaltis.aFavor, 0),
      totalPenaltisEnContra: filtrados.reduce((sum, e) => sum + e.penaltis.enContra, 0),
      totalAmarillas: filtrados.reduce((sum, e) => 
        sum + e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas, 0),
      totalRojas: filtrados.reduce((sum, e) => 
        sum + e.tarjetas.rojasAlRival + e.tarjetas.rojasRecibidas, 0),
      promedioPenaltis: filtrados.length > 0 
        ? Math.round((filtrados.reduce((sum, e) => sum + e.penaltis.aFavor, 0) / filtrados.length) * 100) / 100 
        : 0
    }
  })

  // Datos para gráfica: Top países por penaltis
  const datosGraficaPaisesBarras = computed(() => {
    const paisDatos = resumen.value.porPais
    const paises = Object.keys(paisDatos)
      .sort((a, b) => paisDatos[b].totalPenaltisAFavor - paisDatos[a].totalPenaltisAFavor)
      .slice(0, 15)

    return {
      labels: paises,
      datasets: [
        {
          label: 'Total Penaltis a Favor',
          data: paises.map(p => paisDatos[p].totalPenaltisAFavor),
          backgroundColor: '#3b82f6',
          borderColor: '#1d4ed8',
          borderWidth: 1
        },
        {
          label: 'Promedio por Equipo',
          data: paises.map(p => paisDatos[p].promedioPenaltis),
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    }
  })

  // Datos para gráfica: Temporadas
  const datosGraficaTemporadas = computed(() => {
    const temporadaDatos = resumen.value.porTemporada
    const anos = Object.keys(temporadaDatos)
      .map(Number)
      .filter(a => !isNaN(a))
      .sort()
      .slice(-30)

    return {
      labels: anos,
      datasets: [
        {
          label: 'Penaltis a Favor',
          data: anos.map(a => temporadaDatos[a].totalPenaltisAFavor),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Penaltis en Contra',
          data: anos.map(a => temporadaDatos[a].totalPenaltisEnContra),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: false
        }
      ]
    }
  })

  // Top equipos de todos los tiempos
  const topEquiposHistorico = computed(() => {
    return resumen.value.topEquiposPenaltis.slice(0, 10)
  })

  // Top equipos por tarjetas
  const topEquiposTarjetas = computed(() => {
    return resumen.value.topEquiposAmarillaas.slice(0, 10)
  })

  return {
    equipos,
    equiposFiltrados,
    resumen,
    metadatos,
    estadisticasFiltrados,
    temporadas,
    paises,
    filtroTemporada,
    filtroPais,
    ordenar,
    datosGraficaPaisesBarras,
    datosGraficaTemporadas,
    topEquiposHistorico,
    topEquiposTarjetas,
    estaCargando,
    cargarEquipos
  }
}
