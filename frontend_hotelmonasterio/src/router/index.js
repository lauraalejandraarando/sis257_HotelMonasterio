
import { createRouter, createWebHistory } from 'vue-router'

import { useHotelStore } from '../stores/hotelStore'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import HabitacionesView from '../views/HabitacionesView.vue'
import TiposHabitacionView from '../views/TiposHabitacionView.vue'
import ReservasView from '../views/ReservasView.vue'
import HuespedesView from '../views/HuespedesView.vue'
import CheckInOutView from '../views/CheckInOutView.vue'
import PagosView from '../views/PagosView.vue'
import CajaView from '../views/CajaView.vue'
import ReportesView from '../views/ReportesView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { publica: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/habitaciones',
    name: 'habitaciones',
    component: HabitacionesView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/tipos-habitacion',
    name: 'tipos-habitacion',
    component: TiposHabitacionView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/reservas',
    name: 'reservas',
    component: ReservasView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/huespedes',
    name: 'huespedes',
    component: HuespedesView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/check-in-out',
    name: 'check-in-out',
    component: CheckInOutView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/pagos',
    name: 'pagos',
    component: PagosView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/caja',
    name: 'caja',
    component: CajaView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/reportes',
    name: 'reportes',
    component: ReportesView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosView,
    meta: { requiereAutenticacion: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const hotelStore = useHotelStore()

  if (to.meta.requiereAutenticacion && !hotelStore.autenticado) {
    return { name: 'login' }
  }

  if (to.name === 'login' && hotelStore.autenticado) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
