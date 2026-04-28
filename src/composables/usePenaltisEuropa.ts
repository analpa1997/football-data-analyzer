import { ref, computed } from 'vue'
import datosEuropa from '@/data/penaltis-europa-final.json'

export function usePenaltisEuropa() {
  const equipos = ref(datosEuropa.equipos)
  const metadatos = ref(datosEuropa.metadatos)
  const resumen = ref(datosEuropa.resumen)

  // Filtros
  const filtroTemporada = ref('Todos')
  const filtroPais = ref('Todos')
  const ordenar = ref('penaltis')

  // Obtener temporadas
  const temporadas = computed(() => {
    const anos = metadatos.value.temporadas.filter(t => !isNaN(t)).sort((a, b) => b - a)
    return ['Todos', ...anos]
  })

  // Obtener países
  const paises = computed(() => {
    const paisUnicos = [...new Set(equipos.value.map(e => e.nombrePais))].sort()
    return ['Todos', ...paisUnicos]
  })

  // Equipos filtrados
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
      resultado = resultado.sort((a, b) => 
        (b.tarjetas.amarillasAlRival + b.tarjetas.amarillasRecibidas) - 
        (a.tarjetas.amarillasAlRival + a.tarjetas.amarillasRecibidas)
      )
    }

    return resultado.slice(0, 100)
  })

  // Estadísticas
  const estadisticas = computed(() => {
    const filtrados = equiposFiltrados.value
    return {
      totalEquipos: filtrados.length,
      totalPenaltisAFavor: filtrados.reduce((sum, e) => sum + e.penaltis.aFavor, 0),
      totalPenaltisEnContra: filtrados.reduce((sum, e) => sum + e.penaltis.enContra, 0),
      promedioPenaltis: filtrados.length > 0
        ? Math.round((filtrados.reduce((sum, e) => sum + e.penaltis.aFavor, 0) / filtrados.length) * 10) / 10
        : 0,
      totalAmarillas: filtrados.reduce((sum, e) => 
        sum + e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas, 0),
      totalRojas: filtrados.reduce((sum, e) => 
        sum + e.tarjetas.rojasAlRival + e.tarjetas.rojasRecibidas, 0)
    }
  })

  // Top 10 equipos por penaltis
  const top10Penaltis = computed(() => {
    return equiposFiltrados.value.slice(0, 10)
  })

  // Datos para gráfica de distribución de penaltis
  const datosGraficaDistribucion = computed(() => {
    const labels = top10Penaltis.value.map(e => e.equipo.substring(0, 15))
    const aFavor = top10Penaltis.value.map(e => e.penaltis.aFavor)
    const enContra = top10Penaltis.value.map(e => e.penaltis.enContra)

    return {
      labels,
      datasets: [
        {
          label: 'Penaltis a Favor',
          data: aFavor,
          backgroundColor: '#22c55e',
          borderColor: '#16a34a',
          borderWidth: 1
        },
        {
          label: 'Penaltis en Contra',
          data: enContra,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1
        }
      ]
    }
  })

  // Datos para gráfica de saldo de penaltis
  const datosGraficaSaldo = computed(() => {
    const top5 = equiposFiltrados.value.slice(0, 5)
    return {
      labels: top5.map(e => e.equipo.substring(0, 12)),
      datasets: [
        {
          label: 'Saldo Penaltis',
          data: top5.map(e => e.penaltis.saldo),
          backgroundColor: top5.map(e => e.penaltis.saldo > 0 ? '#3b82f6' : '#f59e0b'),
          borderColor: '#1e293b',
          borderWidth: 1
        }
      ]
    }
  })

  // Distribución por país
  const distribucionPaises = computed(() => {
    const pais = {}
    equiposFiltrados.value.forEach(e => {
      if (!pais[e.nombrePais]) {
        pais[e.nombrePais] = { cantidad: 0, penaltis: 0, amarillas: 0 }
      }
      pais[e.nombrePais].cantidad++
      pais[e.nombrePais].penaltis += e.penaltis.aFavor
      pais[e.nombrePais].amarillas += e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas
    })

    return Object.entries(pais)
      .map(([nombre, datos]) => ({
        pais: nombre,
        cantidad: datos.cantidad,
        penaltis: datos.penaltis,
        promedioPenaltis: Math.round((datos.penaltis / datos.cantidad) * 10) / 10,
        amarillas: datos.amarillas
      }))
      .sort((a, b) => b.penaltis - a.penaltis)
  })

  return {
    equipos,
    equiposFiltrados,
    metadatos,
    resumen,
    temporadas,
    paises,
    filtroTemporada,
    filtroPais,
    ordenar,
    estadisticas,
    top10Penaltis,
    datosGraficaDistribucion,
    datosGraficaSaldo,
    distribucionPaises
  }
}
