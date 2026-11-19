
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import {
  FileBarChart,
  BedDouble,
  CalendarDays,
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Wallet,
  RefreshCw,
  Search,
  Download,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Percent,
  ClipboardList
} from 'lucide-vue-next'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const resumen = ref({})
const reservas = ref([])
const ingresos = ref({})
const ocupacion = ref({})
const reservasEstado = ref({})

const desde = ref('')
const hasta = ref('')
const busqueda = ref('')
const filtroEstado = ref('todos')
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')
const seccionActiva = ref('resumen')

const dinero = valor =>
  `Bs ${Number(valor || 0).toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`

const fecha = valor => {
  if (!valor) return '—'
  const parte = String(valor).slice(0, 10)
  const [anio, mes, dia] = parte.split('-')
  return `${dia}/${mes}/${anio}`
}

const consultar = async (url) => {
  const respuesta = await fetch(`${API}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hotelStore.token}`
    }
  })

  if (!respuesta.ok) {
    throw new Error(`Error al consultar ${url}: ${respuesta.status}`)
  }

  return respuesta.json()
}

const cargarReportes = async () => {
  cargando.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const [datosResumen, datosReservas, datosOcupacion, datosEstados] =
      await Promise.all([
        consultar('/reportes/resumen'),
        consultar('/reportes/reservas'),
        consultar('/reportes/ocupacion'),
        consultar('/reportes/reservas/estado')
      ])

    resumen.value = datosResumen
    reservas.value = Array.isArray(datosReservas) ? datosReservas : []
    ocupacion.value = datosOcupacion
    reservasEstado.value = datosEstados

    await cargarIngresos()
    mensaje.value = 'Reportes actualizados correctamente.'
  } catch (e) {
    error.value = e.message || 'No fue posible cargar los reportes.'
  } finally {
    cargando.value = false
  }
}

const cargarIngresos = async () => {
  try {
    const parametros = new URLSearchParams()
    if (desde.value) parametros.append('desde', desde.value)
    if (hasta.value) parametros.append('hasta', hasta.value)

    const sufijo = parametros.toString()
      ? `?${parametros.toString()}`
      : ''

    ingresos.value = await consultar(`/reportes/ingresos${sufijo}`)
  } catch (e) {
    error.value = e.message || 'No fue posible cargar los ingresos.'
  }
}

const aplicarFechas = async () => {
  if (desde.value && hasta.value && desde.value > hasta.value) {
    error.value = 'La fecha inicial no puede ser posterior a la fecha final.'
    return
  }

  error.value = ''
  await cargarIngresos()
}

const limpiarFechas = async () => {
  desde.value = ''
  hasta.value = ''
  await cargarIngresos()
}

const reservasFiltradas = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()

  return reservas.value.filter(reserva => {
    const huesped = reserva.huesped
    const nombre = `${huesped?.nombres || ''} ${huesped?.apellidos || ''}`.toLowerCase()
    const codigo = String(reserva.codigoReserva || '').toLowerCase()
    const estado = String(reserva.estado || '').toLowerCase()

    const coincideTexto =
      !texto || codigo.includes(texto) || nombre.includes(texto)

    const coincideEstado =
      filtroEstado.value === 'todos' || estado === filtroEstado.value

    return coincideTexto && coincideEstado
  })
})

const estadosLista = computed(() =>
  Object.entries(reservasEstado.value.reservasPorEstado || {})
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: reservasEstado.value.totalReservas
        ? (cantidad / reservasEstado.value.totalReservas) * 100
        : 0
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
)

const metodosLista = computed(() =>
  Object.entries(ingresos.value.ingresosPorMetodo || {})
    .map(([nombre, monto]) => ({ nombre, monto: Number(monto) }))
    .sort((a, b) => b.monto - a.monto)
)

const tiposLista = computed(() =>
  Object.entries(ingresos.value.ingresosPorTipo || {})
    .map(([nombre, monto]) => ({ nombre, monto: Number(monto) }))
    .sort((a, b) => b.monto - a.monto)
)

