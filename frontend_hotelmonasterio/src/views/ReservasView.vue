
<template>
  <div class="rv-page">
    <header class="rv-header">
      <div>
        <span class="rv-eyebrow">GESTIÓN HOTELERA</span>
        <h1>Reservas</h1>
        <p>Administra las reservas, huéspedes, habitaciones y pagos del hotel.</p>
      </div>
      <button class="rv-primary" @click="abrirNuevaReserva">
        <Plus :size="18" />
        Nueva reserva
      </button>
    </header>

    <div v-if="mensaje.texto" class="rv-message" :class="mensaje.tipo">
      {{ mensaje.texto }}
      <button @click="mensaje.texto = ''">×</button>
    </div>

    <section class="rv-stats">
      <article class="rv-stat">
        <div class="rv-stat-icon"><CalendarDays /></div>
        <div>
          <span>Total de reservas</span>
          <strong>{{ reservas.length }}</strong>
        </div>
      </article>
      <article class="rv-stat">
        <div class="rv-stat-icon pending"><Clock3 /></div>
        <div>
          <span>Pendientes</span>
          <strong>{{ contarEstado('pendiente') }}</strong>
        </div>
      </article>
      <article class="rv-stat">
        <div class="rv-stat-icon confirmed"><CheckCircle2 /></div>
        <div>
          <span>Confirmadas</span>
          <strong>{{ contarEstado('confirmada') }}</strong>
        </div>
      </article>
      <article class="rv-stat">
        <div class="rv-stat-icon occupied"><BedDouble /></div>
        <div>
          <span>En curso</span>
          <strong>{{ contarEstado('en curso') }}</strong>
        </div>
      </article>
    </section>

    <section class="rv-panel">
      <div class="rv-toolbar">
        <div>
          <h2>Listado de reservas</h2>
          <p>Consulta y administra las reservas registradas.</p>
        </div>
        <div class="rv-filters">
          <div class="rv-search">
            <Search :size="17" />
            <input v-model="busqueda" placeholder="Buscar código o huésped..." />
          </div>
          <select v-model="filtroEstado">
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="en curso">En curso</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div v-if="cargando" class="rv-empty">Cargando reservas...</div>
      <div v-else-if="reservasFiltradas.length === 0" class="rv-empty">
        <CalendarDays :size="34" />
        <strong>No hay reservas para mostrar</strong>
        <span>Registra una nueva reserva o cambia los filtros.</span>
      </div>

      <div v-else class="rv-table-wrap">
        <table class="rv-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>HUÉSPED</th>
              <th>ESTANCIA</th>
              <th>HABITACIONES</th>
              <th>TOTAL ESTIMADO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reserva in reservasFiltradas" :key="reserva.id">
              <td>
                <strong class="rv-code">{{ reserva.codigoReserva }}</strong>
              </td>
              <td>
                <strong>{{ nombreHuesped(reserva.huesped) }}</strong>
                <small>{{ reserva.huesped?.numeroDocumento || 'Sin documento' }}</small>
              </td>
              <td>
                <strong>{{ fechaCorta(reserva.fechaEntrada) }}</strong>
                <small>hasta {{ fechaCorta(reserva.fechaSalida) }}</small>
              </td>
              <td>
                <span class="rv-room-count">
                  <BedDouble :size="15" />
                  {{ reserva.detalles?.length || 0 }}
                </span>
              </td>
              <td class="rv-money">{{ moneda(calcularTotal(reserva)) }}</td>
              <td>
                <span class="rv-status" :class="claseEstado(reserva.estado)">
                  {{ etiquetaEstado(reserva.estado) }}
                </span>
              </td>
              <td>
                <div class="rv-actions">
                  <button title="Ver detalle" @click="verDetalle(reserva)">
                    <Eye :size="17" />
                  </button>
                  <button
                    title="Editar reserva"
                    :disabled="reserva.estado === 'cancelada' || reserva.estado === 'finalizada'"
                    @click="abrirEdicion(reserva)"
                  >
                    <Pencil :size="16" />
                  </button>
                  <button
                    title="Cancelar reserva"
                    class="danger"
                    :disabled="!['pendiente', 'confirmada'].includes(reserva.estado)"
                    @click="cancelarReserva(reserva)"
                  >
                    <Ban :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="rv-table-footer">
        Mostrando {{ reservasFiltradas.length }} de {{ reservas.length }} reservas
      </div>
    </section>

    <!-- MODAL NUEVA / EDITAR RESERVA -->
    <div v-if="mostrarFormulario" class="rv-overlay" @click.self="cerrarFormulario">
      <section class="rv-modal rv-modal-large">
        <div class="rv-modal-header">
          <div>
            <span class="rv-eyebrow">GESTIÓN DE RESERVAS</span>
            <h2>{{ modoEdicion ? 'Editar reserva' : 'Registrar reserva' }}</h2>
            <p>{{ modoEdicion ? 'Actualiza los datos de la reserva.' : 'Completa los datos para registrar una nueva reserva.' }}</p>
          </div>
          <button class="rv-close" @click="cerrarFormulario"><X /></button>
        </div>

        <form @submit.prevent="guardarReserva">
          <div class="rv-form-section">
            <h3><Users :size="17" /> Datos del huésped</h3>
            <div class="rv-field">
              <label>Huésped *</label>
              <select v-model.number="form.huespedId" required>
                <option value="" disabled>Selecciona un huésped</option>
                <option v-for="h in huespedesActivos" :key="h.id" :value="h.id">
                  {{ nombreHuesped(h) }} — {{ h.numeroDocumento }}
                </option>
              </select>
              <small v-if="huespedesActivos.length === 0">
                No hay huéspedes activos. Registra uno desde el módulo Huéspedes.
              </small>
            </div>
          </div>

          <div class="rv-form-section">
            <h3><CalendarDays :size="17" /> Fechas y ocupación</h3>
            <div class="rv-form-grid">
              <div class="rv-field">
                <label>Fecha de entrada *</label>
                <input type="date" v-model="form.fechaEntrada" :min="fechaHoy" required />
              </div>
              <div class="rv-field">
                <label>Fecha de salida *</label>
                <input type="date" v-model="form.fechaSalida" :min="form.fechaEntrada || fechaHoy" required />
              </div>
              <div class="rv-field">
                <label>Cantidad de huéspedes *</label>
                <input type="number" v-model.number="form.cantidadHuespedes" min="1" required />
              </div>
            </div>
          </div>

          <div class="rv-form-section">
            <h3><BedDouble :size="17" /> Selección de habitaciones</h3>
            <p class="rv-help">Selecciona una o varias habitaciones disponibles para las fechas solicitadas.</p>

            <div v-if="habitacionesDisponibles.length === 0" class="rv-inline-empty">
              No hay habitaciones disponibles para seleccionar.
            </div>

            <div v-else class="rv-room-options">
              <label
                v-for="hab in habitacionesDisponibles"
                :key="hab.id"
                class="rv-room-option"
                :class="{ selected: form.habitacionesIds.includes(hab.id) }"
              >
                <input
                  type="checkbox"
                  :value="hab.id"
                  v-model="form.habitacionesIds"
                />
                <div>
                  <strong>Habitación {{ hab.numero }}</strong>
                  <span>{{ hab.tipoHabitacion?.nombre || 'Sin tipo' }} · Piso {{ hab.piso }}</span>
                  <small>Capacidad: {{ hab.tipoHabitacion?.capacidad || 0 }} personas</small>
                </div>
                <b>{{ moneda(hab.tipoHabitacion?.precioNoche) }} / noche</b>
              </label>
            </div>
            <div class="rv-capacity" v-if="form.habitacionesIds.length">
              Capacidad seleccionada: {{ capacidadSeleccionada }} personas
              <span v-if="form.cantidadHuespedes > capacidadSeleccionada">
                · La capacidad no es suficiente.
              </span>
            </div>
          </div>

          <div class="rv-form-section">
            <h3>Observaciones</h3>
            <div class="rv-field">
              <textarea v-model="form.observaciones" rows="3" maxlength="500" placeholder="Observaciones adicionales (opcional)"></textarea>
            </div>
          </div>

          <div class="rv-estimate" v-if="form.habitacionesIds.length && nochesFormulario > 0">
            <div>
              <span>Duración estimada</span>
              <strong>{{ nochesFormulario }} noche(s)</strong>
            </div>
            <div>
              <span>Total estimado</span>
              <strong>{{ moneda(totalFormulario) }}</strong>
            </div>
          </div>

          <div class="rv-modal-footer">
            <button type="button" class="rv-secondary" @click="cerrarFormulario">Cancelar</button>
            <button
              type="submit"
              class="rv-primary"
              :disabled="guardando || !form.huespedId || !form.habitacionesIds.length || form.cantidadHuespedes > capacidadSeleccionada"
            >
              {{ guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Registrar reserva' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- MODAL DETALLE -->
    <div v-if="mostrarDetalle" class="rv-overlay" @click.self="cerrarDetalle">
      <section class="rv-modal rv-modal-large">
        <div class="rv-modal-header">
          <div>
            <span class="rv-eyebrow">INFORMACIÓN DE RESERVA</span>
            <h2>{{ reservaSeleccionada?.codigoReserva }}</h2>
            <p>Detalle de la estancia y situación financiera.</p>
          </div>
          <button class="rv-close" @click="cerrarDetalle"><X /></button>
        </div>

        <div v-if="cargandoDetalle" class="rv-empty">Consultando información...</div>
        <template v-else-if="reservaSeleccionada">
          <div class="rv-detail-top">
            <span class="rv-status" :class="claseEstado(reservaSeleccionada.estado)">
              {{ etiquetaEstado(reservaSeleccionada.estado) }}
            </span>
            <span class="rv-detail-date">Registro: {{ fechaCorta(reservaSeleccionada.fechaCreacion) }}</span>
          </div>

          <div class="rv-detail-grid">
            <div class="rv-detail-card">
              <span>Huésped</span>
              <strong>{{ nombreHuesped(reservaSeleccionada.huesped) }}</strong>
              <small>{{ reservaSeleccionada.huesped?.numeroDocumento || 'Sin documento' }}</small>
              <small>{{ reservaSeleccionada.huesped?.telefono || 'Sin teléfono' }}</small>
            </div>
            <div class="rv-detail-card">
              <span>Fechas de estancia</span>
              <strong>{{ fechaCorta(reservaSeleccionada.fechaEntrada) }}</strong>
              <small>Salida: {{ fechaCorta(reservaSeleccionada.fechaSalida) }}</small>
              <small>{{ calcularNoches(reservaSeleccionada) }} noche(s)</small>
            </div>
            <div class="rv-detail-card">
              <span>Ocupación</span>
              <strong>{{ reservaSeleccionada.cantidadHuespedes }} huésped(es)</strong>
              <small>{{ reservaSeleccionada.detalles?.length || 0 }} habitación(es)</small>
            </div>
          </div>

          <div class="rv-form-section">
            <h3><BedDouble :size="17" /> Habitaciones reservadas</h3>
            <div class="rv-detail-rooms">
              <div v-for="detalle in reservaSeleccionada.detalles || []" :key="detalle.id">
                <div>
                  <strong>Habitación {{ detalle.habitacion?.numero }}</strong>
                  <small>{{ detalle.habitacion?.tipoHabitacion?.nombre || 'Habitación' }}</small>
                </div>
                <b>{{ moneda(detalle.precioNoche) }} / noche</b>
              </div>
            </div>
          </div>

          <div class="rv-form-section">
            <h3><Wallet :size="17" /> Estado de cuenta</h3>
            <div v-if="estadoCuenta" class="rv-account">
              <div><span>Total de la reserva</span><strong>{{ moneda(estadoCuenta.totalReserva) }}</strong></div>
              <div><span>Total pagado</span><strong class="rv-green">{{ moneda(estadoCuenta.totalPagado) }}</strong></div>
              <div><span>Mínimo para confirmar (50 %)</span><strong>{{ moneda(estadoCuenta.minimoParaConfirmar) }}</strong></div>
              <div><span>Saldo pendiente</span><strong>{{ moneda(estadoCuenta.saldoPendiente) }}</strong></div>
              <div><span>Penalización</span><strong>{{ moneda(estadoCuenta.penalizacion) }}</strong></div>
              <div><span>Reembolsado</span><strong>{{ moneda(estadoCuenta.totalReembolsado) }}</strong></div>
              <div class="rv-progress-wrap">
                <div class="rv-progress-label">
                  <span>Porcentaje pagado</span>
                  <strong>{{ estadoCuenta.porcentajePagado }} %</strong>
                </div>
                <div class="rv-progress">
                  <div :style="{ width: Math.min(100, Number(estadoCuenta.porcentajePagado) || 0) + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="rv-inline-empty">No se pudo consultar el estado de cuenta.</div>

            <div v-if="reservaSeleccionada.fechaLimitePago && reservaSeleccionada.estado === 'pendiente'" class="rv-deadline">
              <Clock3 :size="16" />
              Plazo para el anticipo: {{ fechaHora(reservaSeleccionada.fechaLimitePago) }}
            </div>
          </div>

          <div class="rv-form-section">
            <div class="rv-history-heading">
              <h3><Receipt :size="17" /> Historial de pagos</h3>
              <button
                v-if="['pendiente', 'confirmada'].includes(reservaSeleccionada.estado) && Number(estadoCuenta?.saldoPendiente) > 0"
                class="rv-small-primary"
                @click="abrirPago"
              >
                <Plus :size="15" /> Registrar pago
              </button>
            </div>

            <div v-if="pagos.length === 0" class="rv-inline-empty">
              Todavía no hay pagos registrados.
            </div>
            <div v-else class="rv-payments">
              <div v-for="pago in pagos" :key="pago.id">
                <div>
                  <strong>{{ etiquetaTipoPago(pago.tipoPago) }}</strong>
                  <small>{{ etiquetaMetodo(pago.metodoPago) }} · {{ fechaHora(pago.fechaPago) }}</small>
                  <small v-if="pago.referencia">Referencia: {{ pago.referencia }}</small>
                </div>
                <b>{{ moneda(pago.monto) }}</b>
              </div>
            </div>
          </div>

          <div v-if="reservaSeleccionada.observaciones" class="rv-observations">
            <strong>Observaciones</strong>
            <p>{{ reservaSeleccionada.observaciones }}</p>
          </div>
        </template>

        <div class="rv-modal-footer">
          <button class="rv-secondary" @click="cerrarDetalle">Cerrar</button>
        </div>
      </section>
    </div>

    <!-- MODAL REGISTRAR PAGO -->
    <div v-if="mostrarPago" class="rv-overlay rv-overlay-front" @click.self="cerrarPago">
      <section class="rv-modal rv-payment-modal">
        <div class="rv-modal-header">
          <div>
            <span class="rv-eyebrow">PAGO DE DEMOSTRACIÓN</span>
            <h2>Registrar pago</h2>
            <p>Este movimiento se guardará en el sistema, pero no realizará un cobro real.</p>
          </div>
          <button class="rv-close" @click="cerrarPago"><X /></button>
        </div>

        <form @submit.prevent="registrarPago">
          <div class="rv-payment-summary">
            <div><span>Total de la reserva</span><strong>{{ moneda(estadoCuenta?.totalReserva) }}</strong></div>
            <div><span>Pagado</span><strong>{{ moneda(estadoCuenta?.totalPagado) }}</strong></div>
            <div><span>Saldo pendiente</span><strong>{{ moneda(estadoCuenta?.saldoPendiente) }}</strong></div>
          </div>

          <div class="rv-field">
            <label>Monto a registrar (Bs) *</label>
            <input type="number" v-model.number="pagoForm.monto" min="0.01" step="0.01" :max="estadoCuenta?.saldoPendiente" required />
            <small>Mínimo para confirmar: {{ moneda(estadoCuenta?.minimoParaConfirmar) }}</small>
          </div>
          <div class="rv-field">
            <label>Método de pago *</label>
            <select v-model="pagoForm.metodoPago" required>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>
          <div class="rv-field">
            <label>Tipo de pago *</label>
            <select v-model="pagoForm.tipoPago" required>
              <option value="adelanto">Adelanto</option>
              <option value="saldo">Pago de saldo</option>
            </select>
          </div>
          <div class="rv-field">
            <label>Referencia (opcional)</label>
            <input v-model="pagoForm.referencia" maxlength="100" placeholder="Referencia de demostración" />
          </div>
          <div class="rv-field">
            <label>Observaciones</label>
            <textarea v-model="pagoForm.observaciones" rows="2" placeholder="Pago simulado para demostración"></textarea>
          </div>

          <div class="rv-demo-note">
            <Info :size="17" />
            Pago simulado: no se realizará ninguna transacción bancaria.
          </div>

          <div class="rv-modal-footer">
            <button type="button" class="rv-secondary" @click="cerrarPago">Cancelar</button>
            <button type="submit" class="rv-primary" :disabled="guardandoPago || !pagoForm.monto || pagoForm.monto <= 0 || pagoForm.monto > Number(estadoCuenta?.saldoPendiente)">
              {{ guardandoPago ? 'Registrando...' : 'Registrar pago' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Search, CalendarDays, Clock3, CheckCircle2,
  BedDouble, Eye, Pencil, Ban, X, Users, Wallet,
  Receipt, Info
} from 'lucide-vue-next'
import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const reservas = ref([])
const huespedes = ref([])
const habitaciones = ref([])
const pagos = ref([])
const estadoCuenta = ref(null)

const cargando = ref(false)
const cargandoDetalle = ref(false)
const guardando = ref(false)
const guardandoPago = ref(false)

const busqueda = ref('')
const filtroEstado = ref('')

const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const mostrarPago = ref(false)
const modoEdicion = ref(false)

const reservaSeleccionada = ref(null)
const mensaje = ref({ texto: '', tipo: 'success' })

const fechaHoy = new Date().toISOString().slice(0, 10)

const formularioInicial = () => ({
  huespedId: '',
  fechaEntrada: '',
  fechaSalida: '',
  cantidadHuespedes: 1,
  habitacionesIds: [],
  observaciones: ''
})

const form = ref(formularioInicial())

const pagoForm = ref({
  monto: null,
  metodoPago: 'efectivo',
  tipoPago: 'adelanto',
  referencia: '',
  observaciones: 'Pago simulado para demostración.'
})

const huespedesActivos = computed(() =>
  huespedes.value.filter(h => h.estado === true)
)

const habitacionesDisponibles = computed(() => {
  const idsActuales = modoEdicion.value
    ? (reservaSeleccionada.value?.detalles || []).map(d => d.habitacion?.id)
    : []

  return habitaciones.value.filter(h =>
    (h.estado === 'disponible' && h.tipoHabitacion?.activo !== false) ||
    (modoEdicion.value && idsActuales.includes(h.id))
  )
})

const capacidadSeleccionada = computed(() =>
  habitacionesDisponibles.value
    .filter(h => form.value.habitacionesIds.includes(h.id))
    .reduce((total, h) => total + Number(h.tipoHabitacion?.capacidad || 0), 0)
)

const nochesFormulario = computed(() => {
  if (!form.value.fechaEntrada || !form.value.fechaSalida) return 0
  const entrada = new Date(`${form.value.fechaEntrada}T00:00:00`)
  const salida = new Date(`${form.value.fechaSalida}T00:00:00`)
  return Math.round((salida - entrada) / 86400000)
})

const totalFormulario = computed(() =>
  habitacionesDisponibles.value
    .filter(h => form.value.habitacionesIds.includes(h.id))
    .reduce((total, h) =>
      total + Number(h.tipoHabitacion?.precioNoche || 0) * nochesFormulario.value, 0)
)

const reservasFiltradas = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return reservas.value.filter(r => {
    const nombre = nombreHuesped(r.huesped).toLowerCase()
    const coincideTexto =
      !texto ||
      String(r.codigoReserva || '').toLowerCase().includes(texto) ||
      nombre.includes(texto)

    const coincideEstado = !filtroEstado.value || r.estado === filtroEstado.value
    return coincideTexto && coincideEstado
  })
})

function mostrarMensaje(texto, tipo = 'success') {
  mensaje.value = { texto, tipo }
  window.setTimeout(() => {
    if (mensaje.value.texto === texto) mensaje.value.texto = ''
  }, 5000)
}

async function peticion(url, opciones = {}) {
  const respuesta = await fetch(`${API}${url}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hotelStore.token}`,
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
    const error = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message || datos?.error || 'Ocurrió un error en el servidor.'
    throw new Error(error)
  }

  return datos
}

async function cargarDatos() {
  cargando.value = true
  try {
    const [listaReservas, listaHuespedes, listaHabitaciones] = await Promise.all([
      peticion('/reservas'),
      peticion('/huespedes'),
      peticion('/habitaciones')
    ])

    reservas.value = Array.isArray(listaReservas) ? listaReservas : []
    huespedes.value = Array.isArray(listaHuespedes) ? listaHuespedes : []
    habitaciones.value = Array.isArray(listaHabitaciones) ? listaHabitaciones : []
  } catch (error) {
    mostrarMensaje(`No se pudieron cargar los datos: ${error.message}`, 'error')
  } finally {
    cargando.value = false
  }
}

function nombreHuesped(huesped) {
  if (!huesped) return 'Huésped no disponible'
  return `${huesped.nombres || ''} ${huesped.apellidos || ''}`.trim()
}

function contarEstado(estado) {
  return reservas.value.filter(r => r.estado === estado).length
}

function etiquetaEstado(estado) {
  const etiquetas = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    cancelada: 'Cancelada',
    'en curso': 'En curso',
    finalizada: 'Finalizada'
  }
  return etiquetas[estado] || estado || 'Sin estado'
}

