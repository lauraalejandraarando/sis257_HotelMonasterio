
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHotelStore } from '../stores/hotelStore'

import {
  Wallet,
  Banknote,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CalendarDays,
  Plus,
  RefreshCw,
  History,
  X,
  CheckCircle2,
  AlertCircle,
  LockKeyhole,
  UnlockKeyhole,
  Eye,
  Receipt,
  TrendingUp,
  TrendingDown
} from 'lucide-vue-next'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const turnos = ref([])
const turnoActual = ref(null)
const movimientos = ref([])
const cargando = ref(false)
const guardando = ref(false)
const mensaje = ref('')
const error = ref('')
const modal = ref('')
const turnoSeleccionado = ref(null)
const filtroHistorial = ref('todos')

const fechaLocal = () => {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

const nuevoTurno = ref({
  tipoTurno: 'mañana',
  fechaOperativa: fechaLocal(),
  montoInicial: 0,
  observaciones: ''
})

const nuevoMovimiento = ref({
  tipoMovimiento: 'ingreso',
  concepto: '',
  monto: '',
  metodoPago: 'efectivo',
  referencia: '',
  observaciones: ''
})

const datosCierre = ref({
  dineroContado: '',
  observaciones: ''
})

// Solicitudes protegidas con el token de autenticación.
async function peticion(url, opciones = {}) {
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
      ? datos?.message || 'No se pudo completar la operación'
      : datos || 'No se pudo completar la operación'

    throw new Error(
      Array.isArray(mensajeError)
        ? mensajeError.join(', ')
        : mensajeError
    )
  }

  return datos
}