const porcentajeDisponible = computed(() => {
  const total = Number(ocupacion.value.totalHabitaciones || 0)
  const disponibles = Number(ocupacion.value.habitacionesDisponibles || 0)
  return total ? (disponibles / total) * 100 : 0
})

const porcentajeOcupadas = computed(() =>
  Number(ocupacion.value.porcentajeOcupacion || 0)
)

const claseEstado = estado => {
  const valor = String(estado || '').toLowerCase()
  if (valor === 'confirmada') return 'confirmada'
  if (valor === 'pendiente') return 'pendiente'
  if (valor === 'cancelada') return 'cancelada'
  if (valor === 'en curso') return 'curso'
  if (valor === 'finalizada') return 'finalizada'
  return 'neutral'
}

const nombreEstado = estado => {
  if (!estado) return 'Sin estado'
  return estado.charAt(0).toUpperCase() + estado.slice(1)
}

const nombreMetodo = metodo => {
  const nombres = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta'
  }
  return nombres[metodo] || metodo || 'No especificado'
}

const nombreTipo = tipo => {
  const nombres = {
    adelanto: 'Adelanto',
    saldo: 'Saldo',
    reembolso: 'Reembolso',
    penalizacion: 'Penalización'
  }
  return nombres[tipo] || tipo || 'No especificado'
}

const nombreHuesped = huesped => {
  if (!huesped) return 'Sin huésped'
  return `${huesped.nombres || ''} ${huesped.apellidos || ''}`.trim()
}

const exportarReservas = () => {
  const encabezados = [
    'Código',
    'Huésped',
    'Fecha de entrada',
    'Fecha de salida',
    'Cantidad de huéspedes',
    'Estado'
  ]

  const filas = reservasFiltradas.value.map(r => [
    r.codigoReserva,
    nombreHuesped(r.huesped),
    fecha(r.fechaEntrada),
    fecha(r.fechaSalida),
    r.cantidadHuespedes,
    r.estado
  ])

  const csv = [encabezados, ...filas]
    .map(fila => fila.map(valor =>
      `"${String(valor ?? '').replace(/"/g, '""')}"`
    ).join(';'))
    .join('\n')

  const archivo = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(archivo)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = 'reporte-reservas-hotel-monasterio.csv'
  enlace.click()
  URL.revokeObjectURL(url)
}

onMounted(cargarReportes)
</script>

