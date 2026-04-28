import { ref, computed } from 'vue'
import datosEuropa from '@/data/penaltis-europa-final.json'

export function usePenaltisEuropa() {
  const equipos = ref(datosEuropa.equipos)
  const metadatos = ref(datosEuropa.metadatos)
  const resumen = ref(datosEuropa.resumen)

  // Filtros
  const filtroTemporada = ref('Todos')
  const filtroPais = ref('Todos')
  const filtroEquipo = ref('Todos')
  const ordenar = ref('penaltis')
  
  // Ordenamiento de tablas
  const ordenarTabla = ref<string | null>(null)
  const dirOrden = ref<'asc' | 'desc'>('desc')

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

  // Obtener equipos únicos
  const listaEquipos = computed(() => {
    let resultado = equipos.value
    if (filtroTemporada.value !== 'Todos') {
      resultado = resultado.filter(e => e.temporada === parseInt(filtroTemporada.value))
    }
    if (filtroPais.value !== 'Todos') {
      resultado = resultado.filter(e => e.nombrePais === filtroPais.value)
    }
    const equiposUnicos = [...new Set(resultado.map(e => e.equipo))].sort()
    return ['Todos', ...equiposUnicos]
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

    if (filtroEquipo.value !== 'Todos') {
      resultado = resultado.filter(e => e.equipo === filtroEquipo.value)
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

  // Gráfica de tendencias por temporada
  const datosGraficaTendencias = computed(() => {
    const agrupado = {}
    equiposFiltrados.value.forEach(e => {
      if (!agrupado[e.temporada]) {
        agrupado[e.temporada] = { aFavor: 0, enContra: 0 }
      }
      agrupado[e.temporada].aFavor += e.penaltis.aFavor
      agrupado[e.temporada].enContra += e.penaltis.enContra
    })

    const anos = Object.keys(agrupado).map(Number).sort((a, b) => a - b)
    
    return {
      labels: anos.map(a => `${a}`),
      datasets: [
        {
          label: 'Total Penaltis Favor',
          data: anos.map(a => agrupado[a].aFavor),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'Total Penaltis Contra',
          data: anos.map(a => agrupado[a].enContra),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          borderWidth: 2
        }
      ]
    }
  })

  // Gráfica de distribución de penaltis por país
  const datosGraficaPaises = computed(() => {
    const top10Paises = distribucionPaises.value.slice(0, 10)
    return {
      labels: top10Paises.map(p => p.pais),
      datasets: [
        {
          label: 'Penaltis Favor',
          data: top10Paises.map(p => p.penaltis),
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        }
      ]
    }
  })

  // Función para ordenar una columna
  const ordenarPor = (columna: string) => {
    if (ordenarTabla.value === columna) {
      dirOrden.value = dirOrden.value === 'asc' ? 'desc' : 'asc'
    } else {
      ordenarTabla.value = columna
      dirOrden.value = 'desc'
    }
  }

  // Función para obtener equipos ordenados por columna
  const equiposOrdenados = computed(() => {
    let resultado = [...equiposFiltrados.value]

    if (ordenarTabla.value) {
      resultado.sort((a, b) => {
        let valorA: any = null
        let valorB: any = null

        switch (ordenarTabla.value) {
          case 'equipo':
            valorA = a.equipo
            valorB = b.equipo
            break
          case 'pais':
            valorA = a.nombrePais
            valorB = b.nombrePais
            break
          case 'temporada':
            valorA = a.temporada
            valorB = b.temporada
            break
          case 'aFavor':
            valorA = a.penaltis.aFavor
            valorB = b.penaltis.aFavor
            break
          case 'enContra':
            valorA = a.penaltis.enContra
            valorB = b.penaltis.enContra
            break
          case 'saldo':
            valorA = a.penaltis.saldo
            valorB = b.penaltis.saldo
            break
          case 'amarillas':
            valorA = a.tarjetas.amarillasAlRival + a.tarjetas.amarillasRecibidas
            valorB = b.tarjetas.amarillasAlRival + b.tarjetas.amarillasRecibidas
            break
          case 'rojas':
            valorA = a.tarjetas.rojasAlRival + a.tarjetas.rojasRecibidas
            valorB = b.tarjetas.rojasAlRival + b.tarjetas.rojasRecibidas
            break
        }

        if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase()
          valorB = valorB.toLowerCase()
          return dirOrden.value === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA)
        }

        return dirOrden.value === 'asc' ? valorA - valorB : valorB - valorA
      })
    }

    return resultado
  })

  return {
    equipos,
    equiposFiltrados,
    equiposOrdenados,
    metadatos,
    resumen,
    temporadas,
    paises,
    listaEquipos,
    filtroTemporada,
    filtroPais,
    filtroEquipo,
    ordenar,
    ordenarTabla,
    dirOrden,
    estadisticas,
    top10Penaltis,
    datosGraficaDistribucion,
    datosGraficaSaldo,
    datosGraficaTendencias,
    datosGraficaPaises,
    distribucionPaises,
    ordenarPor
  }
}