function claseEstado(estado) {
  return {
    pendiente: 'status-pending',
    confirmada: 'status-confirmed',
    cancelada: 'status-cancelled',
    'en curso': 'status-progress',
    finalizada: 'status-finished'
  }[estado] || 'status-pending'
}

function moneda(valor) {
  return `Bs ${Number(valor || 0).toFixed(2)}`
}

function fechaCorta(valor) {
  if (!valor) return '—'
  const fecha = String(valor).slice(0, 10).split('-')
  if (fecha.length !== 3) return valor
  return `${fecha[2]}/${fecha[1]}/${fecha[0]}`
}

function fechaHora(valor) {
  if (!valor) return '—'
  return new Date(valor).toLocaleString('es-BO', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function calcularNoches(reserva) {
  if (!reserva?.fechaEntrada || !reserva?.fechaSalida) return 0
  const entrada = new Date(`${String(reserva.fechaEntrada).slice(0, 10)}T00:00:00`)
  const salida = new Date(`${String(reserva.fechaSalida).slice(0, 10)}T00:00:00`)
  return Math.max(0, Math.round((salida - entrada) / 86400000))
}

function calcularTotal(reserva) {
  const noches = calcularNoches(reserva)
  return (reserva.detalles || []).reduce((total, detalle) =>
    total + Number(detalle.precioNoche || 0) * noches, 0)
}

function etiquetaTipoPago(tipo) {
  return {
    adelanto: 'Adelanto',
    saldo: 'Pago de saldo',
    reembolso: 'Reembolso',
    penalizacion: 'Penalización'
  }[tipo] || tipo
}

function etiquetaMetodo(metodo) {
  return {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta',
    interno: 'Movimiento interno'
  }[metodo] || metodo
}

function abrirNuevaReserva() {
  modoEdicion.value = false
  reservaSeleccionada.value = null
  form.value = formularioInicial()
  mostrarFormulario.value = true
}

function abrirEdicion(reserva) {
  modoEdicion.value = true
  reservaSeleccionada.value = reserva

  form.value = {
    huespedId: reserva.huesped?.id || '',
    fechaEntrada: String(reserva.fechaEntrada).slice(0, 10),
    fechaSalida: String(reserva.fechaSalida).slice(0, 10),
    cantidadHuespedes: reserva.cantidadHuespedes,
    habitacionesIds: (reserva.detalles || [])
      .map(d => d.habitacion?.id)
      .filter(Boolean),
    observaciones: reserva.observaciones || ''
  }

  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  form.value = formularioInicial()
}

async function guardarReserva() {
  if (form.value.fechaSalida <= form.value.fechaEntrada) {
    mostrarMensaje('La fecha de salida debe ser posterior a la fecha de entrada.', 'error')
    return
  }

  if (!form.value.habitacionesIds.length) {
    mostrarMensaje('Selecciona al menos una habitación.', 'error')
    return
  }

  if (form.value.cantidadHuespedes > capacidadSeleccionada.value) {
    mostrarMensaje('La capacidad de las habitaciones seleccionadas es insuficiente.', 'error')
    return
  }

  guardando.value = true

  const datos = {
    huespedId: Number(form.value.huespedId),
    fechaEntrada: form.value.fechaEntrada,
    fechaSalida: form.value.fechaSalida,
    cantidadHuespedes: Number(form.value.cantidadHuespedes),
    habitacionesIds: form.value.habitacionesIds.map(Number),
    observaciones: form.value.observaciones.trim()
  }

  try {
    if (modoEdicion.value) {
      await peticion(`/reservas/${reservaSeleccionada.value.id}`, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      })
      mostrarMensaje('Reserva actualizada correctamente.')
    } else {
      await peticion('/reservas', {
        method: 'POST',
        body: JSON.stringify(datos)
      })
      mostrarMensaje('Reserva registrada correctamente. Recuerda que está pendiente hasta alcanzar el anticipo mínimo.')
    }

    cerrarFormulario()
    await cargarDatos()
  } catch (error) {
    mostrarMensaje(error.message, 'error')
  } finally {
    guardando.value = false
  }
}

async function verDetalle(reserva) {
  mostrarDetalle.value = true
  cargandoDetalle.value = true
  reservaSeleccionada.value = reserva
  estadoCuenta.value = null
  pagos.value = []

  try {
    const [detalle, cuenta, historial] = await Promise.all([
      peticion(`/reservas/${reserva.id}`),
      peticion(`/pagos/estado-cuenta/${reserva.id}`),
      peticion(`/pagos/reserva/${reserva.id}`)
    ])

    reservaSeleccionada.value = detalle
    estadoCuenta.value = cuenta
    pagos.value = historial?.pagos || []
  } catch (error) {
    mostrarMensaje(`No se pudo consultar el detalle: ${error.message}`, 'error')
  } finally {
    cargandoDetalle.value = false
  }
}

function cerrarDetalle() {
  mostrarDetalle.value = false
  mostrarPago.value = false
  reservaSeleccionada.value = null
  estadoCuenta.value = null
  pagos.value = []
}

async function cancelarReserva(reserva) {
  const confirmado = window.confirm(
    `¿Deseas cancelar la reserva ${reserva.codigoReserva}?\n\nSi está confirmada, el backend aplicará la penalización correspondiente.`
  )

  if (!confirmado) return

  try {
    await peticion(`/reservas/${reserva.id}`, { method: 'DELETE' })
    mostrarMensaje('Reserva cancelada. El backend aplicó las reglas correspondientes.')
    await cargarDatos()
  } catch (error) {
    mostrarMensaje(error.message, 'error')
  }
}

function abrirPago() {
  pagoForm.value = {
    monto: null,
    metodoPago: 'efectivo',
    tipoPago: 'adelanto',
    referencia: '',
    observaciones: 'Pago simulado para demostración.'
  }
  mostrarPago.value = true
}

function cerrarPago() {
  mostrarPago.value = false
}

async function registrarPago() {
  if (!reservaSeleccionada.value || !estadoCuenta.value) return

  const monto = Number(pagoForm.value.monto)
  const saldo = Number(estadoCuenta.value.saldoPendiente)

  if (!Number.isFinite(monto) || monto <= 0 || monto > saldo) {
    mostrarMensaje('El monto debe ser mayor a cero y no superar el saldo pendiente.', 'error')
    return
  }

  guardandoPago.value = true

  const datos = {
    reservaId: Number(reservaSeleccionada.value.id),
    monto,
    metodoPago: pagoForm.value.metodoPago,
    tipoPago: pagoForm.value.tipoPago,
    referencia: pagoForm.value.referencia.trim(),
    observaciones: pagoForm.value.observaciones.trim()
  }

  try {
    await peticion('/pagos', {
      method: 'POST',
      body: JSON.stringify(datos)
    })

    mostrarPago.value = false
    mostrarMensaje('Pago de demostración registrado correctamente.')

    await verDetalle(reservaSeleccionada.value)
    await cargarDatos()
  } catch (error) {
    mostrarMensaje(error.message, 'error')
  } finally {
    guardandoPago.value = false
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.rv-page {
  color: #071827;
  display: flex;
  flex-direction: column;
  gap: 25px;
  font-family: 'DM Sans', sans-serif;
  padding-bottom: 35px;
}

.rv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.rv-eyebrow {
  display: block;
  color: #b08d57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 7px;
}

.rv-header h1,
.rv-modal-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  margin: 0;
  color: #071827;
}

.rv-header p,
.rv-modal-header p {
  color: #7b8790;
  font-size: 13px;
  margin: 7px 0 0;
}

.rv-primary,
.rv-secondary,
.rv-small-primary {
  border: 0;
  border-radius: 9px;
  padding: 11px 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: .2s;
}

.rv-primary {
  background: #071827;
  color: #00ff66;
}

.rv-primary:hover:not(:disabled) {
  background: #0c2b3b;
  transform: translateY(-1px);
}

.rv-primary:disabled,
.rv-secondary:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.rv-secondary {
  background: #edf0f2;
  color: #34434d;
}

.rv-small-primary {
  background: #e8f8ef;
  color: #087b3c;
  padding: 8px 12px;
}

.rv-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.rv-stat {
  background: #fff;
  border: 1px solid #e8ecee;
  border-radius: 13px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 13px;
  box-shadow: 0 4px 15px #07182708;
}

.rv-stat-icon {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: #071827;
  color: #00ff66;
}

.rv-stat-icon.pending { background: #fff4df; color: #b17b20; }
.rv-stat-icon.confirmed { background: #e6f7ed; color: #128448; }
.rv-stat-icon.occupied { background: #eaf0f8; color: #345d91; }

.rv-stat span {
  display: block;
  color: #849099;
  font-size: 11px;
  margin-bottom: 5px;
}

.rv-stat strong {
  font-size: 23px;
  color: #071827;
}

.rv-panel {
  background: #fff;
  border: 1px solid #e8ecee;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 18px #07182708;
}

.rv-toolbar {
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.rv-toolbar h2 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  margin: 0;
}

.rv-toolbar p {
  color: #87929a;
  font-size: 12px;
  margin: 5px 0 0;
}

.rv-filters {
  display: flex;
  gap: 10px;
}

.rv-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f7f9fa;
  border: 1px solid #e6eaed;
  border-radius: 8px;
  padding: 0 11px;
  color: #85919a;
}

.rv-search input {
  border: 0;
  outline: 0;
  background: transparent;
  padding: 10px 0;
  width: 190px;
  font-size: 12px;
}

.rv-filters select,
.rv-field input,
.rv-field select,
.rv-field textarea {
  border: 1px solid #e1e6e9;
  border-radius: 8px;
  background: #fff;
  color: #263743;
  padding: 10px 12px;
  outline: none;
  width: 100%;
  font: inherit;
  font-size: 12px;
}

.rv-filters select {
  width: auto;
  min-width: 150px;
  background: #f7f9fa;
}

.rv-field input:focus,
.rv-field select:focus,
.rv-field textarea:focus,
.rv-filters select:focus {
  border-color: #00a94f;
  box-shadow: 0 0 0 3px #00ff6618;
}

.rv-table-wrap {
  overflow-x: auto;
}

.rv-table {
  border-collapse: collapse;
  width: 100%;
  min-width: 850px;
}

.rv-table th {
  background: #f7f9fa;
  color: #82909a;
  font-size: 9px;
  letter-spacing: .8px;
  text-align: left;
  padding: 13px 15px;
  font-weight: 800;
}

.rv-table td {
  padding: 15px;
  border-top: 1px solid #edf0f2;
  font-size: 12px;
  vertical-align: middle;
}

.rv-table td strong,
.rv-table td small {
  display: block;
}

.rv-table td small {
  color: #929da5;
  margin-top: 5px;
  font-size: 10px;
}

.rv-code { color: #0b6540; }
.rv-money { font-weight: 800; white-space: nowrap; }
.rv-room-count { display: flex; gap: 6px; align-items: center; color: #536774; }

.rv-status {
  display: inline-flex;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.status-pending { background: #fff2d9; color: #946314; }
.status-confirmed { background: #e2f6e9; color: #13713d; }
.status-cancelled { background: #fde9e8; color: #b23a35; }
.status-progress { background: #e5effb; color: #315f91; }
.status-finished { background: #eceef0; color: #56616a; }

.rv-actions {
  display: flex;
  gap: 5px;
}

.rv-actions button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 7px;
  background: #eff3f4;
  color: #34505e;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.rv-actions button:hover:not(:disabled) {
  background: #dff6e8;
  color: #087b3c;
}

.rv-actions button.danger:hover:not(:disabled) {
  background: #fde9e8;
  color: #b23a35;
}

.rv-actions button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.rv-table-footer {
  padding: 13px 20px;
  color: #89949c;
  font-size: 11px;
  border-top: 1px solid #edf0f2;
}

.rv-empty,
.rv-inline-empty {
  padding: 35px 20px;
  color: #89949c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 9px;
  font-size: 12px;
  text-align: center;
}

.rv-empty strong { color: #42525d; }

.rv-message {
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rv-message.success { background: #e6f7ed; color: #176c3e; }
.rv-message.error { background: #fdebea; color: #a8322d; }
.rv-message button {
  border: 0;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
}

.rv-overlay {
  position: fixed;
  inset: 0;
  background: #071827a8;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.rv-overlay-front { z-index: 1100; }

.rv-modal {
  background: #fff;
  border-radius: 15px;
  width: 100%;
  max-width: 620px;
  max-height: 92vh;
  overflow-y: auto;
  padding: 25px;
  box-shadow: 0 20px 70px #0003;
}

.rv-modal-large { max-width: 850px; }

.rv-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f2;
  margin-bottom: 20px;
}

.rv-modal-header h2 { font-size: 25px; }

.rv-close {
  border: 0;
  background: #f0f3f4;
  color: #53636d;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.rv-form-section {
  margin-bottom: 22px;
}

.rv-form-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #102c3c;
  margin: 0 0 13px;
  font-weight: 800;
}

.rv-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
}

.rv-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 13px;
}

.rv-field label {
  font-size: 11px;
  color: #52616b;
  font-weight: 700;
}

.rv-field small,
.rv-help {
  color: #929da5;
  font-size: 10px;
}

.rv-field textarea { resize: vertical; }

.rv-help { margin: -5px 0 12px; }

.rv-room-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 9px;
}

.rv-room-option {
  border: 1px solid #e3e9eb;
  border-radius: 9px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  cursor: pointer;
  min-width: 0;
}

.rv-room-option.selected {
  border-color: #12a65a;
  background: #f0fbf4;
}

.rv-room-option input {
  accent-color: #079b4d;
  margin-top: 4px;
}

.rv-room-option div {
  flex: 1;
  min-width: 0;
}

.rv-room-option strong,
.rv-room-option span,
.rv-room-option small {
  display: block;
}

.rv-room-option strong { font-size: 11px; }
.rv-room-option span,
.rv-room-option small {
  color: #7c8991;
  font-size: 10px;
  margin-top: 4px;
}

.rv-room-option b {
  font-size: 10px;
  white-space: nowrap;
  color: #12633b;
}

.rv-capacity {
  margin-top: 12px;
  color: #167746;
  font-size: 11px;
  font-weight: 700;
}

.rv-capacity span { color: #b33c34; }

.rv-estimate {
  background: #071827;
  color: #fff;
  padding: 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.rv-estimate span,
.rv-estimate strong {
  display: block;
}

.rv-estimate span {
  color: #aebdc5;
  font-size: 10px;
  margin-bottom: 5px;
}

.rv-estimate strong { color: #00ff66; font-size: 16px; }

.rv-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  padding-top: 15px;
  border-top: 1px solid #edf0f2;
  margin-top: 15px;
}

.rv-detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rv-detail-date { color: #87939b; font-size: 10px; }

.rv-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 23px;
}

.rv-detail-card {
  background: #f7f9fa;
  border-radius: 9px;
  padding: 14px;
}

.rv-detail-card span,
.rv-detail-card strong,
.rv-detail-card small {
  display: block;
}

.rv-detail-card span { color: #89949c; font-size: 10px; margin-bottom: 8px; }
.rv-detail-card strong { font-size: 12px; color: #142e3d; }
.rv-detail-card small { font-size: 10px; color: #7d8991; margin-top: 5px; }

.rv-detail-rooms,
.rv-payments {
  border: 1px solid #e9edef;
  border-radius: 9px;
  overflow: hidden;
}

.rv-detail-rooms > div,
.rv-payments > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #edf0f2;
  gap: 10px;
}

.rv-detail-rooms > div:last-child,
.rv-payments > div:last-child { border-bottom: 0; }

.rv-detail-rooms strong,
.rv-detail-rooms small,
.rv-payments strong,
.rv-payments small {
  display: block;
}

.rv-detail-rooms strong,
.rv-payments strong { font-size: 11px; }
.rv-detail-rooms small,
.rv-payments small { color: #89949c; font-size: 10px; margin-top: 4px; }
.rv-detail-rooms b,
.rv-payments b { color: #12633b; font-size: 11px; white-space: nowrap; }

.rv-account {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.rv-account > div:not(.rv-progress-wrap) {
  background: #f7f9fa;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.rv-account span { font-size: 10px; color: #77858e; }
.rv-account strong { font-size: 12px; color: #102b3a; }
.rv-account .rv-green { color: #138148; }

.rv-progress-wrap {
  grid-column: 1 / -1;
  padding: 12px;
}

.rv-progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.rv-progress {
  height: 8px;
  background: #e5ebed;
  border-radius: 10px;
  overflow: hidden;
}

.rv-progress > div {
  height: 100%;
  background: #00b957;
  border-radius: inherit;
}

.rv-deadline {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #fff6e6;
  color: #936516;
  padding: 11px;
  border-radius: 8px;
  font-size: 11px;
  margin-top: 12px;
}

.rv-history-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.rv-history-heading h3 { margin-bottom: 13px; }

.rv-observations {
  background: #f7f9fa;
  padding: 13px;
  border-radius: 8px;
  font-size: 11px;
  margin-bottom: 15px;
}

.rv-observations p { color: #75838c; margin: 6px 0 0; }

.rv-payment-modal { max-width: 500px; }

.rv-payment-summary {
  background: #071827;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 18px;
}

.rv-payment-summary > div {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  gap: 10px;
}

.rv-payment-summary span { color: #b6c3c9; font-size: 11px; }
.rv-payment-summary strong { color: #00ff66; font-size: 12px; }

.rv-demo-note {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #eaf7ef;
  color: #176b3e;
  padding: 11px;
  border-radius: 8px;
  font-size: 11px;
  margin: 15px 0;
}

@media (max-width: 1050px) {
  .rv-stats { grid-template-columns: repeat(2, 1fr); }
  .rv-toolbar { align-items: flex-start; flex-direction: column; }
  .rv-filters { width: 100%; }
  .rv-search { flex: 1; }
  .rv-search input { width: 100%; }
}

@media (max-width: 650px) {
  .rv-header { align-items: flex-start; flex-direction: column; }
  .rv-stats { grid-template-columns: 1fr 1fr; }
  .rv-filters { flex-direction: column; }
  .rv-filters select { width: 100%; }
  .rv-form-grid,
  .rv-room-options,
  .rv-detail-grid,
  .rv-account { grid-template-columns: 1fr; }
  .rv-modal { padding: 18px; }
  .rv-estimate { flex-direction: column; }
  .rv-progress-wrap { grid-column: auto; }
}
</style>