<template>
  <section class="reports-page">
    <header class="page-heading">
      <div>
        <span class="eyebrow">HOTEL MONASTERIO · ADMINISTRACIÓN</span>
        <h1>Reportes</h1>
        <p>Información general y análisis de la actividad del hotel.</p>
      </div>

      <button class="refresh-button" @click="cargarReportes" :disabled="cargando">
        <RefreshCw :size="17" :class="{ rotating: cargando }" />
        Actualizar
      </button>
    </header>

    <div v-if="error" class="notice error-notice">
      {{ error }}
    </div>

    <div v-if="mensaje && !error" class="notice success-notice">
      {{ mensaje }}
    </div>

    <nav class="report-tabs">
      <button
        v-for="tab in [
          { id: 'resumen', nombre: 'Resumen', icono: FileBarChart },
          { id: 'reservas', nombre: 'Reservas', icono: CalendarDays },
          { id: 'ingresos', nombre: 'Ingresos', icono: Wallet },
          { id: 'ocupacion', nombre: 'Ocupación', icono: BedDouble }
        ]"
        :key="tab.id"
        :class="{ active: seccionActiva === tab.id }"
        @click="seccionActiva = tab.id"
      >
        <component :is="tab.icono" :size="17" />
        {{ tab.nombre }}
      </button>
    </nav>

    <div v-if="cargando && !Object.keys(resumen).length" class="loading-state">
      <RefreshCw :size="25" class="rotating" />
      <span>Cargando información...</span>
    </div>

    <template v-else>
      <!-- RESUMEN -->
      <div v-if="seccionActiva === 'resumen'" class="report-content">
        <div class="section-heading">
          <div>
            <h2>Resumen general</h2>
            <p>Indicadores principales del establecimiento.</p>
          </div>
          <span class="update-label">Datos del sistema</span>
        </div>

        <div class="kpi-grid">
          <article class="kpi-card">
            <div class="kpi-icon blue"><CalendarDays :size="21" /></div>
            <span>Total de reservas</span>
            <strong>{{ resumen.totalReservas ?? 0 }}</strong>
            <small>Reservas registradas</small>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon gold"><BedDouble :size="21" /></div>
            <span>Habitaciones</span>
            <strong>{{ resumen.totalHabitaciones ?? 0 }}</strong>
            <small>{{ resumen.habitacionesDisponibles ?? 0 }} disponibles</small>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon green"><Users :size="21" /></div>
            <span>Huéspedes</span>
            <strong>{{ resumen.totalHuespedes ?? 0 }}</strong>
            <small>Registrados en el sistema</small>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon violet"><CreditCard :size="21" /></div>
            <span>Total de pagos</span>
            <strong>{{ resumen.totalPagos ?? 0 }}</strong>
            <small>Registros de pagos</small>
          </article>
        </div>

        <div class="two-columns">
          <article class="panel">
            <div class="panel-heading">
              <div>
                <h3>Estado de las reservas</h3>
                <p>Distribución según su situación actual.</p>
              </div>
              <ClipboardList :size="21" />
            </div>

            <div v-if="estadosLista.length" class="status-list">
              <div v-for="estado in estadosLista" :key="estado.nombre" class="status-item">
                <div class="status-label">
                  <span>{{ nombreEstado(estado.nombre) }}</span>
                  <strong>{{ estado.cantidad }}</strong>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-fill"
                    :class="claseEstado(estado.nombre)"
                    :style="{ width: `${estado.porcentaje}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">No hay reservas registradas.</div>

            <div class="panel-total">
              <span>Total de reservas</span>
              <strong>{{ reservasEstado.totalReservas ?? 0 }}</strong>
            </div>
          </article>

          <article class="panel">
            <div class="panel-heading">
              <div>
                <h3>Ocupación de habitaciones</h3>
                <p>Situación actual de las habitaciones.</p>
              </div>
              <BedDouble :size="21" />
            </div>

            <div class="occupancy-visual">
              <div
                class="occupancy-ring"
                :style="{
                  background: `conic-gradient(#00cc66 0% ${Math.min(porcentajeOcupadas, 100)}%, #dce6e4 ${Math.min(porcentajeOcupadas, 100)}% 100%)`
                }"
              >
                <div class="ring-center">
                  <strong>{{ porcentajeOcupadas }}%</strong>
                  <span>Ocupación</span>
                </div>
              </div>
            </div>

            <div class="occupancy-legend">
              <div>
                <span class="legend-dot occupied-dot"></span>
                <span>Ocupadas</span>
                <strong>{{ ocupacion.habitacionesOcupadas ?? 0 }}</strong>
              </div>
              <div>
                <span class="legend-dot available-dot"></span>
                <span>Disponibles</span>
                <strong>{{ ocupacion.habitacionesDisponibles ?? 0 }}</strong>
              </div>
              <div>
                <span class="legend-dot other-dot"></span>
                <span>Otros estados</span>
                <strong>{{ ocupacion.otrasHabitaciones ?? 0 }}</strong>
              </div>
            </div>
          </article>
        </div>

        <article class="panel revenue-panel">
          <div class="panel-heading">
            <div>
              <h3>Ingresos registrados</h3>
              <p>Suma de los pagos registrados en el sistema.</p>
            </div>
            <div class="revenue-icon"><CircleDollarSign :size="25" /></div>
          </div>

          <div class="revenue-total">
            {{ dinero(resumen.ingresosTotales) }}
          </div>
          <span class="revenue-caption">Ingresos totales según los registros de pagos</span>
        </article>
      </div>

      <!-- RESERVAS -->
      <div v-if="seccionActiva === 'reservas'" class="report-content">
        <div class="section-heading">
          <div>
            <h2>Reporte de reservas</h2>
            <p>Consulta las reservas registradas en el hotel.</p>
          </div>
          <button class="export-button" @click="exportarReservas">
            <Download :size="17" />
            Exportar CSV
          </button>
        </div>

        <div class="filter-panel">
          <div class="search-box">
            <Search :size="18" />
            <input v-model="busqueda" placeholder="Buscar por código o huésped..." />
          </div>

          <select v-model="filtroEstado">
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="en curso">En curso</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>

        <article class="panel table-panel">
          <div class="table-heading">
            <h3>Listado de reservas</h3>
            <span>{{ reservasFiltradas.length }} resultados</span>
          </div>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Huésped</th>
                  <th>Entrada</th>
                  <th>Salida</th>
                  <th>Personas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reserva in reservasFiltradas" :key="reserva.id">
                  <td class="code-cell">{{ reserva.codigoReserva || `#${reserva.id}` }}</td>
                  <td>{{ nombreHuesped(reserva.huesped) }}</td>
                  <td>{{ fecha(reserva.fechaEntrada) }}</td>
                  <td>{{ fecha(reserva.fechaSalida) }}</td>
                  <td>{{ reserva.cantidadHuespedes ?? 0 }}</td>
                  <td>
                    <span class="status-badge" :class="claseEstado(reserva.estado)">
                      {{ nombreEstado(reserva.estado) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!reservasFiltradas.length">
                  <td colspan="6" class="empty-cell">No se encontraron reservas.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <!-- INGRESOS -->
      <div v-if="seccionActiva === 'ingresos'" class="report-content">
        <div class="section-heading">
          <div>
            <h2>Reporte de ingresos</h2>
            <p>Consulta los pagos registrados por periodo.</p>
          </div>
        </div>

        <div class="filter-panel date-filter">
          <div class="date-field">
            <label>Desde</label>
            <input type="date" v-model="desde" :max="hasta || undefined" />
          </div>
          <div class="date-field">
            <label>Hasta</label>
            <input type="date" v-model="hasta" :min="desde || undefined" />
          </div>
          <button class="apply-button" @click="aplicarFechas">
            Aplicar filtros
          </button>
          <button class="clear-button" @click="limpiarFechas">
            Limpiar
          </button>
        </div>

        <div class="income-summary">
          <article class="income-card">
            <div class="kpi-icon green"><TrendingUp :size="21" /></div>
            <span>Total de ingresos</span>
            <strong>{{ dinero(ingresos.totalIngresos) }}</strong>
          </article>
          <article class="income-card">
            <div class="kpi-icon blue"><CreditCard :size="21" /></div>
            <span>Cantidad de pagos</span>
            <strong>{{ ingresos.cantidadPagos ?? 0 }}</strong>
          </article>
        </div>

        <div class="two-columns">
          <article class="panel">
            <div class="panel-heading">
              <div>
                <h3>Ingresos por método</h3>
                <p>Distribución según forma de pago.</p>
              </div>
              <Wallet :size="21" />
            </div>

            <div v-if="metodosLista.length" class="status-list">
              <div v-for="item in metodosLista" :key="item.nombre" class="status-item">
                <div class="status-label">
                  <span>{{ nombreMetodo(item.nombre) }}</span>
                  <strong>{{ dinero(item.monto) }}</strong>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-fill income-fill"
                    :style="{ width: `${ingresos.totalIngresos ? item.monto / ingresos.totalIngresos * 100 : 0}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">No hay pagos en este periodo.</div>
          </article>

          <article class="panel">
            <div class="panel-heading">
              <div>
                <h3>Ingresos por tipo</h3>
                <p>Clasificación de los pagos.</p>
              </div>
              <ChartNoAxesColumnIncreasing :size="21" />
            </div>

            <div v-if="tiposLista.length" class="status-list">
              <div v-for="item in tiposLista" :key="item.nombre" class="status-item">
                <div class="status-label">
                  <span>{{ nombreTipo(item.nombre) }}</span>
                  <strong>{{ dinero(item.monto) }}</strong>
                </div>
                <div class="progress-track">
                  <div
                    class="progress-fill type-fill"
                    :style="{ width: `${ingresos.totalIngresos ? item.monto / ingresos.totalIngresos * 100 : 0}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">No hay pagos en este periodo.</div>
          </article>
        </div>

        <article class="panel table-panel">
          <div class="table-heading">
            <h3>Detalle de pagos</h3>
            <span>{{ ingresos.pagos?.length || 0 }} registros</span>
          </div>

          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Reserva</th>
                  <th>Método</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pago in ingresos.pagos || []" :key="pago.id">
                  <td>{{ fecha(pago.fechaPago) }}</td>
                  <td class="code-cell">{{ pago.reserva?.codigoReserva || `#${pago.reserva?.id || pago.reservaId || '—'}` }}</td>
                  <td>{{ nombreMetodo(pago.metodoPago) }}</td>
                  <td>{{ nombreTipo(pago.tipoPago) }}</td>
                  <td class="amount-cell">{{ dinero(pago.monto) }}</td>
                </tr>
                <tr v-if="!ingresos.pagos?.length">
                  <td colspan="5" class="empty-cell">No hay pagos registrados en este periodo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <!-- OCUPACION -->
      <div v-if="seccionActiva === 'ocupacion'" class="report-content">
        <div class="section-heading">
          <div>
            <h2>Ocupación de habitaciones</h2>
            <p>Estado actual de la disponibilidad del hotel.</p>
          </div>
        </div>

        <div class="kpi-grid occupancy-kpis">
          <article class="kpi-card">
            <div class="kpi-icon blue"><BedDouble :size="21" /></div>
            <span>Total de habitaciones</span>
            <strong>{{ ocupacion.totalHabitaciones ?? 0 }}</strong>
            <small>Habitaciones registradas</small>
          </article>
          <article class="kpi-card">
            <div class="kpi-icon green"><CheckCircle2 :size="21" /></div>
            <span>Disponibles</span>
            <strong>{{ ocupacion.habitacionesDisponibles ?? 0 }}</strong>
            <small>Listas para alojar huéspedes</small>
          </article>
          <article class="kpi-card">
            <div class="kpi-icon gold"><Users :size="21" /></div>
            <span>Ocupadas</span>
            <strong>{{ ocupacion.habitacionesOcupadas ?? 0 }}</strong>
            <small>Actualmente ocupadas</small>
          </article>
          <article class="kpi-card">
            <div class="kpi-icon violet"><Percent :size="21" /></div>
            <span>Porcentaje de ocupación</span>
            <strong>{{ porcentajeOcupadas }}%</strong>
            <small>Sobre el total de habitaciones</small>
          </article>
        </div>

        <article class="panel occupancy-detail">
          <div class="panel-heading">
            <div>
              <h3>Distribución de habitaciones</h3>
              <p>Porcentaje de ocupación y disponibilidad.</p>
            </div>
            <ChartNoAxesColumnIncreasing :size="21" />
          </div>

          <div class="big-progress">
            <div class="big-progress-label">
              <span>Habitaciones ocupadas</span>
              <strong>{{ porcentajeOcupadas }}%</strong>
            </div>
            <div class="progress-track large-track">
              <div class="progress-fill occupied-fill" :style="{ width: `${Math.min(porcentajeOcupadas, 100)}%` }"></div>
            </div>
          </div>

          <div class="big-progress">
            <div class="big-progress-label">
              <span>Habitaciones disponibles</span>
              <strong>{{ porcentajeDisponible.toFixed(2) }}%</strong>
            </div>
            <div class="progress-track large-track">
              <div class="progress-fill available-fill" :style="{ width: `${Math.min(porcentajeDisponible, 100)}%` }"></div>
            </div>
          </div>

          <div class="other-count">
            Otras habitaciones: <strong>{{ ocupacion.otrasHabitaciones ?? 0 }}</strong>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<style scoped>
.reports-page {
  color: #071827;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding-bottom: 35px;
}

.page-heading,
.section-heading,
.panel-heading,
.table-heading,
.status-label,
.big-progress-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.eyebrow {
  color: #a17c43;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.page-heading h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 31px;
  margin: 7px 0;
}

.page-heading p,
.section-heading p,
.panel-heading p {
  color: #82908e;
  font-size: 13px;
  margin: 0;
}

.refresh-button,
.export-button,
.apply-button,
.clear-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 9px;
  padding: 11px 15px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.refresh-button,
.export-button {
  color: #00cc66;
  background: #071827;
  border: 1px solid #071827;
}

.refresh-button:hover,
.export-button:hover {
  background: #102d3d;
}

.refresh-button:disabled {
  opacity: .6;
  cursor: wait;
}

.report-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e6ece9;
  padding-bottom: 12px;
}

.report-tabs button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #71817f;
  border: 1px solid transparent;
  border-radius: 9px;
  padding: 11px 15px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.report-tabs button.active {
  background: #071827;
  color: #00e66b;
  border-color: #071827;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-heading {
  margin-bottom: 2px;
}

.section-heading h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  margin: 0 0 5px;
}

