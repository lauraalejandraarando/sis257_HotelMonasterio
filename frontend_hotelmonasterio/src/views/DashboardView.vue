
<template>
  <section class="dashboard">

    <!-- ENCABEZADO -->
    <header class="welcome">
      <div>
        <p class="hotel-name">HOTEL MONASTERIO · SUCRE</p>
        <h1>Panel de control</h1>
        <p class="subtitle">Centro de información y gestión del establecimiento.</p>
      </div>

      <div class="date-box">
        <div class="date-icon">
          <CalendarDays :size="22" />
        </div>
        <div>
          <span>FECHA Y HORA</span>
          <strong>{{ fechaActual }}</strong>
          <strong class="clock">{{ horaActual }}</strong>
        </div>
      </div>
    </header>

    <!-- USUARIO Y TURNO -->
    <section class="user-session">
      <div class="user-icon">
        <UserRound :size="25" />
      </div>

      <div class="user-info">
        <span>SESIÓN ACTUAL</span>
        <strong>{{ nombreUsuario }}</strong>
        <small>{{ turnoUsuario }}</small>
      </div>

      <div class="session-status">
        <span></span>
        {{ hotel.autenticado ? 'Sesión activa' : 'Acceso pendiente' }}
      </div>
    </section>

    <!-- MODIFICADO POR BRAYAN: ACCIONES RAPIDAS -->
    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="section-label">GESTIÓN DEL HOTEL</span>
          <h2>Acciones rápidas</h2>
          <p>Accede directamente a las operaciones principales de recepción.</p>
        </div>
      </div>

      <div class="quick-actions">
        <router-link to="/reservas" class="quick-action">
          <div class="quick-action-icon">
            <CalendarCheck :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Nueva reserva</strong>
            <span>Registrar y administrar reservas</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>

        <router-link to="/huespedes" class="quick-action">
          <div class="quick-action-icon">
            <UsersRound :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Registrar huésped</strong>
            <span>Registrar y consultar huéspedes</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>

        <router-link to="/habitaciones" class="quick-action">
          <div class="quick-action-icon">
            <BedDouble :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Habitaciones</strong>
            <span>Consultar disponibilidad y estado</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>

        <router-link to="/check-in-out" class="quick-action">
          <div class="quick-action-icon">
            <LogIn :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Check-in / Check-out</strong>
            <span>Gestionar entradas y salidas</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>

        <router-link to="/pagos" class="quick-action">
          <div class="quick-action-icon">
            <CreditCard :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Registrar pago</strong>
            <span>Consultar pagos y saldos</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>

        <router-link to="/caja" class="quick-action">
          <div class="quick-action-icon">
            <Wallet :size="23" />
          </div>
          <div class="quick-action-content">
            <strong>Control de caja</strong>
            <span>Consultar turnos y movimientos</span>
          </div>
          <span class="quick-arrow">›</span>
        </router-link>
      </div>
    </section>

    <!-- ESTADO DE ACTUALIZACIÓN -->
    <div v-if="errorDashboard" class="dashboard-message error-message">
      {{ errorDashboard }}
      <button @click="cargarDashboard">Reintentar</button>
    </div>

    <div v-else-if="cargando" class="dashboard-message">
      Actualizando información del establecimiento...
    </div>

    <!-- INDICADORES PRINCIPALES -->
    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="section-label">VISTA GENERAL</span>
          <h2>Resumen del establecimiento</h2>
          <p>Selecciona un indicador para consultar sus detalles.</p>
        </div>
      </div>

      <div class="stats-grid">
        <router-link to="/habitaciones" class="stat-card">
          <div class="stat-icon">
            <BedDouble :size="23" />
          </div>
          <div class="stat-content">
            <span>Habitaciones</span>
            <strong>{{ habitacionesTotal }}</strong>
            <small>{{ habitacionesDisponibles }} disponibles · {{ habitacionesOcupadas }} ocupadas</small>
          </div>
        </router-link>

        <router-link to="/reservas" class="stat-card">
          <div class="stat-icon">
            <CalendarCheck :size="23" />
          </div>
          <div class="stat-content">
            <span>Reservas del día</span>
            <strong>{{ reservasDelDia }}</strong>
            <small>Entradas previstas para hoy</small>
          </div>
        </router-link>

        <router-link to="/huespedes" class="stat-card">
          <div class="stat-icon">
            <UsersRound :size="23" />
          </div>
          <div class="stat-content">
            <span>Huéspedes alojados</span>
            <strong>{{ huespedesAlojados }}</strong>
            <small>Huéspedes actualmente en el hotel</small>
          </div>
        </router-link>
      </div>
    </section>

    <!-- ACTIVIDAD DIARIA -->
    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="section-label">OPERACIONES DEL HOTEL</span>
          <h2>Actividad diaria</h2>
          <p>Selecciona una operación para gestionarla.</p>
        </div>
      </div>

      <div class="activity-grid">
        <router-link to="/check-in-out" class="info-card">
          <div class="info-heading">
            <div class="info-icon">
              <LogIn :size="21" />
            </div>
            <span class="info-tag">ENTRADAS</span>
          </div>
          <h3>Llegadas previstas</h3>
          <strong class="info-number">{{ llegadasPrevistas }}</strong>
          <p>Check-in confirmados para hoy</p>
          <span class="card-action">Gestionar entradas →</span>
        </router-link>

        <router-link to="/check-in-out" class="info-card">
          <div class="info-heading">
            <div class="info-icon">
              <LogOut :size="21" />
            </div>
            <span class="info-tag">SALIDAS</span>
          </div>
          <h3>Salidas previstas</h3>
          <strong class="info-number">{{ salidasPrevistas }}</strong>
          <p>Check-out previstos para hoy</p>
          <span class="card-action">Gestionar salidas →</span>
        </router-link>

        <router-link to="/reservas" class="info-card">
          <div class="info-heading">
            <div class="info-icon">
              <CalendarClock :size="21" />
            </div>
            <span class="info-tag">RESERVAS</span>
          </div>
          <h3>Reservas pendientes</h3>
          <strong class="info-number">{{ reservasPendientes }}</strong>
          <p>Reservas que requieren seguimiento</p>
          <span class="card-action">Ver reservas →</span>
        </router-link>
      </div>
    </section>

    <!-- ALERTAS -->
    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="section-label">SEGUIMIENTO</span>
          <h2>Alertas y pendientes</h2>
          <p>Selecciona una alerta para revisar su información.</p>
        </div>
      </div>

      <div class="alerts-grid">
        <router-link to="/pagos" class="alert-card">
          <div class="alert-icon">
            <CreditCard :size="21" />
          </div>
          <div class="alert-description">
            <strong>Pagos pendientes</strong>
            <p>Reservas con saldo pendiente de pago.</p>
          </div>
          <span class="alert-value">{{ pagosPendientes }}</span>
        </router-link>

        <router-link to="/reservas" class="alert-card">
          <div class="alert-icon">
            <CalendarClock :size="21" />
          </div>
          <div class="alert-description">
            <strong>Reservas provisionales</strong>
            <p>Reservas pendientes de confirmación.</p>
          </div>
          <span class="alert-value">{{ reservasProvisionales }}</span>
        </router-link>

        <router-link to="/caja" class="alert-card">
          <div class="alert-icon">
            <Wallet :size="21" />
          </div>
          <div class="alert-description">
            <strong>Movimientos de caja</strong>
            <p>Movimientos registrados durante el día.</p>
          </div>
          <span class="alert-value">{{ movimientosCaja }}</span>
        </router-link>
      </div>
    </section>

    <!-- ACCESOS ADICIONALES -->
    <section class="section-block">
      <div class="section-heading">
        <div>
          <span class="section-label">ADMINISTRACIÓN</span>
          <h2>Otros módulos</h2>
          <p>Más herramientas para administrar el establecimiento.</p>
        </div>
      </div>

      <div class="other-modules">
        <router-link to="/tipos-habitacion" class="module-link">
          <BedDouble :size="19" />
          Tipos de habitación
          <span>→</span>
        </router-link>

        <router-link to="/reportes" class="module-link">
          <CalendarDays :size="19" />
          Reportes
          <span>→</span>
        </router-link>

        <router-link to="/usuarios" class="module-link">
          <UserRound :size="19" />
          Usuarios
          <span>→</span>
        </router-link>
      </div>
    </section>

    <!-- PIE -->
    <footer class="dashboard-footer">
      <strong>HOTEL MONASTERIO</strong>
      <span>·</span>
      Sistema integral de gestión hotelera
      <small>Actualización automática cada 30 segundos</small>
    </footer>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHotelStore } from '../stores/hotelStore'

