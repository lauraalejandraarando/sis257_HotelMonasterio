
<template>
  <main class="pagos-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">GESTIÓN FINANCIERA</span>
        <h1>Pagos</h1>
        <p>Registro de pagos y consulta de estados de cuenta.</p>
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
        <div class="stat-icon"><ClipboardList :size="21" /></div>
        <div>
          <span>Total de reservas</span>
          <strong>{{ reservas.length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon"><Wallet :size="21" /></div>
        <div>
          <span>Reservas pendientes</span>
          <strong>{{ reservas.filter(r => r.estado === 'pendiente').length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon"><CircleCheck :size="21" /></div>
        <div>
          <span>Reservas confirmadas</span>
          <strong>{{ reservas.filter(r => r.estado === 'confirmada').length }}</strong>
        </div>
      </article>
    </section>

    <section class="content-card">
      <div class="toolbar">
        <div>
          <h2>Reservas y pagos</h2>
          <p>Selecciona una reserva para consultar su estado de cuenta.</p>
        </div>

        <div class="search-box">
          <Search :size="17" />
          <input v-model="busqueda" placeholder="Buscar código o huésped..." />
        </div>
      </div>

      <div v-if="cargando" class="empty-state">
        Cargando reservas...
      </div>

      <div v-else-if="reservasFiltradas.length === 0" class="empty-state">
        <Receipt :size="34" />
        <strong>No se encontraron reservas</strong>
        <span>Prueba con otro nombre o código de reserva.</span>
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>RESERVA</th>
              <th>HUÉSPED</th>
              <th>FECHAS</th>
              <th>ESTADO</th>
              <th>CONSULTA</th>
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
                <span class="status" :class="claseEstado(reserva.estado)">
                  {{ textoEstado(reserva.estado) }}
                </span>
              </td>

              <td>
                <button class="action-btn" @click="verEstadoCuenta(reserva)">
                  <Eye :size="16" />
                  Ver cuenta
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modalCuenta" class="modal-overlay" @click.self="cerrarCuenta">
      <section class="modal account-modal">
        <header class="modal-header">
          <div>
            <span class="eyebrow">INFORMACIÓN FINANCIERA</span>
            <h2>Estado de cuenta</h2>
            <p>{{ reservaSeleccionada?.codigoReserva }}</p>
          </div>
          <button class="close-btn" @click="cerrarCuenta">
            <X :size="21" />
          </button>
        </header>

        <div v-if="cargandoCuenta" class="empty-state">
          Consultando información...
        </div>

        <template v-else-if="cuenta">
          <div class="guest-info">
            <div class="guest-avatar">
              <UserRound :size="22" />
            </div>
            <div>
              <strong>{{ nombreHuesped(reservaSeleccionada) }}</strong>
              <span>Reserva #{{ cuenta.reservaId }}</span>
            </div>
          </div>

          <div class="account-grid">
            <article>
              <span>Total de reserva</span>
              <strong>{{ moneda(cuenta.totalReserva) }}</strong>
            </article>
            <article>
              <span>Total pagado</span>
              <strong class="green">{{ moneda(cuenta.totalPagado) }}</strong>
            </article>
            <article>
              <span>Saldo pendiente</span>
              <strong class="gold">{{ moneda(cuenta.saldoPendiente) }}</strong>
            </article>
            <article>
              <span>Mínimo para confirmar (50 %)</span>
              <strong>{{ moneda(cuenta.minimoParaConfirmar) }}</strong>
            </article>
          </div>

          <div class="progress-section">
            <div class="progress-label">
              <span>Porcentaje pagado</span>
              <strong>{{ Number(cuenta.porcentajePagado || 0).toFixed(1) }}%</strong>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min(100, Math.max(0, Number(cuenta.porcentajePagado || 0)))}%` }"
              ></div>
            </div>
            <p>
              {{ cuenta.pagoMinimoAlcanzado
                ? 'Se alcanzó el mínimo necesario para confirmar la reserva.'
                : 'Aún no se alcanza el mínimo del 50 % para confirmar.' }}
            </p>
          </div>

          <div class="account-extra">
            <div>
              <span>Estado de reserva</span>
              <strong>{{ textoEstado(cuenta.estadoReserva) }}</strong>
            </div>
            <div>
              <span>Dinero reembolsado</span>
              <strong>{{ moneda(cuenta.totalReembolsado) }}</strong>
            </div>
            <div>
              <span>Penalización</span>
              <strong>{{ moneda(cuenta.penalizacion) }}</strong>
            </div>
            <div>
              <span>Fecha límite de pago</span>
              <strong>{{ formatoFechaHora(cuenta.fechaLimitePago) }}</strong>
            </div>
          </div>

          <div class="history-section">
            <div class="section-heading">
              <div>
                <h3>Historial de pagos</h3>
                <p>Movimientos registrados para esta reserva.</p>
              </div>
              <span class="history-count">{{ pagos.length }} movimiento(s)</span>
            </div>

            <div v-if="pagos.length === 0" class="history-empty">
              Todavía no existen pagos registrados.
            </div>

            <div v-else class="history-list">
              <article v-for="pago in pagos" :key="pago.id" class="payment-row">
                <div class="payment-icon">
                  <Receipt :size="18" />
                </div>
                <div class="payment-description">
                  <strong>{{ textoTipoPago(pago.tipoPago) }}</strong>
                  <span>{{ pago.metodoPago }} · {{ formatoFechaHora(pago.fechaPago) }}</span>
                  <small v-if="pago.referencia">Ref: {{ pago.referencia }}</small>
                </div>
                <strong class="payment-amount">{{ moneda(pago.monto) }}</strong>
              </article>
            </div>
          </div>

          <div v-if="puedePagar" class="payment-form">
            <div class="section-heading">
              <div>
                <h3>Registrar un pago</h3>
                <p>Registra un adelanto o el pago del saldo.</p>
              </div>
            </div>

            <div class="form-grid">
              <label>
                Monto (Bs) *
                <input
                  v-model="form.monto"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Ej. 100"
                />
              </label>

              <label>
                Método de pago *
                <select v-model="form.metodoPago">
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </label>

              <label>
                Tipo de pago *
                <select v-model="form.tipoPago">
                  <option value="adelanto">Adelanto</option>
                  <option value="saldo">Saldo</option>
                </select>
              </label>

              <label>
                Referencia
                <input v-model="form.referencia" maxlength="100" placeholder="Opcional" />
              </label>

              <label class="full-width">
                Observaciones
                <textarea v-model="form.observaciones" placeholder="Detalles adicionales..." rows="2"></textarea>
              </label>
            </div>

            <p class="demo-note">
              <Info :size="16" />
              Registro de demostración. No se realiza ningún cobro bancario real.
            </p>

            <button
              class="btn-submit"
              @click="registrarPago"
              :disabled="guardandoPago"
            >
              <Wallet :size="17" />
              {{ guardandoPago ? 'Registrando...' : 'Registrar pago' }}
            </button>
          </div>

          <div v-else class="closed-note">
            Esta reserva no admite nuevos pagos desde el sistema.
          </div>
        </template>

        <div v-else class="empty-state">
          No se pudo cargar el estado de cuenta.
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHotelStore } from '../stores/hotelStore'

import {
  RefreshCw,
  ClipboardList,
  Wallet,
  CircleCheck,
  Search,
  Receipt,
  Eye,
  X,
  UserRound,
  Info
} from 'lucide-vue-next'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const reservas = ref([])
const busqueda = ref('')
const cargando = ref(false)
const cargandoCuenta = ref(false)
const guardandoPago = ref(false)
const mensaje = ref('')
const error = ref('')

const modalCuenta = ref(false)
const reservaSeleccionada = ref(null)
const cuenta = ref(null)
const pagos = ref([])

const formularioInicial = () => ({
  monto: '',
  metodoPago: 'efectivo',
  tipoPago: 'adelanto',
  referencia: '',
  observaciones: ''
})

const form = ref(formularioInicial())

const reservasFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return reservas.value.filter(r => {
    const codigo = (r.codigoReserva || '').toLowerCase()
    const huesped = nombreHuesped(r).toLowerCase()
    return !texto || codigo.includes(texto) || huesped.includes(texto)
  })
})

const puedePagar = computed(() => {
  return (
    cuenta.value &&
    ['pendiente', 'confirmada'].includes(cuenta.value.estadoReserva) &&
    Number(cuenta.value.saldoPendiente) > 0
  )
})

function nombreHuesped(reserva) {
  const h = reserva?.huesped
  if (!h) return 'Huésped no disponible'
  return `${h.nombres || ''} ${h.apellidos || ''}`.trim()
}

function moneda(valor) {
  return `Bs ${Number(valor || 0).toFixed(2)}`
}

function formatoFecha(fecha) {
  if (!fecha) return '—'
  const partes = String(fecha).slice(0, 10).split('-')
  if (partes.length !== 3) return fecha
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function formatoFechaHora(fecha) {
  if (!fecha) return '—'
  const valor = new Date(fecha)
  if (Number.isNaN(valor.getTime())) return formatoFecha(fecha)
  return valor.toLocaleString('es-BO', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function textoEstado(estado) {
  const nombres = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    'en curso': 'En curso',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  }
  return nombres[estado] || estado || '—'
}

function claseEstado(estado) {
  return String(estado || '').replace(/\s+/g, '-')
}

function textoTipoPago(tipo) {
  const nombres = {
    adelanto: 'Adelanto',
    saldo: 'Pago de saldo',
    reembolso: 'Reembolso',
    penalizacion: 'Penalización'
  }
  return nombres[tipo] || tipo || 'Movimiento'
}

// Todas las solicitudes incluyen el token de autenticación.
async function solicitud(url, opciones = {}) {
  const token = hotelStore.token

  if (!token) {
    throw new Error('No se encontró la sesión. Vuelve a iniciar sesión.')
  }

  const respuesta = await fetch(`${API}${url}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
      Authorization: `Bearer ${token}`
    }
  })

  const texto = await respuesta.text()
  let datos = null

  if (texto) {
    try {
      datos = JSON.parse(texto)
    } catch {
      datos = texto
    }
  }

  if (!respuesta.ok) {
    const mensajeError = typeof datos === 'object'
      ? datos?.message || 'Ocurrió un error en la solicitud.'
      : datos || 'Ocurrió un error en la solicitud.'

    throw new Error(
      Array.isArray(mensajeError)
        ? mensajeError.join(', ')
        : mensajeError
    )
  }

  return datos
}