.update-label {
  background: #edf6f0;
  color: #287b50;
  padding: 7px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.kpi-card,
.panel,
.income-card {
  background: #fff;
  border: 1px solid #e8eeeb;
  border-radius: 13px;
  box-shadow: 0 3px 14px rgba(7, 24, 39, .035);
}

.kpi-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  gap: 7px;
}

.kpi-icon {
  width: 39px;
  height: 39px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 5px;
}

.kpi-icon.blue {
  background: #eaf0f7;
  color: #315b85;
}

.kpi-icon.gold {
  background: #f7f0e4;
  color: #a17c43;
}

.kpi-icon.green {
  background: #e8f8ef;
  color: #169a58;
}

.kpi-icon.violet {
  background: #f0edfa;
  color: #7560a9;
}

.kpi-card > span,
.income-card > span {
  color: #82908e;
  font-size: 11px;
}

.kpi-card > strong,
.income-card > strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 27px;
  color: #071827;
}

.kpi-card small {
  color: #a0aaa7;
  font-size: 10px;
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.panel {
  padding: 21px;
  min-width: 0;
}

.panel-heading {
  margin-bottom: 22px;
  color: #a17c43;
}

.panel-heading h3,
.table-heading h3 {
  color: #071827;
  font-size: 14px;
  margin: 0 0 5px;
}

.panel-heading p {
  font-size: 11px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.status-label {
  font-size: 11px;
  margin-bottom: 8px;
}

.status-label span {
  color: #6f7d7a;
}

.status-label strong {
  color: #071827;
  font-size: 11px;
}

.progress-track {
  height: 7px;
  background: #edf1ef;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
  transition: width .4s ease;
}

.progress-fill.confirmada {
  background: #16a365;
}

.progress-fill.pendiente {
  background: #d6a54e;
}

.progress-fill.cancelada {
  background: #d56d6d;
}

.progress-fill.curso {
  background: #4c8cb5;
}

.progress-fill.finalizada {
  background: #82908e;
}

.progress-fill.neutral {
  background: #a5b0ad;
}

.panel-total {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #edf1ef;
  margin-top: 22px;
  padding-top: 15px;
  font-size: 11px;
  color: #82908e;
}

.panel-total strong {
  color: #071827;
}

.occupancy-visual {
  display: flex;
  justify-content: center;
  padding: 5px 0 22px;
}

.occupancy-ring {
  width: 165px;
  height: 165px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.ring-center {
  background: white;
  width: 125px;
  height: 125px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.ring-center strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 27px;
}

.ring-center span {
  font-size: 10px;
  color: #82908e;
}

.occupancy-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.occupancy-legend > div {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  color: #71817f;
}

.occupancy-legend strong {
  color: #071827;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.occupied-dot {
  background: #00cc66;
}

.available-dot {
  background: #dce6e4;
}

.other-dot {
  background: #b08d57;
}

.revenue-panel {
  background: #071827;
  color: white;
  border: none;
}

.revenue-panel .panel-heading h3 {
  color: #fff;
}

.revenue-panel .panel-heading p {
  color: #a9b9b6;
}

.revenue-icon {
  color: #00e66b;
}

.revenue-total {
  color: #00e66b;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 5px;
}

.revenue-caption {
  color: #a9b9b6;
  font-size: 10px;
}

.filter-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  background: white;
  border: 1px solid #e8eeeb;
  border-radius: 12px;
  padding: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 1;
  min-width: 210px;
  color: #8a9995;
  border: 1px solid #e5ebe8;
  border-radius: 8px;
  padding: 0 11px;
  height: 39px;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  color: #071827;
  font: inherit;
  font-size: 11px;
}

.filter-panel select,
.date-field input {
  height: 39px;
  border: 1px solid #e5ebe8;
  border-radius: 8px;
  background: white;
  padding: 0 11px;
  color: #52625e;
  font: inherit;
  font-size: 11px;
  outline: none;
}

.date-filter {
  align-items: flex-end;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-field label {
  color: #82908e;
  font-size: 10px;
  font-weight: 700;
}

.apply-button {
  background: #071827;
  color: #00e66b;
  border: 1px solid #071827;
  height: 39px;
}

.clear-button {
  background: white;
  color: #71817f;
  border: 1px solid #e5ebe8;
  height: 39px;
}

.income-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

.income-card {
  padding: 19px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.table-panel {
  padding: 0;
  overflow: hidden;
}

.table-heading {
  padding: 19px 21px;
  border-bottom: 1px solid #edf1ef;
}

.table-heading h3 {
  margin: 0;
}

.table-heading span {
  font-size: 10px;
  color: #82908e;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th {
  background: #f8faf9;
  color: #82908e;
  font-size: 10px;
  font-weight: 700;
  padding: 13px 17px;
}

td {
  padding: 14px 17px;
  border-top: 1px solid #f0f3f1;
  color: #53625e;
  font-size: 11px;
}

.code-cell {
  color: #071827;
  font-weight: 700;
}

.amount-cell {
  color: #15975a;
  font-weight: 800;
}

.status-badge {
  display: inline-flex;
  border-radius: 20px;
  padding: 5px 9px;
  font-size: 9px;
  font-weight: 800;
}

.status-badge.confirmada {
  background: #e7f7ed;
  color: #16834b;
}

.status-badge.pendiente {
  background: #fff4df;
  color: #a9781d;
}

.status-badge.cancelada {
  background: #fceaea;
  color: #bd5151;
}

.status-badge.curso {
  background: #e9f3fa;
  color: #36769c;
}

.status-badge.finalizada {
  background: #edf0ef;
  color: #687773;
}

.status-badge.neutral {
  background: #edf0ef;
  color: #687773;
}

.empty-cell {
  text-align: center;
  padding: 28px;
  color: #9aa6a2;
}

.empty-state {
  color: #9aa6a2;
  text-align: center;
  font-size: 11px;
  padding: 25px 10px;
}

.occupancy-detail {
  padding: 25px;
}

.big-progress {
  margin: 25px 0;
}

.big-progress-label {
  color: #71817f;
  font-size: 12px;
  margin-bottom: 10px;
}

.big-progress-label strong {
  color: #071827;
}

.large-track {
  height: 12px;
}

.occupied-fill {
  background: #00cc66;
}

.available-fill {
  background: #b08d57;
}

.income-fill {
  background: #00b968;
}

.type-fill {
  background: #6689a9;
}

.other-count {
  border-top: 1px solid #edf1ef;
  padding-top: 17px;
  color: #82908e;
  font-size: 12px;
}

.other-count strong {
  color: #071827;
}

.notice {
  padding: 12px 15px;
  border-radius: 9px;
  font-size: 12px;
}

.error-notice {
  color: #a33f3f;
  background: #fceaea;
}

.success-notice {
  color: #187c49;
  background: #e8f8ef;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
  color: #82908e;
  font-size: 12px;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

@media (max-width: 1000px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .two-columns {
    grid-template-columns: 1fr;
  }

  .page-heading {
    align-items: flex-start;
  }

  .page-heading h1 {
    font-size: 26px;
  }

  .refresh-button {
    padding: 9px;
    font-size: 0;
  }

  .income-summary {
    grid-template-columns: 1fr;
  }

  .report-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .report-tabs button {
    white-space: nowrap;
  }
}

@media (max-width: 430px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
