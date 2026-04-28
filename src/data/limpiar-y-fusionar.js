import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('📊 Limpiando y fusionando datos...\n')

// Leer resumen
const resumenPath = path.join(__dirname, 'penaltis-europa-resumen.json')
const resumen = JSON.parse(fs.readFileSync(resumenPath, 'utf-8'))

console.log(`📁 Metadatos: ${resumen.metadatos.totalRegistros} registros originales`)

// Función para verificar si un registro está vacío
function esRegistroVacio(equipo) {
  const tienePenaltis = equipo.penaltis && (equipo.penaltis.aFavor > 0 || equipo.penaltis.enContra > 0)
  const tieneTarjetas = equipo.tarjetas && 
    (equipo.tarjetas.amarillasAlRival > 0 || 
     equipo.tarjetas.amarillasRecibidas > 0 || 
     equipo.tarjetas.rojasAlRival > 0 || 
     equipo.tarjetas.rojasRecibidas > 0)
  
  return !tienePenaltis && !tieneTarjetas
}

// Leer y filtrar todos los chunks
let equiposFiltrados = []
let registrosBorrados = 0

for (let i = 0; i <= 30; i++) {
  const chunkPath = path.join(__dirname, `penaltis-europa-equipos-${i}.json`)
  try {
    const chunk = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'))
    
    const equiposLimpios = chunk.registros.filter(eq => {
      if (esRegistroVacio(eq)) {
        registrosBorrados++
        return false
      }
      return true
    })
    
    equiposFiltrados = [...equiposFiltrados, ...equiposLimpios]
    console.log(`✅ Chunk ${i}: ${chunk.registros.length} → ${equiposLimpios.length} registros (borrados: ${chunk.registros.length - equiposLimpios.length})`)
  } catch (err) {
    console.error(`❌ Error leyendo chunk ${i}:`, err.message)
  }
}

// Crear JSON final
const datosFinales = {
  metadatos: {
    ...resumen.metadatos,
    totalRegistros: equiposFiltrados.length,
    registrosOriginal: resumen.metadatos.totalRegistros,
    registrosBorrados: registrosBorrados,
    fechaProcesamiento: new Date().toISOString()
  },
  resumen: resumen.resumen,
  equipos: equiposFiltrados
}

// Guardar JSON final
const outputPath = path.join(__dirname, 'penaltis-europa-final.json')
fs.writeFileSync(outputPath, JSON.stringify(datosFinales, null, 2))

console.log(`\n📊 Resumen Final:`)
console.log(`  Registros originales: ${resumen.metadatos.totalRegistros}`)
console.log(`  Registros borrados: ${registrosBorrados}`)
console.log(`  Registros finales: ${equiposFiltrados.length}`)
console.log(`  Reducción: ${((registrosBorrados / resumen.metadatos.totalRegistros) * 100).toFixed(2)}%`)
console.log(`\n✅ Guardado en: penaltis-europa-final.json`)
console.log(`   Tamaño: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`)