import {
  CalendarDays,
  UserRound,
  BedDouble,
  CalendarCheck,
  Wallet,
  UsersRound,
  LogIn,
  LogOut,
  CreditCard,
  CalendarClock
} from 'lucide-vue-next'

const API = 'http://localhost:3000'
const hotel = useHotelStore()

// DATOS DEL DASHBOARD
const habitacionesTotal = ref(0)
const habitacionesDisponibles = ref(0)
const habitacionesOcupadas = ref(0)

const reservasDelDia = ref(0)
const huespedesAlojados = ref(0)
const llegadasPrevistas = ref(0)
const salidasPrevistas = ref(0)
const reservasPendientes = ref(0)
const pagosPendientes = ref(0)
const reservasProvisionales = ref(0)
const movimientosCaja = ref(0)

const cargando = ref(false)
const errorDashboard = ref('')

// FECHA LOCAL
function obtenerFechaLocal(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

// FECHA Y HORA AUTOMÁTICAS
const ahora = ref(new Date())

let reloj = null
let actualizacion = null

const fechaActual = computed(() => {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(ahora.value)
})

const horaActual = computed(() => {
  return new Intl.DateTimeFormat('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(ahora.value)
})

// INFORMACIÓN DEL USUARIO
const nombreUsuario = computed(() => {
  const usuario = hotel.usuario

  if (!usuario) return 'Usuario no identificado'

  return (
    usuario.nombreCompleto ||
    usuario.nombre ||
    usuario.usuario ||
    usuario.email ||
    'Usuario del sistema'
  )
})

const turnoUsuario = computed(() => {
  const usuario = hotel.usuario

  if (!usuario) return 'Turno pendiente de identificación'

  const turno = usuario.turno || usuario.rol

  if (typeof turno === 'string') return turno

  if (turno && typeof turno === 'object') {
    return turno.nombre || turno.descripcion || 'Perfil registrado'
  }

  return 'Turno pendiente de identificación'
})

// CONSULTAR BACKEND CON TOKEN
async function consultar(url) {
  const respuesta = await fetch(`${API}${url}`, {
    headers: {
      Authorization: `Bearer ${hotel.token}`
    }
  })

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar ${url}`)
  }

  return respuesta.json()
}

// CARGAR DASHBOARD
async function cargarDashboard() {
  if (cargando.value) return

  cargando.value = true
  errorDashboard.value = ''

  try {
    const [resumen, reservas, turnos] = await Promise.all([
      consultar('/reportes/resumen'),
      consultar('/reportes/reservas'),
      consultar('/caja/turnos')
    ])

    // HABITACIONES
    habitacionesTotal.value = Number(resumen.totalHabitaciones || 0)
    habitacionesDisponibles.value = Number(resumen.habitacionesDisponibles || 0)
    habitacionesOcupadas.value = Number(resumen.habitacionesOcupadas || 0)

    const listaReservas = Array.isArray(reservas) ? reservas : []
    const listaTurnos = Array.isArray(turnos) ? turnos : []

    const hoy = obtenerFechaLocal()

    // RESERVAS DEL DÍA
    reservasDelDia.value = listaReservas.filter(reserva =>
      reserva.fechaEntrada === hoy &&
      reserva.estado !== 'cancelada'
    ).length

    // HUÉSPEDES ALOJADOS
    const reservasEnCurso = listaReservas.filter(
      reserva => reserva.estado === 'en curso'
    )

    huespedesAlojados.value = reservasEnCurso.reduce(
      (total, reserva) =>
        total + Number(reserva.cantidadHuespedes || 0),
      0
    )

    // LLEGADAS PREVISTAS
    llegadasPrevistas.value = listaReservas.filter(
      reserva =>
        reserva.fechaEntrada === hoy &&
        reserva.estado === 'confirmada'
    ).length

    // SALIDAS PREVISTAS
    salidasPrevistas.value = listaReservas.filter(
      reserva =>
        reserva.fechaSalida === hoy &&
        reserva.estado === 'en curso'
    ).length

    // RESERVAS PENDIENTES
    reservasPendientes.value = listaReservas.filter(
      reserva => reserva.estado === 'pendiente'
    ).length

    reservasProvisionales.value = reservasPendientes.value

    // PAGOS PENDIENTES
    const reservasConPago = listaReservas.filter(
      reserva =>
        reserva.estado === 'pendiente' ||
        reserva.estado === 'confirmada'
    )

    const cuentas = await Promise.all(
      reservasConPago.map(async reserva => {
        try {
          return await consultar(
            `/pagos/estado-cuenta/${reserva.id}`
          )
        } catch (error) {
          console.error(
            `No se pudo consultar la cuenta de la reserva ${reserva.id}`,
            error
          )
          return null
        }
      })
    )

    pagosPendientes.value = cuentas.filter(
      cuenta =>
        cuenta &&
        Number(cuenta.saldoPendiente || 0) > 0
    ).length

    // MOVIMIENTOS DE CAJA DEL DÍA
    const turnosDelDia = listaTurnos.filter(
      turno => turno.fechaOperativa === hoy
    )

    const movimientosPorTurno = await Promise.all(
      turnosDelDia.map(async turno => {
        try {
          const movimientos = await consultar(
            `/caja/turnos/${turno.id}/movimientos`
          )

          return Array.isArray(movimientos) ? movimientos.length : 0
        } catch (error) {
          console.error(
            `No se pudieron consultar los movimientos del turno ${turno.id}`,
            error
          )
          return 0
        }
      })
    )

    movimientosCaja.value = movimientosPorTurno.reduce(
      (total, cantidad) => total + cantidad,
      0
    )

  } catch (error) {
    console.error('Error al cargar el Dashboard:', error)
    errorDashboard.value =
      'No se pudo actualizar la información. Comprueba que el backend esté funcionando.'
  } finally {
    cargando.value = false
  }
}

// CICLO DE VIDA
onMounted(() => {
  cargarDashboard()

  reloj = setInterval(() => {
    ahora.value = new Date()
  }, 1000)

  actualizacion = setInterval(() => {
    cargarDashboard()
  }, 30000)
})

onUnmounted(() => {
  clearInterval(reloj)
  clearInterval(actualizacion)
})
</script>

<style scoped>
.dashboard {
  max-width: 1500px;
  margin: 0 auto;
  color: #071827;
}

/* ENCABEZADO */
.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  margin-bottom: 25px;
}

.hotel-name {
  color: #071827;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 2.2px;
  margin: 0 0 12px;
}

h1 {
  color: #071827;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 36px;
  margin: 0;
}

.subtitle {
  color: #718078;
  font-size: 13px;
  margin: 9px 0 0;
}

.date-box {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 220px;
  padding: 15px;
  background: #FFFFFF;
  border: 1px solid #E4E5DF;
  border-radius: 13px;
}

.date-icon {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  color: #00A84F;
  background: #071827;
  border-radius: 11px;
}

.date-box span,
.date-box strong {
  display: block;
}

.date-box span {
  color: #718078;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.date-box strong {
  color: #071827;
  font-size: 11px;
  margin-top: 5px;
  text-transform: capitalize;
}

.date-box .clock {
  color: #00A84F;
  font-size: 16px;
  font-weight: 800;
}

/* SESIÓN */
.user-session {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  margin-bottom: 30px;
  background: #071827;
  border: 1px solid rgba(0, 255, 102, 0.2);
  border-radius: 14px;
}

.user-icon {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  color: #00FF66;
  background: rgba(0, 255, 102, 0.1);
  border-radius: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-info span {
  color: #00FF66;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.user-info strong {
  color: #F5F0E6;
  font-size: 13px;
}

.user-info small {
  color: #B7C4BD;
  font-size: 10px;
}

.session-status {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  color: #DCE7DF;
  font-size: 10px;
}

.session-status span {
  width: 7px;
  height: 7px;
  background: #00FF66;
  border-radius: 50%;
  box-shadow: 0 0 8px #00FF66;
}

/* MODIFICADO POR BRAYAN: ACCIONES RAPIDAS */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
  padding: 17px;
  color: inherit;
  text-decoration: none;
  background: #FFFFFF;
  border: 1px solid #E6E7E1;
  border-radius: 13px;
  transition: all 0.2s ease;
}

.quick-action:hover {
  border-color: #B08D57;
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(7, 24, 39, 0.08);
}

.quick-action-icon {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #00FF66;
  background: #071827;
  border-radius: 11px;
}

.quick-action-content {
  flex: 1;
  min-width: 0;
}

.quick-action-content strong,
.quick-action-content span {
  display: block;
}

.quick-action-content strong {
  color: #071827;
  font-size: 12px;
}

.quick-action-content span {
  color: #829087;
  font-size: 10px;
  margin-top: 5px;
}

.quick-arrow {
  color: #B08D57;
  font-size: 25px;
  font-weight: bold;
}

/* MENSAJES */
.dashboard-message {
  padding: 12px 16px;
  margin-bottom: 20px;
  background: #FFFFFF;
  border: 1px solid #E4E5DF;
  border-radius: 10px;
  color: #718078;
  font-size: 11px;
}

.error-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #A33B32;
  border-color: #E8C5C0;
}

.error-message button {
  padding: 8px 13px;
  color: #F5F0E6;
  background: #071827;
  border: 0;
  border-radius: 7px;
  cursor: pointer;
}

/* SECCIONES */
.section-block {
  margin-bottom: 30px;
}

.section-heading {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  color: #00A84F;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.8px;
  margin-bottom: 6px;
}

.section-heading h2 {
  color: #071827;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 21px;
  margin: 0;
}

.section-heading p {
  color: #718078;
  font-size: 11px;
  margin: 6px 0 0;
}

/* INDICADORES */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
  padding: 20px 16px;
  color: inherit;
  text-decoration: none;
  background: #FFFFFF;
  border: 1px solid #E6E7E1;
  border-radius: 14px;
  transition: 0.2s ease;
}

.stat-card:hover {
  border-color: #B08D57;
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(7, 24, 39, 0.06);
}

.stat-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #00FF66;
  background: #071827;
  border-radius: 12px;
}

.stat-content {
  min-width: 0;
}

.stat-content span,
.stat-content strong,
.stat-content small {
  display: block;
}

.stat-content span {
  color: #718078;
  font-size: 11px;
}

.stat-content strong {
  color: #071827;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 25px;
  margin: 3px 0;
}

.stat-content small {
  color: #9AA39D;
  font-size: 9px;
}

/* ACTIVIDAD DIARIA */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.info-card {
  display: block;
  padding: 19px;
  color: inherit;
  text-decoration: none;
  background: #FFFFFF;
  border: 1px solid #E6E7E1;
  border-radius: 14px;
  transition: all 0.2s ease;
}

.info-card:hover {
  border-color: #B08D57;
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(7, 24, 39, 0.06);
}

.info-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #00FF66;
  background: #071827;
  border-radius: 11px;
}

.info-tag {
  color: #B08D57;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1px;
}

.info-card h3 {
  color: #071827;
  font-size: 13px;
  margin: 17px 0 4px;
}

.info-number {
  display: block;
  color: #071827;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
}

.info-card p {
  color: #829087;
  font-size: 10px;
  margin: 5px 0 0;
}

.card-action {
  display: inline-block;
  margin-top: 14px;
  color: #00A84F;
  font-size: 10px;
  font-weight: 800;
}

/* ALERTAS */
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  color: inherit;
  text-decoration: none;
  background: #FFFFFF;
  border: 1px solid #E6E7E1;
  border-left: 3px solid #B08D57;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.alert-card:hover {
  border-color: #B08D57;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(7, 24, 39, 0.06);
}

.alert-icon {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #00FF66;
  background: #071827;
  border-radius: 10px;
}

.alert-description {
  flex: 1;
  min-width: 0;
}

.alert-card strong {
  color: #071827;
  font-size: 11px;
}

.alert-card p {
  color: #829087;
  font-size: 9px;
  line-height: 1.5;
  margin: 5px 0 0;
}

.alert-value {
  color: #071827;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 21px;
}

/* MODIFICADO POR BRAYAN: OTROS MODULOS */
.other-modules {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.module-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  color: #071827;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  background: #FFFFFF;
  border: 1px solid #E6E7E1;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.module-link:hover {
  border-color: #B08D57;
  color: #00A84F;
  transform: translateY(-2px);
}

.module-link span {
  margin-left: auto;
  color: #B08D57;
  font-size: 19px;
}

/* PIE */
.dashboard-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 18px 0 5px;
  color: #829087;
  font-size: 9px;
}

.dashboard-footer strong {
  color: #071827;
  letter-spacing: 1px;
}

.dashboard-footer span {
  color: #B08D57;
}

.dashboard-footer small {
  width: 100%;
  margin-top: 5px;
  color: #9AA39D;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .stats-grid,
  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 750px) {
  .activity-grid,
  .alerts-grid,
  .other-modules {
    grid-template-columns: 1fr;
  }

  .welcome {
    align-items: flex-start;
    flex-direction: column;
  }

  .date-box {
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 500px) {
  .stats-grid,
  .quick-actions {
    grid-template-columns: 1fr;
  }

  .user-session {
    flex-wrap: wrap;
  }

  .session-status {
    width: 100%;
    margin-left: 59px;
  }

  h1 {
    font-size: 29px;
  }

  .dashboard-footer {
    flex-wrap: wrap;
  }
}
</style>