async function cargarReservas() {
  cargando.value = true
  error.value = ''

  try {
    reservas.value = await solicitud('/reservas')
  } catch (e) {
    error.value = e.message || 'Error al conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}

async function verEstadoCuenta(reserva) {
  reservaSeleccionada.value = reserva
  modalCuenta.value = true
  cargandoCuenta.value = true
  cuenta.value = null
  pagos.value = []
  mensaje.value = ''
  error.value = ''

  try {
    const [datosCuenta, historial] = await Promise.all([
      solicitud(`/pagos/estado-cuenta/${reserva.id}`),
      solicitud(`/pagos/reserva/${reserva.id}`)
    ])

    cuenta.value = datosCuenta
    pagos.value = historial?.pagos || []
  } catch (e) {
    error.value = e.message || 'No se pudo consultar la información de pagos.'
  } finally {
    cargandoCuenta.value = false
  }
}

function cerrarCuenta() {
  modalCuenta.value = false
  cuenta.value = null
  pagos.value = []
  reservaSeleccionada.value = null
  form.value = formularioInicial()
  mensaje.value = ''
  error.value = ''
}

async function registrarPago() {
  if (!form.value.monto || Number(form.value.monto) <= 0) {
    error.value = 'Ingresa un monto válido mayor a cero.'
    return
  }

  if (Number(form.value.monto) > Number(cuenta.value.saldoPendiente)) {
    error.value = 'El monto no puede superar el saldo pendiente.'
    return
  }

  const confirmado = window.confirm(
    `¿Deseas registrar un pago de ${moneda(form.value.monto)} para esta reserva?`
  )

  if (!confirmado) return

  guardandoPago.value = true
  error.value = ''
  mensaje.value = ''

  try {
    await solicitud('/pagos', {
      method: 'POST',
      body: JSON.stringify({
        reservaId: Number(reservaSeleccionada.value.id),
        monto: Number(form.value.monto),
        metodoPago: form.value.metodoPago,
        tipoPago: form.value.tipoPago,
        referencia: form.value.referencia.trim() || undefined,
        observaciones: form.value.observaciones.trim() || undefined
      })
    })

    form.value = formularioInicial()

    await cargarReservas()
    await verEstadoCuenta(reservaSeleccionada.value)

    mensaje.value = 'Pago registrado correctamente.'
  } catch (e) {
    error.value = e.message || 'No se pudo registrar el pago.'
  } finally {
    guardandoPago.value = false
  }
}

onMounted(cargarReservas)
</script>

<style scoped>
.pagos-page {
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
.page-header p, .toolbar p {
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
.table-wrap { overflow-x: auto; }
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
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
td strong, td small { display: block; }
td small {
  color: #89949b;
  margin-top: 5px;
  font-size: 11px;
}
.code { color: #071827; }
.status {
  display: inline-block;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  background: #f0f2f3;
  color: #66737c;
}
.status.pendiente { background: #fff5df; color: #91651b; }
.status.confirmada { background: #eaf7ee; color: #237343; }
.status.en-curso { background: #e9f1fb; color: #245d91; }
.status.finalizada { background: #edf0f2; color: #59666e; }
.status.cancelada { background: #fff0ef; color: #a53d35; }
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #071827;
  color: #00ff66;
  border: 0;
  border-radius: 8px;
  padding: 9px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}
.empty-state {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #89949b;
  font-size: 13px;
}
.empty-state strong { color: #071827; }
.alert {
  padding: 12px 15px;
  border-radius: 9px;
  margin-bottom: 15px;
  font-size: 13px;
}
.alert.success { background: #eaf7ee; color: #237343; }
.alert.danger { background: #fff0ef; color: #a53d35; }

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(3, 15, 25, .68);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 760px;
  padding: 25px;
  margin: auto;
  max-height: 92vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.modal-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 25px;
  margin: 6px 0;
}
.modal-header p {
  color: #87939b;
  font-size: 12px;
  margin: 0;
}
.close-btn {
  background: #f0f2f3;
  border: 0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #071827;
}
.guest-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f7f9f8;
  border-radius: 10px;
  margin-bottom: 18px;
}
.guest-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #071827;
  color: #00ff66;
}
.guest-info strong, .guest-info span { display: block; }
.guest-info span {
  color: #87939b;
  font-size: 11px;
  margin-top: 4px;
}
.account-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.account-grid article {
  border: 1px solid #e9edf0;
  border-radius: 10px;
  padding: 13px;
}
.account-grid span, .account-extra span {
  display: block;
  color: #87939b;
  font-size: 11px;
  margin-bottom: 7px;
}
.account-grid strong {
  font-size: 19px;
}
.green { color: #21834a; }
.gold { color: #a17a3e; }
.progress-section {
  margin: 20px 0;
  padding: 16px;
  border-radius: 10px;
  background: #f7f9f8;
}
.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
}
.progress-track {
  height: 9px;
  border-radius: 20px;
  background: #e0e7e2;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #00a94f;
  border-radius: 20px;
  transition: width .3s;
}
.progress-section p {
  color: #78838b;
  font-size: 11px;
  margin: 9px 0 0;
}
.account-extra {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 15px 0;
  border-bottom: 1px solid #edf0f1;
}
.account-extra strong { font-size: 12px; }
.history-section, .payment-form { margin-top: 22px; }
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}
.section-heading h3 {
  font-size: 15px;
  margin: 0 0 4px;
}
.section-heading p {
  font-size: 11px;
  color: #87939b;
  margin: 0;
}
.history-count {
  color: #87939b;
  font-size: 11px;
}
.history-empty {
  padding: 17px;
  text-align: center;
  background: #f7f9f8;
  border-radius: 9px;
  color: #87939b;
  font-size: 12px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.payment-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border: 1px solid #edf0f1;
  border-radius: 9px;
}
.payment-icon {
  width: 35px;
  height: 35px;
  background: #071827;
  color: #00ff66;
  border-radius: 8px;
  display: grid;
  place-items: center;
}
.payment-description { flex: 1; }
.payment-description strong, .payment-description span, .payment-description small {
  display: block;
}
.payment-description strong { font-size: 12px; }
.payment-description span, .payment-description small {
  color: #87939b;
  font-size: 10px;
  margin-top: 4px;
}
.payment-amount {
  font-size: 13px;
  color: #21834a;
}
.payment-form {
  border-top: 1px solid #edf0f1;
  padding-top: 20px;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
}
.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #53616a;
  font-size: 11px;
  font-weight: 700;
}
.form-grid input, .form-grid select, .form-grid textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dfe5e7;
  border-radius: 8px;
  padding: 11px;
  font-family: inherit;
  font-size: 12px;
  outline: none;
  color: #071827;
  background: white;
}
.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus {
  border-color: #00a94f;
}
.full-width { grid-column: 1 / -1; }
.demo-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #80643b;
  background: #faf5eb;
  padding: 11px;
  border-radius: 8px;
  font-size: 11px;
  margin: 15px 0;
}
.btn-submit {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  border: 0;
  border-radius: 9px;
  background: #071827;
  color: #00ff66;
  font-weight: 700;
  cursor: pointer;
}
.btn-submit:disabled {
  opacity: .5;
  cursor: wait;
}
.closed-note {
  background: #f7f9f8;
  color: #78838b;
  padding: 14px;
  border-radius: 9px;
  font-size: 12px;
  margin-top: 20px;
}
@media (max-width: 800px) {
  .pagos-page { padding: 18px; }
  .stats { grid-template-columns: 1fr; }
  .toolbar, .page-header { align-items: stretch; flex-direction: column; }
  .search-box { min-width: 0; }
}
@media (max-width: 520px) {
  .account-grid, .account-extra, .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: auto; }
  .modal { padding: 18px; }
}
</style>
