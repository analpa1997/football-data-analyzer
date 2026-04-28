import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '@/vistas/Inicio.vue'

const rutas = [
  {
    ruta: '/',
    nombre: 'Inicio',
    componente: Inicio
  },
  {
    ruta: '/penaltis-europa',
    nombre: 'Análisis Europa',
    componente: () => import('@/vistas/AnalizadorEuropa.vue')
  },
  {
    ruta: '/penaltis',
    nombre: 'Análisis de Penaltis',
    componente: () => import('@/vistas/AnalizadorPenaltis.vue')
  },
  {
    ruta: '/acerca-de',
    nombre: 'Acerca de',
    componente: () => import('@/vistas/AcercaDe.vue')
  },
  {
    ruta: '/contacto',
    nombre: 'Contacto',
    componente: () => import('@/vistas/Contacto.vue')
  }
]

const enrutador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: rutas.map(r => ({
    path: r.ruta,
    name: r.nombre,
    component: r.componente
  }))
})

export default enrutador
