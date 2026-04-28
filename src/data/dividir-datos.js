import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Leer el JSON completo
const jsonPath = path.join(__dirname, 'penaltis-europa-datos.json')
const datos = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

// Crear archivos separados
const output = {
  metadatos: datos.metadatos,
  resumen: datos.resumen
}

// Guardar metadatos y resumen (pequeño)
fs.writeFileSync(
  path.join(__dirname, 'penaltis-europa-resumen.json'),
  JSON.stringify(output, null, 2)
)

console.log('✅ Guardado resumen en: penaltis-europa-resumen.json')
console.log(`   Tamaño: ${(fs.statSync(path.join(__dirname, 'penaltis-europa-resumen.json')).size / 1024).toFixed(2)} KB`)

// Dividir equipos en chunks de 1000
const equipos = datos.equipos
const chunkSize = 1000
const numChunks = Math.ceil(equipos.length / chunkSize)

for (let i = 0; i < numChunks; i++) {
  const inicio = i * chunkSize
  const fin = Math.min((i + 1) * chunkSize, equipos.length)
  const chunk = {
    chunk: i,
    total: numChunks,
    registros: equipos.slice(inicio, fin)
  }
  
  fs.writeFileSync(
    path.join(__dirname, `penaltis-europa-equipos-${i}.json`),
    JSON.stringify(chunk)
  )
  
  console.log(`✅ Chunk ${i}: ${fin - inicio} registros`)
}

console.log(`\n📊 Total: ${numChunks} chunks + 1 resumen`)