const dinero = (valor) =>
  `Bs ${Number(valor || 0).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

const fechaFormato = (fecha) => {
  if (!fecha) return '—'
  const valor = String(fecha).slice(0, 10)
  const partes = valor.split('-')
  if (partes.length !== 3) return valor
  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

const fechaHora = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-BO', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

const ingresosEfectivo = computed(() =>
  movimientos.value
    .filter(m => m.tipoMovimiento === 'ingreso' && m.metodoPago === 'efectivo')
    .reduce((total, m) => total + Number(m.monto), 0)
)

const egresosEfectivo = computed(() =>
  movimientos.value
    .filter(m => m.tipoMovimiento === 'egreso' && m.metodoPago === 'efectivo')
    .reduce((total, m) => total + Number(m.monto), 0)
)

const efectivoEsperado = computed(() => {
  if (!turnoActual.value) return 0

  return Number(turnoActual.value.montoInicial || 0) +
    ingresosEfectivo.value -
    egresosEfectivo.value
})

const totalIngresos = computed(() =>
  movimientos.value
    .filter(m => m.tipoMovimiento === 'ingreso')
    .reduce((total, m) => total + Number(m.monto), 0)
)

const totalEgresos = computed(() =>
  movimientos.value
    .filter(m => m.tipoMovimiento === 'egreso')
    .reduce((total, m) => total + Number(m.monto), 0)
)

const movimientosFiltrados = computed(() => {
  if (filtroHistorial.value === 'todos') return movimientos.value

  return movimientos.value.filter(
    m => m.tipoMovimiento === filtroHistorial.value
  )
})

const turnosFiltrados = computed(() =>
  [...turnos.value].sort((a, b) => b.id - a.id)
)

async function cargarDatos() {
  cargando.value = true
  error.value = ''

  try {
    const datos = await peticion('/caja/turnos')
    turnos.value = Array.isArray(datos) ? datos : []

    turnoActual.value =
      turnos.value.find(t => t.estado === 'abierto') || null

    if (turnoActual.value) {
      await cargarMovimientos(turnoActual.value.id)
    } else {
      movimientos.value = []
    }
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function cargarMovimientos(id) {
  try {
    const datos = await peticion(`/caja/turnos/${id}/movimientos`)
    movimientos.value = Array.isArray(datos) ? datos : []
  } catch (e) {
    error.value = e.message
    movimientos.value = []
  }
}

async function abrirTurno() {
  error.value = ''
  mensaje.value = ''

  if (Number(nuevoTurno.value.montoInicial) < 0) {
    error.value = 'El monto inicial no puede ser negativo'
    return
  }

  guardando.value = true

  try {
    await peticion('/caja/turnos/abrir', {
      method: 'POST',
      body: JSON.stringify({
        tipoTurno: nuevoTurno.value.tipoTurno,
        fechaOperativa: nuevoTurno.value.fechaOperativa,
        montoInicial: Number(nuevoTurno.value.montoInicial),
        observaciones: nuevoTurno.value.observaciones
      })
    })

    modal.value = ''
    nuevoTurno.value = {
      tipoTurno: 'mañana',
      fechaOperativa: fechaLocal(),
      montoInicial: 0,
      observaciones: ''
    }

    mensaje.value = 'Turno de caja abierto correctamente'
    await cargarDatos()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function abrirModalMovimiento(tipo) {
  nuevoMovimiento.value = {
    tipoMovimiento: tipo,
    concepto: '',
    monto: '',
    metodoPago: 'efectivo',
    referencia: '',
    observaciones: ''
  }
  error.value = ''
  modal.value = 'movimiento'
}

async function registrarMovimiento() {
  error.value = ''
  mensaje.value = ''

  if (!turnoActual.value) {
    error.value = 'No existe un turno abierto'
    return
  }

  if (!nuevoMovimiento.value.concepto.trim()) {
    error.value = 'Escribe el concepto del movimiento'
    return
  }

  if (Number(nuevoMovimiento.value.monto) <= 0) {
    error.value = 'El monto debe ser mayor a cero'
    return
  }

  guardando.value = true

  try {
    await peticion('/caja/movimientos', {
      method: 'POST',
      body: JSON.stringify({
        turnoCajaId: Number(turnoActual.value.id),
        tipoMovimiento: nuevoMovimiento.value.tipoMovimiento,
        concepto: nuevoMovimiento.value.concepto.trim(),
        monto: Number(nuevoMovimiento.value.monto),
        metodoPago: nuevoMovimiento.value.metodoPago,
        referencia: nuevoMovimiento.value.referencia || undefined,
        observaciones: nuevoMovimiento.value.observaciones || undefined
      })
    })

    modal.value = ''
    mensaje.value = 'Movimiento registrado correctamente'
    await cargarDatos()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

function abrirModalCierre() {
  datosCierre.value = {
    dineroContado: '',
    observaciones: ''
  }
  error.value = ''
  modal.value = 'cierre'
}

async function cerrarTurno() {
  error.value = ''
  mensaje.value = ''

  if (!turnoActual.value) return

  if (datosCierre.value.dineroContado === '' ||
      Number(datosCierre.value.dineroContado) < 0) {
    error.value = 'Ingresa el dinero contado en caja'
    return
  }

  guardando.value = true

  try {
    await peticion(`/caja/turnos/${turnoActual.value.id}/cerrar`, {
      method: 'PATCH',
      body: JSON.stringify({
        dineroContado: Number(datosCierre.value.dineroContado),
        observaciones: datosCierre.value.observaciones || undefined
      })
    })

    modal.value = ''
    mensaje.value = 'Turno cerrado correctamente'
    await cargarDatos()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

async function verTurno(turno) {
  error.value = ''
  turnoSeleccionado.value = turno

  try {
    const datos = await peticion(`/caja/turnos/${turno.id}`)
    turnoSeleccionado.value = datos

    const lista = await peticion(`/caja/turnos/${turno.id}/movimientos`)
    movimientos.value = Array.isArray(lista) ? lista : []

    modal.value = 'detalle'
  } catch (e) {
    error.value = e.message
  }
}

function volverTurnoActual() {
  turnoSeleccionado.value = null
  if (turnoActual.value) {
    cargarMovimientos(turnoActual.value.id)
  } else {
    movimientos.value = []
  }
}

function limpiarMensajes() {
  mensaje.value = ''
  error.value = ''
}

onMounted(cargarDatos)
</script>

<template>
  <section class="caja-page">
    <header class="page-heading">
      <div class="heading-icon">
        <Wallet :size="29" />
      </div>

      <div class="heading-text">
        <span class="eyebrow">HOTEL MONASTERIO · SUCRE</span>
        <h1>Caja y movimientos</h1>
        <p>Control de turnos, ingresos, egresos y efectivo del hotel.</p>
      </div>

      <button class="refresh-btn" @click="cargarDatos" :disabled="cargando">
        <RefreshCw :size="16" :class="{ girando: cargando }" />
        Actualizar
      </button>
    </header>

    <div v-if="mensaje" class="alert success">
      <CheckCircle2 :size="18" />
      {{ mensaje }}
      <button @click="limpiarMensajes"><X :size="16" /></button>
    </div>

    <div v-if="error" class="alert danger">
      <AlertCircle :size="18" />
      {{ error }}
      <button @click="limpiarMensajes"><X :size="16" /></button>
    </div>

    <div class="status-banner" :class="turnoActual ? 'is-open' : 'is-closed'">
      <div class="status-left">
        <div class="status-symbol">
          <UnlockKeyhole v-if="turnoActual" :size="24" />
          <LockKeyhole v-else :size="24" />
        </div>
        <div>
          <span class="status-label">ESTADO DE CAJA</span>
          <h2>{{ turnoActual ? 'Turno abierto' : 'Caja cerrada' }}</h2>
          <p>
            {{ turnoActual
              ? `Turno ${turnoActual.tipoTurno} · ${fechaFormato(turnoActual.fechaOperativa)}`
              : 'No existe un turno de caja abierto actualmente.' }}
          </p>
        </div>
      </div>

      <button
        v-if="!turnoActual"
        class="primary-btn"
        @click="modal = 'apertura'; limpiarMensajes()"
      >
        <Plus :size="17" />
        Abrir turno
      </button>

      <button
        v-else
        class="close-turn-btn"
        @click="abrirModalCierre"
      >
        <LockKeyhole :size="16" />
        Cerrar turno
      </button>
    </div>

    <div class="metrics-grid">
      <article class="metric-card">
        <div class="metric-icon dark">
          <Wallet :size="21" />
        </div>
        <div>
          <span>Monto inicial</span>
          <strong>{{ dinero(turnoActual?.montoInicial) }}</strong>
          <small>Fondo de apertura</small>
        </div>
      </article>

      <article class="metric-card">
        <div class="metric-icon income">
          <TrendingUp :size="21" />
        </div>
        <div>
          <span>Total ingresos</span>
          <strong>{{ dinero(totalIngresos) }}</strong>
          <small>Todos los métodos de pago</small>
        </div>
      </article>

      <article class="metric-card">
        <div class="metric-icon expense">
          <TrendingDown :size="21" />
        </div>
        <div>
          <span>Total egresos</span>
          <strong>{{ dinero(totalEgresos) }}</strong>
          <small>Todos los métodos de pago</small>
        </div>
      </article>

      <article class="metric-card highlighted">
        <div class="metric-icon cash">
          <Banknote :size="21" />
        </div>
        <div>
          <span>Efectivo esperado</span>
          <strong>{{ dinero(turnoActual ? efectivoEsperado : 0) }}</strong>
          <small>Fondo + ingresos - egresos en efectivo</small>
        </div>
      </article>
    </div>

    <section class="main-card">
      <div class="section-heading">
        <div>
          <span class="eyebrow">OPERACIONES</span>
          <h2>Gestión del turno</h2>
          <p>Registra y consulta las operaciones de caja.</p>
        </div>
        <span v-if="turnoActual" class="open-badge">
          <span></span> En operación
        </span>
      </div>

      <div class="actions-grid">
        <button
          class="action-card"
          :disabled="!turnoActual"
          @click="abrirModalMovimiento('ingreso')"
        >
          <div class="action-icon income-bg">
            <ArrowDownCircle :size="25" />
          </div>
          <div>
            <strong>Registrar ingreso</strong>
            <span>Dinero que entra a caja</span>
          </div>
          <Plus :size="19" class="action-plus" />
        </button>

        <button
          class="action-card"
          :disabled="!turnoActual"
          @click="abrirModalMovimiento('egreso')"
        >
          <div class="action-icon expense-bg">
            <ArrowUpCircle :size="25" />
          </div>
          <div>
            <strong>Registrar egreso</strong>
            <span>Dinero que sale de caja</span>
          </div>
          <Plus :size="19" class="action-plus" />
        </button>
      </div>

      <div v-if="!turnoActual" class="empty-state">
        <LockKeyhole :size="32" />
        <h3>No hay un turno abierto</h3>
        <p>Para registrar ingresos o egresos primero debes abrir un turno de caja.</p>
      </div>
    </section>

    <section class="main-card">
      <div class="section-heading history-heading">
        <div>
          <span class="eyebrow">REGISTRO</span>
          <h2>{{ turnoSeleccionado ? `Movimientos del turno #${turnoSeleccionado.id}` : 'Movimientos del turno actual' }}</h2>
          <p>
            {{ turnoSeleccionado
              ? `${turnoSeleccionado.tipoTurno} · ${fechaFormato(turnoSeleccionado.fechaOperativa)}`
              : 'Detalle de ingresos y egresos registrados.' }}
          </p>
        </div>

        <select v-model="filtroHistorial" class="filter-select">
          <option value="todos">Todos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>
      </div>

      <div v-if="movimientosFiltrados.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Tipo</th>
              <th>Método</th>
              <th>Fecha</th>
              <th class="right">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movimiento in movimientosFiltrados" :key="movimiento.id">
              <td>
                <strong>{{ movimiento.concepto }}</strong>
                <small v-if="movimiento.referencia">{{ movimiento.referencia }}</small>
              </td>
              <td>
                <span class="movement-badge" :class="movimiento.tipoMovimiento">
                  {{ movimiento.tipoMovimiento }}
                </span>
              </td>
              <td class="capitalize">{{ movimiento.metodoPago }}</td>
              <td>{{ fechaHora(movimiento.fechaMovimiento) }}</td>
              <td class="right amount" :class="movimiento.tipoMovimiento">
                {{ movimiento.tipoMovimiento === 'ingreso' ? '+' : '-' }}{{ dinero(movimiento.monto) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state compact">
        <Receipt :size="30" />
        <h3>No hay movimientos registrados</h3>
        <p>Los ingresos y egresos aparecerán aquí cuando sean registrados.</p>
      </div>
    </section>

    <section class="main-card">
      <div class="section-heading">
        <div>
          <span class="eyebrow">HISTORIAL</span>
          <h2>Turnos de caja</h2>
          <p>Consulta las aperturas y cierres anteriores.</p>
        </div>
        <History :size="22" class="section-icon" />
      </div>

      <div v-if="turnosFiltrados.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Turno</th>
              <th>Fecha operativa</th>
              <th>Apertura</th>
              <th>Estado</th>
              <th class="right">Monto inicial</th>
              <th class="right">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turno in turnosFiltrados" :key="turno.id">
              <td><strong>#{{ turno.id }} · {{ turno.tipoTurno }}</strong></td>
              <td>{{ fechaFormato(turno.fechaOperativa) }}</td>
              <td>{{ fechaHora(turno.fechaApertura) }}</td>
              <td>
                <span class="status-badge" :class="turno.estado">
                  {{ turno.estado }}
                </span>
              </td>
              <td class="right">{{ dinero(turno.montoInicial) }}</td>
              <td class="right">
                <button class="view-btn" @click="verTurno(turno)">
                  <Eye :size="15" />
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state compact">
        <CalendarDays :size="30" />
        <h3>Aún no hay turnos registrados</h3>
        <p>Cuando abras el primer turno aparecerá aquí.</p>
      </div>
    </section>

    <!-- MODAL APERTURA -->
    <div v-if="modal === 'apertura'" class="modal-overlay" @click.self="modal = ''">
      <div class="modal-box">
        <div class="modal-heading">
          <div class="modal-icon"><UnlockKeyhole :size="22" /></div>
          <div>
            <h2>Abrir turno de caja</h2>
            <p>Registra los datos iniciales del turno.</p>
          </div>
          <button class="modal-x" @click="modal = ''"><X /></button>
        </div>

        <form @submit.prevent="abrirTurno">
          <label>Tipo de turno</label>
          <select v-model="nuevoTurno.tipoTurno" required>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>

          <label>Fecha operativa</label>
          <input v-model="nuevoTurno.fechaOperativa" type="date" required />

          <label>Monto inicial (Bs)</label>
          <input v-model.number="nuevoTurno.montoInicial" type="number" min="0" step="0.01" required />

          <label>Observaciones</label>
          <textarea v-model="nuevoTurno.observaciones" rows="3" placeholder="Observaciones opcionales"></textarea>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="modal = ''">Cancelar</button>
            <button type="submit" class="primary-btn" :disabled="guardando">
              <UnlockKeyhole :size="16" />
              {{ guardando ? 'Abriendo...' : 'Abrir turno' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL MOVIMIENTO -->
    <div v-if="modal === 'movimiento'" class="modal-overlay" @click.self="modal = ''">
      <div class="modal-box">
        <div class="modal-heading">
          <div class="modal-icon" :class="nuevoMovimiento.tipoMovimiento">
            <ArrowDownCircle v-if="nuevoMovimiento.tipoMovimiento === 'ingreso'" :size="22" />
            <ArrowUpCircle v-else :size="22" />
          </div>
          <div>
            <h2>Registrar {{ nuevoMovimiento.tipoMovimiento }}</h2>
            <p>Turno de caja #{{ turnoActual?.id }}</p>
          </div>
          <button class="modal-x" @click="modal = ''"><X /></button>
        </div>

        <form @submit.prevent="registrarMovimiento">
          <label>Concepto</label>
          <input v-model="nuevoMovimiento.concepto" maxlength="150" placeholder="Ej. Compra de materiales" required />

          <label>Monto (Bs)</label>
          <input v-model.number="nuevoMovimiento.monto" type="number" min="0.01" step="0.01" placeholder="0.00" required />

          <label>Método de pago</label>
          <select v-model="nuevoMovimiento.metodoPago" required>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <label>Referencia (opcional)</label>
          <input v-model="nuevoMovimiento.referencia" maxlength="100" placeholder="Número de comprobante" />

          <label>Observaciones (opcional)</label>
          <textarea v-model="nuevoMovimiento.observaciones" rows="3" placeholder="Detalles adicionales"></textarea>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="modal = ''">Cancelar</button>
            <button type="submit" class="primary-btn" :disabled="guardando">
              <CheckCircle2 :size="16" />
              {{ guardando ? 'Guardando...' : 'Registrar movimiento' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL CIERRE -->
    <div v-if="modal === 'cierre'" class="modal-overlay" @click.self="modal = ''">
      <div class="modal-box">
        <div class="modal-heading">
          <div class="modal-icon"><LockKeyhole :size="22" /></div>
          <div>
            <h2>Cerrar turno de caja</h2>
            <p>Revisa el efectivo antes de confirmar el cierre.</p>
          </div>
          <button class="modal-x" @click="modal = ''"><X /></button>
        </div>

        <div class="closing-summary">
          <div>
            <span>Monto inicial</span>
            <strong>{{ dinero(turnoActual?.montoInicial) }}</strong>
          </div>
          <div>
            <span>Ingresos en efectivo</span>
            <strong class="positive">{{ dinero(ingresosEfectivo) }}</strong>
          </div>
          <div>
            <span>Egresos en efectivo</span>
            <strong class="negative">{{ dinero(egresosEfectivo) }}</strong>
          </div>
          <div class="expected">
            <span>Efectivo esperado</span>
            <strong>{{ dinero(efectivoEsperado) }}</strong>
          </div>
        </div>

        <form @submit.prevent="cerrarTurno">
          <label>Dinero contado físicamente (Bs)</label>
          <input v-model.number="datosCierre.dineroContado" type="number" min="0" step="0.01" placeholder="Ingresa el efectivo contado" required />

          <label>Observaciones (opcional)</label>
          <textarea v-model="datosCierre.observaciones" rows="3" placeholder="Explica alguna diferencia, si corresponde"></textarea>

          <div class="warning-note">
            <AlertCircle :size="17" />
            Al cerrar el turno ya no podrás registrar nuevos movimientos en él.
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="modal = ''">Cancelar</button>
            <button type="submit" class="close-turn-btn" :disabled="guardando">
              <LockKeyhole :size="16" />
              {{ guardando ? 'Cerrando...' : 'Confirmar cierre' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DETALLE TURNO -->
    <div v-if="modal === 'detalle'" class="modal-overlay" @click.self="modal = ''">
      <div class="modal-box detail-modal">
        <div class="modal-heading">
          <div class="modal-icon"><History :size="22" /></div>
          <div>
            <h2>Detalle del turno #{{ turnoSeleccionado?.id }}</h2>
            <p>{{ turnoSeleccionado?.tipoTurno }} · {{ fechaFormato(turnoSeleccionado?.fechaOperativa) }}</p>
          </div>
          <button class="modal-x" @click="modal = ''"><X /></button>
        </div>

        <div class="closing-summary">
          <div>
            <span>Estado</span>
            <strong>{{ turnoSeleccionado?.estado }}</strong>
          </div>
          <div>
            <span>Monto inicial</span>
            <strong>{{ dinero(turnoSeleccionado?.montoInicial) }}</strong>
          </div>
          <div>
            <span>Efectivo esperado</span>
            <strong>{{ turnoSeleccionado?.efectivoEsperado != null ? dinero(turnoSeleccionado.efectivoEsperado) : '—' }}</strong>
          </div>
          <div>
            <span>Dinero contado</span>
            <strong>{{ turnoSeleccionado?.dineroContado != null ? dinero(turnoSeleccionado.dineroContado) : '—' }}</strong>
          </div>
          <div class="expected">
            <span>Diferencia</span>
            <strong>{{ turnoSeleccionado?.diferencia != null ? dinero(turnoSeleccionado.diferencia) : '—' }}</strong>
          </div>
          <div>
            <span>Apertura</span>
            <strong>{{ fechaHora(turnoSeleccionado?.fechaApertura) }}</strong>
          </div>
          <div>
            <span>Cierre</span>
            <strong>{{ fechaHora(turnoSeleccionado?.fechaCierre) }}</strong>
          </div>
        </div>

        <div class="detail-observation" v-if="turnoSeleccionado?.observaciones">
          <strong>Observaciones:</strong>
          <p>{{ turnoSeleccionado.observaciones }}</p>
        </div>

        <h3 class="detail-subtitle">Movimientos del turno</h3>
        <div v-if="movimientos.length" class="detail-movements">
          <div v-for="m in movimientos" :key="m.id" class="detail-movement-row">
            <div>
              <strong>{{ m.concepto }}</strong>
              <small>{{ m.tipoMovimiento }} · {{ m.metodoPago }} · {{ fechaHora(m.fechaMovimiento) }}</small>
            </div>
            <strong :class="m.tipoMovimiento">
              {{ m.tipoMovimiento === 'ingreso' ? '+' : '-' }}{{ dinero(m.monto) }}
            </strong>
          </div>
        </div>
        <div v-else class="empty-state compact">
          <Receipt :size="25" />
          <p>Este turno no tiene movimientos registrados.</p>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="modal = ''">Cerrar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.caja-page {
  color: #071827;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding-bottom: 30px;
}

.page-heading {
  display: flex;
  align-items: center;
  gap: 17px;
}

.heading-icon,
.modal-icon {
  width: 58px;
  height: 58px;
  border-radius: 15px;
  background: #071827;
  color: #00FF66;
  border: 1px solid rgba(0,255,102,.25);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.heading-text {
  flex: 1;
}

.eyebrow {
  font-size: 10px;
  letter-spacing: 2px;
  font-weight: 800;
  color: #B08D57;
}

h1, h2, h3, p {
  margin-top: 0;
}

h1, .section-heading h2, .modal-heading h2 {
  font-family: 'Playfair Display', serif;
}

h1 {
  font-size: 27px;
  margin: 4px 0;
  color: #071827;
}

.heading-text p, .section-heading p {
  margin: 0;
  color: #718078;
  font-size: 13px;
}

.refresh-btn, .view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid rgba(7,24,39,.15);
  background: white;
  color: #071827;
  border-radius: 9px;
  padding: 10px 13px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.refresh-btn:disabled {
  opacity: .6;
  cursor: wait;
}

.girando {
  animation: girar 1s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.alert {
  border-radius: 10px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
}

.alert button {
  margin-left: auto;
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  color: inherit;
}

.success {
  background: #e9f8ef;
  color: #17683b;
}

.danger {
  background: #fff0ed;
  color: #a73727;
}

.status-banner {
  border-radius: 15px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: #071827;
  color: #F5F0E6;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-symbol {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: rgba(0,255,102,.1);
  color: #00FF66;
  display: grid;
  place-items: center;
}

.status-label {
  color: #B08D57;
  letter-spacing: 1.5px;
  font-size: 9px;
  font-weight: 800;
}

.status-banner h2 {
  font-family: 'Playfair Display', serif;
  margin: 4px 0;
  font-size: 21px;
}

.status-banner p {
  margin: 0;
  color: #c3d0ca;
  font-size: 12px;
}

.primary-btn, .close-turn-btn {
  border: 0;
  border-radius: 9px;
  padding: 11px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.primary-btn {
  background: #00FF66;
  color: #071827;
}

.close-turn-btn {
  background: #B08D57;
  color: white;
}

.primary-btn:disabled, .close-turn-btn:disabled {
  opacity: .55;
  cursor: wait;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid rgba(7,24,39,.09);
  border-radius: 13px;
  padding: 17px 14px;
  min-width: 0;
}

.metric-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.metric-icon.dark {
  background: #071827;
  color: #00FF66;
}

.metric-icon.income, .income-bg {
  background: #e9f8ef;
  color: #16834a;
}

.metric-icon.expense, .expense-bg {
  background: #fff0ed;
  color: #bd4b3b;
}

.metric-icon.cash {
  background: #f7f0e4;
  color: #9a7134;
}

.metric-card span {
  display: block;
  color: #718078;
  font-size: 11px;
  margin-bottom: 5px;
}

.metric-card strong {
  display: block;
  font-size: 17px;
  color: #071827;
  overflow-wrap: anywhere;
}

.metric-card small {
  display: block;
  color: #99a29d;
  font-size: 9px;
  margin-top: 4px;
}

.highlighted {
  border-color: rgba(176,141,87,.4);
  background: #fffdf9;
}

.main-card {
  background: white;
  border: 1px solid rgba(7,24,39,.1);
  border-radius: 15px;
  padding: 22px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.section-heading h2 {
  font-size: 20px;
  margin: 4px 0;
}

.open-badge, .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 800;
  text-transform: capitalize;
}

.open-badge {
  background: #e9f8ef;
  color: #17683b;
}

.open-badge span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00a64f;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.action-card {
  border: 1px solid rgba(7,24,39,.1);
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-align: left;
  cursor: pointer;
  color: #071827;
}

.action-card:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.action-card strong, .action-card span {
  display: block;
}

.action-card strong {
  font-size: 13px;
  margin-bottom: 4px;
}

.action-card span {
  font-size: 11px;
  color: #718078;
}

.action-plus {
  margin-left: auto;
  color: #B08D57;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 15px;
  color: #8a9890;
}

.empty-state h3 {
  color: #071827;
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  margin: 12px 0 6px;
}

.empty-state p {
  color: #718078;
  font-size: 12px;
  max-width: 400px;
  line-height: 1.6;
  margin-bottom: 0;
}

.compact {
  padding: 25px 12px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
}

th {
  text-align: left;
  color: #89968e;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .7px;
  padding: 12px 10px;
  border-bottom: 1px solid #e9eeea;
  white-space: nowrap;
}

td {
  padding: 13px 10px;
  border-bottom: 1px solid #f0f2ef;
  font-size: 12px;
  color: #526159;
}

td strong {
  color: #071827;
  font-size: 12px;
}

td small {
  display: block;
  color: #99a29d;
  font-size: 10px;
  margin-top: 3px;
}

.right {
  text-align: right;
}

.capitalize {
  text-transform: capitalize;
}

.amount {
  font-weight: 800;
  white-space: nowrap;
}

.amount.ingreso, .detail-movement-row .ingreso {
  color: #16834a;
}

.amount.egreso, .detail-movement-row .egreso {
  color: #bd4b3b;
}

.movement-badge {
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  text-transform: capitalize;
}

.movement-badge.ingreso {
  background: #e9f8ef;
  color: #16834a;
}

.movement-badge.egreso {
  background: #fff0ed;
  color: #bd4b3b;
}

.status-badge.abierto {
  background: #e9f8ef;
  color: #17683b;
}

.status-badge.cerrado {
  background: #eef0f1;
  color: #526159;
}

.view-btn {
  padding: 7px 10px;
  font-size: 11px;
}

.section-icon {
  color: #B08D57;
}

.filter-select {
  border: 1px solid #dce3dd;
  border-radius: 8px;
  padding: 9px 12px;
  background: white;
  color: #071827;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4,14,23,.65);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  overflow-y: auto;
}

.modal-box {
  background: #fff;
  border-radius: 17px;
  width: 100%;
  max-width: 490px;
  padding: 24px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 20px 70px rgba(0,0,0,.2);
}

.detail-modal {
  max-width: 620px;
}

.modal-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.modal-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
}

.modal-icon.ingreso {
  background: #e9f8ef;
  color: #16834a;
}

.modal-icon.egreso {
  background: #fff0ed;
  color: #bd4b3b;
}

.modal-heading h2 {
  font-size: 20px;
  margin: 0 0 4px;
}

.modal-heading p {
  font-size: 11px;
  color: #718078;
  margin: 0;
}

.modal-x {
  margin-left: auto;
  background: transparent;
  border: 0;
  color: #718078;
  cursor: pointer;
}

.modal-box form {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.modal-box label {
  font-size: 11px;
  font-weight: 800;
  color: #526159;
  margin-top: 5px;
}

.modal-box input, .modal-box select, .modal-box textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #dce3dd;
  background: #fff;
  color: #071827;
  border-radius: 8px;
  padding: 11px 12px;
  font: inherit;
  font-size: 12px;
  outline: none;
}

.modal-box input:focus, .modal-box select:focus, .modal-box textarea:focus {
  border-color: #00b956;
  box-shadow: 0 0 0 3px rgba(0,255,102,.1);
}

.modal-box textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 17px;
}

.cancel-btn {
  border: 1px solid #dce3dd;
  background: white;
  color: #526159;
  border-radius: 9px;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.closing-summary {
  background: #f6f8f5;
  border-radius: 11px;
  padding: 14px;
  margin-bottom: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.closing-summary div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.closing-summary span {
  color: #718078;
  font-size: 10px;
}

.closing-summary strong {
  color: #071827;
  font-size: 14px;
}

.closing-summary .positive {
  color: #16834a;
}

.closing-summary .negative {
  color: #bd4b3b;
}

.closing-summary .expected {
  border-top: 1px solid #dce3dd;
  padding-top: 10px;
  grid-column: 1 / -1;
}

.closing-summary .expected strong {
  font-size: 19px;
}

.warning-note {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  background: #fff7e9;
  color: #8b682c;
  padding: 11px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.5;
  margin-top: 8px;
}

.detail-observation {
  background: #f6f8f5;
  padding: 12px;
  border-radius: 9px;
  font-size: 12px;
  margin-bottom: 18px;
}

.detail-observation p {
  color: #718078;
  margin: 5px 0 0;
}

.detail-subtitle {
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  margin-bottom: 10px;
}

.detail-movements {
  display: flex;
  flex-direction: column;
}

.detail-movement-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #edf0ed;
}

.detail-movement-row strong {
  font-size: 12px;
}

.detail-movement-row small {
  display: block;
  color: #89968e;
  font-size: 10px;
  margin-top: 4px;
}

@media (max-width: 1050px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 650px) {
  .page-heading {
    flex-wrap: wrap;
  }

  .heading-text {
    min-width: 60%;
  }

  .refresh-btn {
    margin-left: auto;
  }

  .status-banner {
    align-items: flex-start;
    flex-direction: column;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .main-card {
    padding: 16px;
  }

  .section-heading {
    align-items: flex-start;
  }

  .modal-box {
    padding: 18px;
  }
}

@media (max-width: 420px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .closing-summary {
    grid-template-columns: 1fr;
  }

  .closing-summary .expected {
    grid-column: auto;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
