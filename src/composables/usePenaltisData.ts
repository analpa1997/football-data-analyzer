import { ref, computed } from 'vue'
import dataPenaltis from '@/data/penaltis-europeos.json'

interface Penalti {
  id: number
  competicion: string
  temporada: string
  equipo: string
  rival: string
  jugador: string
  resultado: 'gol' | 'parado' | 'fuera'
  minuto: number
  fecha: string
  tipo: string
  razon: string
}

export function usePenaltisData() {
  const penaltis = ref<Penalti[]>(dataPenaltis.penaltis)
  const estadisticas = ref(dataPenaltis.estadisticas)
  const filtroCompeticion = ref<string>('Todos')
  const filtroEquipo = ref<string>('Todos')
  const ordenar = ref<string>('fecha')

  // Obtener competiciones únicas
  const competiciones = computed(() => {
    const comp = ['Todos', ...new Set(penaltis.value.map(p => p.competicion))]
    return comp
  })

  // Obtener equipos únicos
  const equipos = computed(() => {
    const eq = ['Todos', ...new Set(penaltis.value.flatMap(p => [p.equipo, p.rival]))]
    return eq.sort()
  })

  // Filtrar penaltis por competición y equipo
  const penaltisFiltrados = computed(() => {
    let resultado = penaltis.value

    if (filtroCompeticion.value !== 'Todos') {
      resultado = resultado.filter(p => p.competicion === filtroCompeticion.value)
    }

    if (filtroEquipo.value !== 'Todos') {
      resultado = resultado.filter(
        p => p.equipo === filtroEquipo.value || p.rival === filtroEquipo.value
      )
    }

    // Ordenar
    if (ordenar.value === 'fecha') {
      resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    } else if (ordenar.value === 'minuto') {
      resultado.sort((a, b) => a.minuto - b.minuto)
    } else if (ordenar.value === 'jugador') {
      resultado.sort((a, b) => a.jugador.localeCompare(b.jugador))
    }

    return resultado
  })

  // Estadísticas por resultado
  const estadisticasResultado = computed(() => {
    const filtrados = penaltisFiltrados.value
    return {
      goles: filtrados.filter(p => p.resultado === 'gol').length,
      parados: filtrados.filter(p => p.resultado === 'parado').length,
      fallidos: filtrados.filter(p => p.resultado === 'fuera').length,
      total: filtrados.length
    }
  })

  // Datos para gráfica de pie (resultados)
  const datosGraficaPie = computed(() => ({
    labels: ['Goles Convertidos', 'Penaltis Parados', 'Fallos'],
    datasets: [
      {
        data: [
          estadisticasResultado.value.goles,
          estadisticasResultado.value.parados,
          estadisticasResultado.value.fallidos
        ],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
        borderColor: ['#16a34a', '#dc2626', '#d97706'],
        borderWidth: 2
      }
    ]
  }))

  // Datos para gráfica de barras (por competición)
  const datosGraficaBarras = computed(() => {
    const competicionesData = {}
    penaltisFiltrados.value.forEach(p => {
      if (!competicionesData[p.competicion]) {
        competicionesData[p.competicion] = { goles: 0, parados: 0, fallidos: 0 }
      }
      if (p.resultado === 'gol') {
        competicionesData[p.competicion].goles++
      } else if (p.resultado === 'parado') {
        competicionesData[p.competicion].parados++
      } else {
        competicionesData[p.competicion].fallidos++
      }
    })

    const labels = Object.keys(competicionesData)
    const goles = labels.map(comp => competicionesData[comp].goles)
    const parados = labels.map(comp => competicionesData[comp].parados)
    const fallidos = labels.map(comp => competicionesData[comp].fallidos)

    return {
      labels,
      datasets: [
        {
          label: 'Goles Convertidos',
          data: goles,
          backgroundColor: '#22c55e',
          borderColor: '#16a34a',
          borderWidth: 1
        },
        {
          label: 'Penaltis Parados',
          data: parados,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1
        },
        {
          label: 'Fallos',
          data: fallidos,
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          borderWidth: 1
        }
      ]
    }
  })

  // Datos para gráfica de línea (por mes)
  const datosGraficaLinea = computed(() => {
    const mesesData = {}
    penaltisFiltrados.value.forEach(p => {
      const fecha = new Date(p.fecha)
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
      if (!mesesData[mes]) {
        mesesData[mes] = 0
      }
      mesesData[mes]++
    })

    const meses = Object.keys(mesesData).sort()

    return {
      labels: meses,
      datasets: [
        {
          label: 'Penaltis por Mes',
          data: meses.map(mes => mesesData[mes]),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    }
  })

  // Equipos con más penaltis
  const equiposTopPenaltis = computed(() => {
    const equipo = {}
    penaltisFiltrados.value.forEach(p => {
      if (!equipo[p.equipo]) {
        equipo[p.equipo] = { total: 0, goles: 0 }
      }
      equipo[p.equipo].total++
      if (p.resultado === 'gol') {
        equipo[p.equipo].goles++
      }
    })

    return Object.entries(equipo)
      .map(([nombreEquipo, datos]) => ({
        equipo: nombreEquipo,
        penaltis: datos.total,
        conversion: Math.round((datos.goles / datos.total) * 100)
      }))
      .sort((a, b) => b.penaltis - a.penaltis)
      .slice(0, 5)
  })

  // Jugadores top
  const jugadoresTop = computed(() => {
    const jugador = {}
    penaltisFiltrados.value.forEach(p => {
      if (!jugador[p.jugador]) {
        jugador[p.jugador] = { total: 0, goles: 0 }
      }
      jugador[p.jugador].total++
      if (p.resultado === 'gol') {
        jugador[p.jugador].goles++
      }
    })

    return Object.entries(jugador)
      .map(([nombreJugador, datos]) => ({
        jugador: nombreJugador,
        penaltis: datos.total,
        goles: datos.goles,
        tasaConversion: Math.round((datos.goles / datos.total) * 100)
      }))
      .sort((a, b) => b.goles - a.goles)
      .slice(0, 10)
  })

  return {
    penaltis,
    penaltisFiltrados,
    estadisticas,
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
  }
}
