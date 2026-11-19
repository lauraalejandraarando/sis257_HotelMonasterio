
<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHotelStore } from './stores/hotelStore'

import {
  House,
  BedDouble,
  Tags,
  CalendarCheck,
  UsersRound,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  ChartNoAxesCombined,
  ShieldCheck,
  Menu,
  X,
  Hotel,
  UserRound,
  LogOut,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const hotelStore = useHotelStore()

const menuAbierto = ref(true)
const perfilAbierto = ref(false)

const menu = [
  {
    titulo: 'GENERAL',
    opciones: [
      { nombre: 'Dashboard', ruta: '/', icono: House }
    ]
  },
  {
    titulo: 'GESTIÓN HOTELERA',
    opciones: [
      { nombre: 'Habitaciones', ruta: '/habitaciones', icono: BedDouble },
      { nombre: 'Tipos de habitación', ruta: '/tipos-habitacion', icono: Tags },
      { nombre: 'Reservas', ruta: '/reservas', icono: CalendarCheck },
      { nombre: 'Huéspedes', ruta: '/huespedes', icono: UsersRound },
      { nombre: 'Check-in / Check-out', ruta: '/check-in-out', icono: ArrowLeftRight }
    ]
  },
  {
    titulo: 'ADMINISTRACIÓN',
    opciones: [
      { nombre: 'Pagos', ruta: '/pagos', icono: CreditCard },
      { nombre: 'Caja y movimientos', ruta: '/caja', icono: Wallet }
    ]
  },
  {
    titulo: 'CONTROL Y REPORTES',
    opciones: [
      { nombre: 'Reportes', ruta: '/reportes', icono: ChartNoAxesCombined },
      { nombre: 'Usuarios y roles', ruta: '/usuarios', icono: ShieldCheck }
    ]
  }
]

const nombrePagina = computed(() => {
  for (const grupo of menu) {
    const opcion = grupo.opciones.find(item => item.ruta === route.path)
    if (opcion) return opcion.nombre
  }

  return 'Panel de control'
})

const nombreUsuario = computed(() => {
  if (!hotelStore.usuario) return 'Usuario'

  return [
    hotelStore.usuario.nombres,
    hotelStore.usuario.apellidos
  ].filter(Boolean).join(' ') || hotelStore.usuario.nombreUsuario
})

const inicialUsuario = computed(() => {
  return nombreUsuario.value.charAt(0).toUpperCase()
})

const rolUsuario = computed(() => {
  const roles = {
    admin: 'Administrador',
    recepcion: 'Recepción',
    gerencia: 'Gerencia'
  }

  return roles[hotelStore.usuario?.rol] || 'Personal del hotel'
})

function cerrarPerfil() {
  perfilAbierto.value = false
}

function cerrarSesion() {
  cerrarPerfil()
  hotelStore.cerrarSesion()
  router.push('/login')
}
</script>

<template>
  <RouterView v-if="route.name === 'login'" />

  <div v-else class="layout">
    <aside class="sidebar" :class="{ cerrado: !menuAbierto }">

      <div class="brand">
        <div class="brand-symbol">
          <Hotel :size="25" />
        </div>

        <div v-if="menuAbierto" class="brand-text">
          <strong>HOTEL MONASTERIO</strong>
          <span>SUCRE · BOLIVIA</span>
        </div>
      </div>

      <div v-if="menuAbierto" class="sidebar-label">
        MENÚ PRINCIPAL
      </div>

      <nav class="navigation">
        <div
          v-for="grupo in menu"
          :key="grupo.titulo"
          class="menu-group"
        >
          <p v-if="menuAbierto" class="group-title">
            {{ grupo.titulo }}
          </p>

          <RouterLink
            v-for="opcion in grupo.opciones"
            :key="opcion.ruta"
            :to="opcion.ruta"
            class="menu-link"
            :class="{ activo: route.path === opcion.ruta }"
            :title="opcion.nombre"
          >
            <span class="menu-icon">
              <component :is="opcion.icono" :size="20" :stroke-width="2" />
            </span>

            <span v-if="menuAbierto" class="menu-name">
              {{ opcion.nombre }}
            </span>
          </RouterLink>
        </div>
      </nav>

      <div v-if="menuAbierto" class="sidebar-footer">
        <div class="footer-symbol">
          <Hotel :size="21" />
        </div>

        <div>
          <strong>Hotel Monasterio</strong>
          <span>Sistema de gestión</span>
        </div>
      </div>
    </aside>

    <div class="main-area">

      <header class="topbar">
        <div class="topbar-left">
          <button
            class="toggle-button"
            @click="menuAbierto = !menuAbierto"
            aria-label="Mostrar u ocultar menú"
          >
            <Menu v-if="menuAbierto" :size="20" />
            <X v-else :size="20" />
          </button>

          <div>
            <span class="breadcrumb">Hotel Monasterio /</span>
            <strong>{{ nombrePagina }}</strong>
          </div>
        </div>

        <div class="user-area">
          <button
            class="profile-button"
            @click="perfilAbierto = !perfilAbierto"
          >
            <div class="user-avatar">{{ inicialUsuario }}</div>

            <div class="user-info">
              <strong>{{ nombreUsuario }}</strong>
              <span>{{ rolUsuario }}</span>
            </div>

            <ChevronDown :size="16" class="profile-chevron" />
          </button>

          <div v-if="perfilAbierto" class="profile-dropdown">
            <div class="profile-heading">
              <UserRound :size="18" />
              <span>Mi cuenta</span>
            </div>

            <div class="profile-option">
              <UserRound :size="17" />
              {{ nombreUsuario }}
            </div>

            <button class="profile-option logout" @click="cerrarSesion">
              <LogOut :size="17" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main class="page-content">
        <RouterView />
      </main>

      <footer class="main-footer">
        <span>© 2026 Hotel Monasterio · Sucre, Bolivia</span>
        <span>Sistema Integral de Gestión Hotelera</span>
      </footer>

    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap');

:root {
  --ivory: #F5F0E6;
  --blue: #071827;
  --blue-light: #DCE7ED;
  --green: #00FF66;
  --green-dark: #061A16;
  --emerald: #00E65C;
  --gold: #B08D57;
  --text: #263B32;
  --muted: #718078;
  --border: rgba(7, 24, 39, 0.22);
}

* {
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  font-family: 'DM Sans', sans-serif;
  background:
    radial-gradient(circle at 85% 10%, rgba(0,255,102,0.09), transparent 30%),
    linear-gradient(135deg, #F5F0E6, #e8eee9);
  color: var(--text);
}

button {
  font-family: inherit;
}

.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* MENÚ LATERAL */

.sidebar {
  width: 260px;
  height: 100%;
  background: linear-gradient(165deg, #071827, #061A16);
  color: #F5F0E6;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.25s ease;
  box-shadow: 8px 0 30px rgba(7,24,39,0.22);
  z-index: 2;
}

.sidebar.cerrado {
  width: 76px;
}

.brand {
  min-height: 90px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(245,240,230,0.13);
  flex-shrink: 0;
}

.brand-symbol {
  min-width: 43px;
  height: 43px;
  border: 1px solid rgba(0,255,102,0.55);
  background: rgba(0,255,102,0.10);
  color: var(--green);
  border-radius: 13px;
  display: grid;
  place-items: center;
  box-shadow: 0 0 14px rgba(0,255,102,0.12);
}

.brand-text strong,
.brand-text span {
  display: block;
  white-space: nowrap;
}

.brand-text strong {
  font-size: 12px;
  letter-spacing: 1px;
}

.brand-text span {
  font-size: 9px;
  color: #D9C398;
  margin-top: 5px;
  letter-spacing: 1.5px;
}

.sidebar-label {
  color: rgba(245,240,230,0.55);
  font-size: 9px;
  letter-spacing: 2px;
  padding: 24px 22px 8px;
  flex-shrink: 0;
}

.navigation {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px 15px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,255,102,0.45) transparent;
}

.navigation::-webkit-scrollbar {
  width: 5px;
}

.navigation::-webkit-scrollbar-thumb {
  background: rgba(0,255,102,0.45);
  border-radius: 10px;
}

.menu-group {
  margin-top: 15px;
}

.group-title {
  color: #D6B77C;
  font-size: 9px;
  letter-spacing: 1.5px;
  font-weight: 700;
  padding: 0 10px;
  margin: 12px 0 8px;
}

.menu-link {
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 7px 10px;
  border-radius: 10px;
  color: rgba(245,240,230,0.88);
  text-decoration: none;
  font-size: 12px;
  margin-bottom: 5px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.menu-link:hover {
  background: rgba(0,255,102,0.09);
  border-color: rgba(0,255,102,0.22);
  color: white;
  transform: translateX(2px);
}

.menu-icon {
  width: 34px;
  min-width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #071827;
  color: var(--green);
  border: 1px solid rgba(0,255,102,0.22);
  transition: 0.2s ease;
}

.menu-link.activo {
  background: rgba(0,255,102,0.10);
  color: #fff;
  font-weight: 700;
  border-color: rgba(0,255,102,0.40);
  box-shadow: 0 0 16px rgba(0,255,102,0.09);
}

.menu-link.activo .menu-icon {
  background: #00FF66;
  color: #071827;
  border-color: #00FF66;
  box-shadow: 0 0 14px rgba(0,255,102,0.55);
}

.menu-name {
  line-height: 1.3;
}

.sidebar-footer {
  padding: 18px;
  border-top: 1px solid rgba(245,240,230,0.13);
  display: flex;
  align-items: center;
  gap: 11px;
  flex-shrink: 0;
}

.footer-symbol {
  color: var(--green);
}

.sidebar-footer strong,
.sidebar-footer span {
  display: block;
  white-space: nowrap;
}

.sidebar-footer strong {
  font-size: 11px;
}

.sidebar-footer span {
  font-size: 9px;
  color: rgba(245,240,230,0.60);
  margin-top: 4px;
}

/* ÁREA PRINCIPAL */

.main-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: 76px;
  min-height: 76px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.76);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-left,
.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toggle-button {
  background: var(--blue-light);
  border: 1px solid rgba(7,24,39,0.18);
  width: 39px;
  height: 39px;
  border-radius: 10px;
  color: var(--blue);
  cursor: pointer;
  display: grid;
  place-items: center;
}

.toggle-button:hover {
  background: #c8dce5;
  color: #00A84B;
}

.breadcrumb {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin-bottom: 4px;
}

.topbar-left strong {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  color: var(--green-dark);
}

/* PERFIL */

.user-area {
  position: relative;
}

.profile-button {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
  text-align: left;
}

.profile-button:hover {
  background: rgba(7,24,39,0.06);
}

.user-avatar {
  background: linear-gradient(135deg, #071827, #00B85A);
  color: white;
  width: 39px;
  height: 39px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  border: 2px solid rgba(176,141,87,0.65);
  flex-shrink: 0;
}

.user-info strong,
.user-info span {
  display: block;
}

.user-info strong {
  font-size: 11px;
  color: var(--green-dark);
}

.user-info span {
  font-size: 10px;
  color: var(--muted);
  margin-top: 4px;
}

.profile-chevron {
  color: var(--muted);
}

.profile-dropdown {
  position: absolute;
  top: 53px;
  right: 0;
  width: 205px;
  padding: 8px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(7,24,39,0.16);
  z-index: 10;
}

.profile-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  color: var(--muted);
  font-size: 11px;
  border-bottom: 1px solid #edf0ed;
  margin-bottom: 5px;
}

.profile-option {
  width: 100%;
  border: none;
  background: transparent;
  padding: 11px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--blue);
  font-size: 11px;
  cursor: pointer;
  text-align: left;
}

.profile-option:hover {
  background: #eef4f0;
}

.profile-option.logout {
  color: #B33A3A;
}

.profile-option.logout:hover {
  background: #fff0f0;
}

/* CONTENIDO */

.page-content {
  padding: 30px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(7,24,39,0.30) transparent;
}

.page-content::-webkit-scrollbar {
  width: 7px;
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(7,24,39,0.25);
  border-radius: 10px;
}

.main-footer {
  min-height: 48px;
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  background: rgba(255,255,255,0.60);
  backdrop-filter: blur(12px);
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  color: var(--muted);
  font-size: 10px;
}

/* MENÚ CONTRAÍDO */

.sidebar.cerrado .brand {
  justify-content: center;
  padding: 18px 10px;
}

.sidebar.cerrado .menu-link {
  justify-content: center;
}

.sidebar.cerrado .menu-icon {
  width: 38px;
  height: 38px;
}

/* RESPONSIVE */

@media (max-width: 800px) {
  .sidebar {
    width: 76px;
  }

  .sidebar .brand {
    justify-content: center;
    padding: 18px 10px;
  }

  .sidebar .brand-text,
  .sidebar .sidebar-label,
  .sidebar .group-title,
  .sidebar .menu-link span:not(.menu-icon),
  .sidebar .sidebar-footer {
    display: none;
  }

  .sidebar .menu-link {
    justify-content: center;
  }

  .topbar {
    padding: 0 15px;
  }

  .page-content {
    padding: 20px 15px;
  }

  .main-footer {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .user-info,
  .profile-chevron {
    display: none;
  }

  .topbar-left {
    gap: 9px;
  }

  .topbar-left strong {
    font-size: 14px;
  }
}
</style>
