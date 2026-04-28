#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'penaltisEuropa.csv');
const jsonPath = path.join(__dirname, 'penaltis-europa-datos.json');

// Parsear CSV
async function convertCSVtoJSON() {
  const datos = {
    metadatos: {
      titulo: 'Estadísticas de Penaltis - Ligas Europeas',
      descripcion: 'Datos de penaltis por equipo, país y temporada',
      totalRegistros: 0,
      temporadas: [],
      paises: [],
      estadisticasGenerales: {}
    },
    equipos: [],
    resumen: {
      porTemporada: {},
      porPais: {},
      topEquiposPenaltis: [],
      topEquiposAmarillaas: []
    }
  };

  const equiposMap = new Map();
  const temporadasSet = new Set();
  const paisesSet = new Set();
  let lineCount = 0;

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(csvPath),
      crlfDelay: Infinity
    });

    let headers = [];

    rl.on('line', (line) => {
      lineCount++;
      
      // Skip empty lines
      if (!line.trim()) return;

      // Parse header
      if (lineCount === 1) {
        headers = line.split(',').map(h => h.trim());
        return;
      }

      // Parse data
      const values = line.split(',').map(v => v.trim());
      const record = {};

      headers.forEach((header, index) => {
        record[header] = values[index];
      });

      // Estructura el registro
      const equipo = {
        id: `${record.TEMPORADA}-${record.EQUIPO}`,
        temporada: parseInt(record.TEMPORADA),
        equipo: record.EQUIPO,
        pais: record['Nombre País'],
        codigoPais: record['Nombre País'].split(' ')[0],
        nombrePais: record['Nombre País'].substring(3),
        penaltis: {
          aFavor: parseInt(record['Penaltis a favor']),
          enContra: parseInt(record['Penaltis en contra']),
          saldo: parseInt(record['Saldo Penaltis'])
        },
        faltas: {
          recibidas: parseInt(record['Faltas recibidas']),
          cometidas: parseInt(record['Faltas cometidas']),
          saldo: parseInt(record['Saldo Faltas'])
        },
        tarjetas: {
          amarillasAlRival: parseInt(record['Amarillas a rival']),
          amarillasRecibidas: parseInt(record['Amarillas recibidas']),
          rojasAlRival: parseInt(record['Rojas a rival']),
          rojasRecibidas: parseInt(record['Rojas recibidas']),
          saldoAmarillas: parseInt(record['Saldo Amarillas']),
          saldoRojas: parseInt(record['Saldo Rojas'])
        },
        saldoArbitral: parseInt(record['Saldo arbitral'])
      };

      datos.equipos.push(equipo);
      temporadasSet.add(equipo.temporada);
      paisesSet.add(equipo.nombrePais);

      // Actualizar resumen por temporada
      if (!datos.resumen.porTemporada[equipo.temporada]) {
        datos.resumen.porTemporada[equipo.temporada] = {
          totalEquipos: 0,
          totalPenaltisAFavor: 0,
          totalPenaltisEnContra: 0,
          totalAmarillas: 0,
          totalRojas: 0
        };
      }
      datos.resumen.porTemporada[equipo.temporada].totalEquipos++;
      datos.resumen.porTemporada[equipo.temporada].totalPenaltisAFavor += equipo.penaltis.aFavor;
      datos.resumen.porTemporada[equipo.temporada].totalPenaltisEnContra += equipo.penaltis.enContra;
      datos.resumen.porTemporada[equipo.temporada].totalAmarillas += 
        equipo.tarjetas.amarillasAlRival + equipo.tarjetas.amarillasRecibidas;
      datos.resumen.porTemporada[equipo.temporada].totalRojas += 
        equipo.tarjetas.rojasAlRival + equipo.tarjetas.rojasRecibidas;

      // Actualizar resumen por país
      if (!datos.resumen.porPais[equipo.nombrePais]) {
        datos.resumen.porPais[equipo.nombrePais] = {
          totalEquipos: 0,
          totalPenaltisAFavor: 0,
          promedioPenaltis: 0
        };
      }
      datos.resumen.porPais[equipo.nombrePais].totalEquipos++;
      datos.resumen.porPais[equipo.nombrePais].totalPenaltisAFavor += equipo.penaltis.aFavor;
    });

    rl.on('close', () => {
      // Calcular promedios
      Object.keys(datos.resumen.porPais).forEach(pais => {
        const paisDatos = datos.resumen.porPais[pais];
        paisDatos.promedioPenaltis = 
          Math.round((paisDatos.totalPenaltisAFavor / paisDatos.totalEquipos) * 100) / 100;
      });

      // Top equipos con más penaltis
      datos.resumen.topEquiposPenaltis = datos.equipos
        .sort((a, b) => b.penaltis.aFavor - a.penaltis.aFavor)
        .slice(0, 20)
        .map(e => ({
          equipo: e.equipo,
          pais: e.nombrePais,
          temporada: e.temporada,
          penaltisAFavor: e.penaltis.aFavor,
          penaltisEnContra: e.penaltis.enContra,
          saldo: e.penaltis.saldo
        }));

      // Top equipos con más tarjetas
      datos.resumen.topEquiposAmarillaas = datos.equipos
        .sort((a, b) => 
          (b.tarjetas.amarillasAlRival + b.tarjetas.amarillasRecibidas) - 
          (a.tarjetas.amarillasAlRival + a.tarjetas.amarillasRecibidas)
        )
        .slice(0, 20)
        .map(e => ({
          equipo: e.equipo,
          pais: e.nombrePais,
          temporada: e.temporada,
          amarillasAlRival: e.tarjetas.amarillasAlRival,
          amarillasRecibidas: e.tarjetas.amarillasRecibidas,
          total: e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas
        }));

      // Metadata
      datos.metadatos.totalRegistros = datos.equipos.length;
      datos.metadatos.temporadas = Array.from(temporadasSet).sort();
      datos.metadatos.paises = Array.from(paisesSet).sort();

      // Estadísticas generales
      datos.metadatos.estadisticasGenerales = {
        totalPenaltisAFavor: datos.equipos.reduce((sum, e) => sum + e.penaltis.aFavor, 0),
        totalPenaltisEnContra: datos.equipos.reduce((sum, e) => sum + e.penaltis.enContra, 0),
        totalAmarillas: datos.equipos.reduce((sum, e) => 
          sum + e.tarjetas.amarillasAlRival + e.tarjetas.amarillasRecibidas, 0),
        totalRojas: datos.equipos.reduce((sum, e) => 
          sum + e.tarjetas.rojasAlRival + e.tarjetas.rojasRecibidas, 0)
      };

      // Guardar a archivo
      fs.writeFileSync(jsonPath, JSON.stringify(datos, null, 2), 'utf-8');
      console.log(`✅ Convertido ${datos.metadatos.totalRegistros} registros a JSON`);
      console.log(`📁 Guardado en: ${jsonPath}`);
      resolve(datos);
    });

    rl.on('error', reject);
  });
}

// Ejecutar
convertCSVtoJSON()
  .then(datos => {
    console.log(`\n📊 Resumen:`);
    console.log(`  Temporadas: ${datos.metadatos.temporadas.join(', ')}`);
    console.log(`  Países: ${datos.metadatos.paises.length}`);
    console.log(`  Equipos totales: ${datos.metadatos.totalRegistros}`);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
