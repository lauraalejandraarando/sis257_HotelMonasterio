
<template>
  <main class="check-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">OPERACIONES DEL HOTEL</span>
        <h1>Check-in / Check-out</h1>
        <p>Control de entradas y salidas de huéspedes.</p>
      </div>

      <button class="btn-refresh" @click="cargarReservas" :disabled="cargando">
        <RefreshCw :size="17" />
        Actualizar
      </button>
    </header>

    <div v-if="mensaje" class="alert success">{{ mensaje }}</div>
    <div v-if="error" class="alert danger">{{ error }}</div>

    <section class="stats">
      <article class="stat-card">
        <div class="stat-icon"><CalendarCheck :size="21" /></div>
        <div>
          <span>Entradas pendientes</span>
          <strong>{{ entradasPendientes.length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon"><LogIn :size="21" /></div>
        <div>
          <span>Huéspedes alojados</span>
          <strong>{{ alojados.length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon"><LogOut :size="21" /></div>
        <div>
          <span>Salidas pendientes</span>
          <strong>{{ salidasPendientes.length }}</strong>
        </div>
      </article>
    </section>

    <section class="content-card">
      <div class="toolbar">
        <div>
          <h2>Control de reservas</h2>
          <p>Realiza el registro de entrada o salida según el estado de la reserva.</p>
        </div>

        <div class="search-box">
          <Search :size="17" />
          <input
            v-model="busqueda"
            placeholder="Buscar código o huésped..."
          />
        </div>
      </div>

      <div v-if="cargando" class="empty-state">
        Cargando reservas...
      </div>

      <div v-else-if="reservasFiltradas.length === 0" class="empty-state">
        <CalendarX :size="34" />
        <strong>No hay reservas para mostrar</strong>
        <span>Las reservas confirmadas y en curso aparecerán aquí.</span>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>RESERVA</th>
              <th>HUÉSPED</th>
              <th>FECHAS</th>
              <th>HABITACIÓN</th>
              <th>ESTADO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="reserva in reservasFiltradas" :key="reserva.id">
              <td>
                <strong class="code">{{ reserva.codigoReserva }}</strong>
                <small>#{{ reserva.id }}</small>
              </td>

              <td>
                <strong>{{ nombreHuesped(reserva) }}</strong>
                <small>{{ reserva.cantidadHuespedes }} huésped(es)</small>
              </td>

              <td>
                <span>{{ formatoFecha(reserva.fechaEntrada) }}</span>
                <small>Hasta {{ formatoFecha(reserva.fechaSalida) }}</small>
              </td>

              <td>
                <span
                  v-for="detalle in reserva.detalles || []"
                  :key="detalle.id"
                  class="room-tag"
                >
                  {{ detalle.habitacion?.numero || 'Sin habitación' }}
                </span>
              </td>

              <td>
                <span class="status" :class="claseEstado(reserva.estado)">
                  {{ textoEstado(reserva.estado) }}
                </span>
              </td>

              <td>
                <button
                  v-if="reserva.estado === 'confirmada'"
                  class="action-btn checkin"
                  :disabled="procesando === reserva.id"
                  @click="registrarCheckIn(reserva)"
                >
                  <LogIn :size="16" />
                  {{ procesando === reserva.id ? 'Procesando...' : 'Check-in' }}
                </button>

                <button
                  v-else-if="reserva.estado === 'en curso'"
                  class="action-btn checkout"
                  :disabled="procesando === reserva.id"
                  @click="registrarCheckOut(reserva)"
                >
                  <LogOut :size="16" />
                  {{ procesando === reserva.id ? 'Procesando...' : 'Check-out' }}
                </button>

                <span v-else class="no-action">Sin acción</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import {
  RefreshCw,
  CalendarCheck,
  CalendarX,
  LogIn,
  LogOut,
  Search
} from 'lucide-vue-next'

import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const reservas = ref([])
const cargando = ref(false)
const procesando = ref(null)
const busqueda = ref('')
const mensaje = ref('')
const error = ref('')

const entradasPendientes = computed(() =>
  reservas.value.filter(r => r.estado === 'confirmada')
)

const alojados = computed(() =>
  reservas.value.filter(r => r.estado === 'en curso')
)

const salidasPendientes = computed(() =>
  reservas.value.filter(r => r.estado === 'en curso')
)

const reservasFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return reservas.value
    .filter(r => ['confirmada', 'en curso'].includes(r.estado))
    .filter(r => {
      const huesped = nombreHuesped(r).toLowerCase()
      const codigo = (r.codigoReserva || '').toLowerCase()

      return !texto || huesped.includes(texto) || codigo.includes(texto)
    })
})

// Todas las peticiones incluyen el token de sesión.
async function peticion(url, opciones = {}) {
  const respuesta = await fetch(`${API}${url}`, {
    ...opciones,
    headers: {
      ...(hotelStore.token
        ? { Authorization: `Bearer ${hotelStore.token}` }
        : {}),
      ...(opciones.headers || {})
    }
  })

  const texto = await respuesta.text()
  let datos = null

  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = texto
  }

  if (!respuesta.ok) {
    const detalle = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message || datos?.error

    throw new Error(
      detalle || `Error del servidor (${respuesta.status}).`
    )
  }

  return datos
}

function nombreHuesped(reserva) {
  const h = reserva.huesped

  if (!h) return 'Huésped no disponible'

  return `${h.nombres || ''} ${h.apellidos || ''}`.trim()
}

function formatoFecha(fecha) {
  if (!fecha) return '—'

  const partes = String(fecha).slice(0, 10).split('-')

  if (partes.length !== 3) return fecha

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function textoEstado(estado) {
  const nombres = {
    confirmada: 'Confirmada',
    'en curso': 'En curso',
    finalizada: 'Finalizada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada'
  }

  return nombres[estado] || estado
}

function claseEstado(estado) {
  return estado === 'en curso' ? 'en-curso' : estado
}

async function cargarReservas() {
  cargando.value = true
  error.value = ''

  try {
    const resultado = await peticion('/reservas')

    reservas.value = Array.isArray(resultado)
      ? resultado
      : []
  } catch (e) {
    console.error('Error al cargar reservas:', e)
    error.value = e.message || 'Error al conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}

async function registrarCheckIn(reserva) {
  const confirmar = window.confirm(
    `¿Deseas registrar el check-in de ${nombreHuesped(reserva)}?`
  )

  if (!confirmar) return

  procesando.value = reserva.id
  mensaje.value = ''
  error.value = ''

  try {
    await peticion(`/reservas/${reserva.id}/check-in`, {
      method: 'PATCH'
    })

    mensaje.value = 'Check-in registrado correctamente.'

    await cargarReservas()
  } catch (e) {
    console.error('Error al registrar check-in:', e)
    error.value = e.message || 'No se pudo registrar el check-in.'
  } finally {
    procesando.value = null
  }
}

async function registrarCheckOut(reserva) {
  const confirmar = window.confirm(
    `¿Deseas registrar el check-out de ${nombreHuesped(reserva)}?`
  )

  if (!confirmar) return

  procesando.value = reserva.id
  mensaje.value = ''
  error.value = ''

  try {
    await peticion(`/reservas/${reserva.id}/check-out`, {
      method: 'PATCH'
    })

    mensaje.value = 'Check-out registrado correctamente.'

    await cargarReservas()
  } catch (e) {
    console.error('Error al registrar check-out:', e)
    error.value = e.message || 'No se pudo registrar el check-out.'
  } finally {
    procesando.value = null
  }
}

onMounted(cargarReservas)
</script>

<style scoped>
.check-page {
  padding: 30px;
  color: #071827;
  font-family: 'DM Sans', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.eyebrow {
  color: #b08d57;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  margin: 7px 0;
}

.page-header p,
.toolbar p {
  color: #78838b;
  margin: 0;
  font-size: 13px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #071827;
  color: #00ff66;
  border: 0;
  border-radius: 9px;
  padding: 12px 17px;
  cursor: pointer;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 17px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border: 1px solid #e9edf0;
  border-radius: 13px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 43px;
  height: 43px;
  border-radius: 11px;
  background: #071827;
  color: #00ff66;
  display: grid;
  place-items: center;
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #78838b;
}

.stat-card strong {
  display: block;
  font-size: 25px;
  margin-top: 4px;
}

.content-card {
  background: white;
  border: 1px solid #e9edf0;
  border-radius: 14px;
  padding: 22px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 22px;
}

.toolbar h2 {
  font-size: 17px;
  margin: 0 0 5px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #e2e7e9;
  border-radius: 9px;
  padding: 10px 12px;
  color: #87939b;
  min-width: 260px;
}

.search-box input {
  border: 0;
  outline: 0;
  width: 100%;
  font: inherit;
  font-size: 13px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

th {
  text-align: left;
  font-size: 10px;
  letter-spacing: 1px;
  color: #87939b;
  padding: 13px 12px;
  border-bottom: 1px solid #e9edf0;
}

td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f2f3;
  font-size: 13px;
}

td strong,
td small {
  display: block;
}

td small {
  color: #89949b;
  margin-top: 5px;
  font-size: 11px;
}

.code {
  color: #071827;
}

.room-tag {
  display: inline-block;
  background: #edf7f0;
  color: #176b3a;
  border-radius: 6px;
  padding: 5px 8px;
  margin: 2px;
  font-size: 11px;
}

.status {
  display: inline-block;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
}

.status.confirmada {
  background: #eaf7ee;
  color: #237343;
}

.status.en-curso {
  background: #e9f1fb;
  color: #245d91;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  border-radius: 8px;
  padding: 9px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.action-btn.checkin {
  background: #071827;
  color: #00ff66;
}

.action-btn.checkout {
  background: #f4eee4;
  color: #80643b;
}

.action-btn:disabled,
.btn-refresh:disabled {
  opacity: .5;
  cursor: wait;
}

.no-action {
  color: #a0a8ad;
  font-size: 12px;
}

.empty-state {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #89949b;
  font-size: 13px;
}

.empty-state strong {
  color: #071827;
}

.alert {
  padding: 12px 15px;
  border-radius: 9px;
  margin-bottom: 15px;
  font-size: 13px;
}

.alert.success {
  background: #eaf7ee;
  color: #237343;
}

.alert.danger {
  background: #fff0ef;
  color: #a53d35;
}

@media (max-width: 800px) {
  .check-page {
    padding: 18px;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .toolbar,
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    min-width: 0;
  }
}
</style>
