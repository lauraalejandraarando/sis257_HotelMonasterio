
<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BedDouble,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'

import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const habitaciones = ref([])
const tiposHabitacion = ref([])
const cargando = ref(false)
const guardando = ref(false)
const modalAbierto = ref(false)
const editando = ref(false)
const busqueda = ref('')
const filtroEstado = ref('todos')
const mensaje = ref('')
const error = ref('')

const formularioInicial = () => ({
  numero: '',
  piso: 1,
  estado: 'disponible',
  observaciones: '',
  tipoHabitacionId: ''
})

const formulario = ref(formularioInicial())
const habitacionId = ref(null)

const tiposActivos = computed(() =>
  tiposHabitacion.value.filter(tipo => tipo.activo)
)

const habitacionesFiltradas = computed(() => {
  return habitaciones.value.filter(habitacion => {
    const texto = busqueda.value.toLowerCase().trim()

    const coincideBusqueda =
      String(habitacion.numero).toLowerCase().includes(texto) ||
      String(habitacion.piso).includes(texto) ||
      (habitacion.tipoHabitacion?.nombre || '').toLowerCase().includes(texto)

    const coincideEstado =
      filtroEstado.value === 'todos' ||
      habitacion.estado === filtroEstado.value

    return coincideBusqueda && coincideEstado
  })
})

const disponibles = computed(() =>
  habitaciones.value.filter(h => h.estado === 'disponible').length
)

const ocupadas = computed(() =>
  habitaciones.value.filter(h => h.estado === 'ocupada').length
)

const totalHabitaciones = computed(() => habitaciones.value.length)

function limpiarMensajes() {
  mensaje.value = ''
  error.value = ''
}

// Todas las solicitudes incluyen el token de autenticación.
async function solicitud(url, opciones = {}) {
  const respuesta = await fetch(`${API}${url}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(hotelStore.token
        ? { Authorization: `Bearer ${hotelStore.token}` }
        : {}),
      ...(opciones.headers || {})
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
    const detalle = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message || datos?.error

    throw new Error(
      detalle || 'Ocurrió un error en la solicitud.'
    )
  }

  return datos
}

async function cargarDatos() {
  cargando.value = true
  limpiarMensajes()

  try {
    const [listaHabitaciones, listaTipos] = await Promise.all([
      solicitud('/habitaciones'),
      solicitud('/tipos-habitacion')
    ])

    habitaciones.value = Array.isArray(listaHabitaciones)
      ? listaHabitaciones
      : []

    tiposHabitacion.value = Array.isArray(listaTipos)
      ? listaTipos
      : []
  } catch (e) {
    console.error('Error al cargar habitaciones:', e)
    error.value = e.message ||
      'No se pudieron cargar los datos. Comprueba que el backend esté funcionando.'
  } finally {
    cargando.value = false
  }
}

function abrirNuevo() {
  limpiarMensajes()
  editando.value = false
  habitacionId.value = null
  formulario.value = formularioInicial()
  modalAbierto.value = true
}

function abrirEdicion(habitacion) {
  limpiarMensajes()
  editando.value = true
  habitacionId.value = habitacion.id

  formulario.value = {
    numero: habitacion.numero,
    piso: habitacion.piso,
    estado: ['disponible', 'ocupada', 'reservada'].includes(habitacion.estado)
      ? habitacion.estado
      : 'disponible',
    observaciones: habitacion.observaciones || '',
    tipoHabitacionId: habitacion.tipoHabitacion?.id || ''
  }

  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  formulario.value = formularioInicial()
  habitacionId.value = null
}

async function guardarHabitacion() {
  limpiarMensajes()

  if (!formulario.value.numero.trim()) {
    error.value = 'Debes ingresar el número de habitación.'
    return
  }

  if (!formulario.value.tipoHabitacionId) {
    error.value = 'Debes seleccionar un tipo de habitación.'
    return
  }

  guardando.value = true

  const estabaEditando = editando.value
  const idActual = habitacionId.value

  const datos = {
    numero: formulario.value.numero.trim(),
    piso: Number(formulario.value.piso),
    estado: formulario.value.estado,
    observaciones: formulario.value.observaciones.trim() || null,
    tipoHabitacionId: Number(formulario.value.tipoHabitacionId)
  }

  try {
    if (estabaEditando) {
      await solicitud(`/habitaciones/${idActual}`, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      })
    } else {
      await solicitud('/habitaciones', {
        method: 'POST',
        body: JSON.stringify(datos)
      })
    }

    cerrarModal()
    await cargarDatos()

    mensaje.value = estabaEditando
      ? 'Habitación actualizada correctamente.'
      : 'Habitación registrada correctamente.'
  } catch (e) {
    console.error('Error al guardar habitación:', e)
    error.value = e.message || 'No se pudo guardar la habitación.'
  } finally {
    guardando.value = false
  }
}

async function eliminarHabitacion(habitacion) {
  const confirmar = window.confirm(
    `¿Estás seguro de eliminar la habitación ${habitacion.numero}?`
  )

  if (!confirmar) return

  limpiarMensajes()

  try {
    await solicitud(`/habitaciones/${habitacion.id}`, {
      method: 'DELETE'
    })

    await cargarDatos()
    mensaje.value = 'Habitación eliminada correctamente.'
  } catch (e) {
    console.error('Error al eliminar habitación:', e)
    error.value = e.message || 'No se pudo eliminar la habitación.'
  }
}

function formatoPrecio(precio) {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(precio || 0))
}

function nombreEstado(estado) {
  const nombres = {
    disponible: 'Disponible',
    ocupada: 'Ocupada',
    reservada: 'Reservada'
  }

  return nombres[estado] || estado
}

onMounted(cargarDatos)
</script>

<template>
  <section class="habitaciones-page">

    <div class="page-heading">
      <div class="heading-icon">
        <BedDouble :size="30" />
      </div>

      <div class="heading-text">
        <span class="eyebrow">HOTEL MONASTERIO · SUCRE</span>
        <h1>Habitaciones</h1>
        <p>Administración y control de las habitaciones del hotel.</p>
      </div>

      <button class="btn-primary" @click="abrirNuevo">
        <Plus :size="18" />
        Nueva habitación
      </button>
    </div>

    <div class="summary-grid">
      <article class="summary-card">
        <div class="summary-icon blue">
          <BedDouble :size="21" />
        </div>
        <div>
          <span>Total de habitaciones</span>
          <strong>{{ totalHabitaciones }}</strong>
        </div>
      </article>

      <article class="summary-card">
        <div class="summary-icon green">
          <CheckCircle2 :size="21" />
        </div>
        <div>
          <span>Disponibles</span>
          <strong>{{ disponibles }}</strong>
        </div>
      </article>

      <article class="summary-card">
        <div class="summary-icon gold">
          <Users :size="21" />
        </div>
        <div>
          <span>Ocupadas</span>
          <strong>{{ ocupadas }}</strong>
        </div>
      </article>
    </div>

    <div v-if="mensaje" class="alert success">
      <CheckCircle2 :size="18" />
      {{ mensaje }}
      <button @click="mensaje = ''" aria-label="Cerrar mensaje">
        <X :size="16" />
      </button>
    </div>

    <div v-if="error && !modalAbierto" class="alert danger">
      <AlertCircle :size="18" />
      {{ error }}
      <button @click="error = ''" aria-label="Cerrar mensaje">
        <X :size="16" />
      </button>
    </div>

    <section class="table-card">

      <div class="table-heading">
        <div>
          <h2>Listado de habitaciones</h2>
          <p>Consulta y administra las habitaciones registradas.</p>
        </div>

        <button
          class="refresh-button"
          @click="cargarDatos"
          :disabled="cargando"
          title="Actualizar listado"
        >
          <RefreshCw :size="17" :class="{ girando: cargando }" />
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <Search :size="18" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por número, piso o tipo..."
          />
        </div>

        <select v-model="filtroEstado">
          <option value="todos">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="reservada">Reservada</option>
        </select>
      </div>

      <div v-if="cargando" class="empty-state">
        <RefreshCw :size="28" class="girando" />
        <p>Cargando habitaciones...</p>
      </div>

      <div v-else-if="habitacionesFiltradas.length === 0" class="empty-state">
        <BedDouble :size="34" />
        <h3>No hay habitaciones para mostrar</h3>
        <p>
          Registra una habitación o modifica los filtros de búsqueda.
        </p>
        <button class="btn-primary small" @click="abrirNuevo">
          <Plus :size="16" />
          Registrar habitación
        </button>
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>NÚMERO</th>
              <th>PISO</th>
              <th>TIPO DE HABITACIÓN</th>
              <th>CAPACIDAD</th>
              <th>PRECIO / NOCHE</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="habitacion in habitacionesFiltradas" :key="habitacion.id">
              <td>
                <strong class="room-number">
                  {{ habitacion.numero }}
                </strong>
              </td>

              <td>{{ habitacion.piso }}</td>

              <td>
                {{ habitacion.tipoHabitacion?.nombre || 'Sin tipo' }}
              </td>

              <td>
                {{ habitacion.tipoHabitacion?.capacidad || '—' }}
                {{ habitacion.tipoHabitacion?.capacidad === 1 ? 'huésped' : 'huéspedes' }}
              </td>

              <td class="price">
                Bs {{ formatoPrecio(habitacion.tipoHabitacion?.precioNoche) }}
              </td>

              <td>
                <span
                  class="status"
                  :class="habitacion.estado"
                >
                  {{ nombreEstado(habitacion.estado) }}
                </span>
              </td>

              <td>
                <div class="actions">
                  <button
                    class="action-button edit"
                    title="Editar habitación"
                    @click="abrirEdicion(habitacion)"
                  >
                    <Pencil :size="16" />
                  </button>

                  <button
                    class="action-button delete"
                    title="Eliminar habitación"
                    @click="eliminarHabitacion(habitacion)"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        Mostrando {{ habitacionesFiltradas.length }}
        de {{ totalHabitaciones }} habitaciones
      </div>
    </section>

    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <section class="modal">

        <div class="modal-header">
          <div>
            <span class="eyebrow">HOTEL MONASTERIO</span>
            <h2>{{ editando ? 'Editar habitación' : 'Registrar habitación' }}</h2>
            <p>
              {{ editando ? 'Modifica la información de la habitación.' : 'Completa los datos para registrar una nueva habitación.' }}
            </p>
          </div>

          <button class="close-button" @click="cerrarModal">
            <X :size="20" />
          </button>
        </div>

        <div v-if="error" class="alert danger modal-alert">
          <AlertCircle :size="17" />
          {{ error }}
        </div>

        <form @submit.prevent="guardarHabitacion">

          <div class="form-grid">
            <div class="form-field">
              <label>Número de habitación *</label>
              <input
                v-model="formulario.numero"
                type="text"
                maxlength="20"
                placeholder="Ej. 101"
                required
              />
            </div>

            <div class="form-field">
              <label>Piso *</label>
              <input
                v-model.number="formulario.piso"
                type="number"
                min="0"
                required
              />
            </div>

            <div class="form-field full">
              <label>Tipo de habitación *</label>
              <select
                v-model="formulario.tipoHabitacionId"
                required
              >
                <option value="" disabled>Selecciona un tipo de habitación</option>
                <option
                  v-for="tipo in tiposActivos"
                  :key="tipo.id"
                  :value="tipo.id"
                >
                  {{ tipo.nombre }} · {{ tipo.capacidad }} huésped(es) · Bs {{ formatoPrecio(tipo.precioNoche) }}
                </option>
              </select>

              <span v-if="tiposActivos.length === 0" class="field-help">
                No hay tipos de habitación activos registrados.
              </span>
            </div>

            <div class="form-field">
              <label>Estado *</label>
              <select v-model="formulario.estado" required>
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
              </select>
            </div>

            <div class="form-field full">
              <label>Observaciones</label>
              <textarea
                v-model="formulario.observaciones"
                rows="3"
                placeholder="Información adicional de la habitación..."
              ></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="cerrarModal"
              :disabled="guardando"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="guardando || tiposActivos.length === 0"
            >
              <Save :size="17" />
              {{ guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Registrar habitación' }}
            </button>
          </div>

        </form>
      </section>
    </div>

  </section>
</template>

<style scoped>
.habitaciones-page {
  color: #071827;
}

.page-heading {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.heading-icon {
  width: 65px;
  height: 65px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #00FF66;
  background: #071827;
  border: 1px solid rgba(0,255,102,0.35);
  border-radius: 14px;
}

.heading-text {
  flex: 1;
}

.eyebrow {
  color: #B08D57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-heading h1 {
  font-family: 'Playfair Display', serif;
  font-size: 27px;
  margin: 5px 0;
}

.page-heading p {
  color: #718078;
  font-size: 13px;
  margin: 0;
}

.btn-primary,
.btn-secondary {
  min-height: 42px;
  padding: 0 17px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: #071827;
  color: #00FF66;
  border: 1px solid #071827;
}

.btn-primary:hover {
  background: #0d3028;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary.small {
  min-height: 36px;
  margin-top: 10px;
}

.btn-secondary {
  background: white;
  border: 1px solid rgba(7,24,39,0.18);
  color: #071827;
}

.btn-secondary:hover {
  background: #eef3ef;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.summary-card {
  min-height: 94px;
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(7,24,39,0.11);
  border-radius: 13px;
  padding: 17px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 5px 18px rgba(7,24,39,0.035);
}

.summary-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
}

.summary-icon.blue {
  background: #071827;
  color: #00FF66;
}

.summary-icon.green {
  background: #E3F5E9;
  color: #16834C;
}

.summary-icon.gold {
  background: #F4EBDD;
  color: #9A753F;
}

.summary-card span,
.summary-card strong {
  display: block;
}

.summary-card span {
  color: #718078;
  font-size: 11px;
}

.summary-card strong {
  color: #071827;
  font-size: 23px;
  margin-top: 4px;
}

.table-card {
  background: rgba(255,255,255,0.84);
  border: 1px solid rgba(7,24,39,0.12);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 7px 25px rgba(7,24,39,0.035);
}

.table-heading {
  padding: 21px 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf0ed;
}

.table-heading h2 {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  margin: 0 0 5px;
}

.table-heading p {
  color: #718078;
  font-size: 11px;
  margin: 0;
}

.refresh-button,
.close-button {
  width: 37px;
  height: 37px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: white;
  border: 1px solid rgba(7,24,39,0.15);
  color: #071827;
  cursor: pointer;
}

.refresh-button:hover,
.close-button:hover {
  background: #edf5ef;
  color: #008C43;
}

.filters {
  display: flex;
  gap: 12px;
  padding: 17px 22px;
}

.search-box {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 41px;
  padding: 0 12px;
  background: #F7F8F5;
  border: 1px solid rgba(7,24,39,0.13);
  border-radius: 8px;
  color: #718078;
}

.search-box input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  color: #071827;
}

.filters select,
.form-field select,
.form-field input,
.form-field textarea {
  font-family: inherit;
  font-size: 12px;
  color: #071827;
  background: white;
  border: 1px solid rgba(7,24,39,0.17);
  border-radius: 8px;
  outline: none;
}

.filters select {
  min-width: 170px;
  padding: 0 10px;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus,
.filters select:focus,
.search-box:focus-within {
  border-color: #00A84B;
  box-shadow: 0 0 0 3px rgba(0,255,102,0.09);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

thead {
  background: #F3F5F0;
}

th {
  padding: 13px 15px;
  text-align: left;
  color: #718078;
  font-size: 9px;
  letter-spacing: 0.7px;
  font-weight: 800;
}

td {
  padding: 15px;
  border-bottom: 1px solid #edf0ed;
  font-size: 11px;
  color: #405249;
}

tbody tr:hover {
  background: rgba(0,255,102,0.035);
}

.room-number {
  color: #071827;
  font-size: 12px;
}

.price {
  font-weight: 700;
  color: #071827;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.status.disponible {
  background: #E3F5E9;
  color: #16834C;
}

.status.ocupada {
  background: #F4EBDD;
  color: #956C2F;
}

.status.reservada {
  background: #E8F2F8;
  color: #285C79;
}

.actions {
  display: flex;
  gap: 7px;
}

.action-button {
  width: 31px;
  height: 31px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: white;
  transition: 0.2s;
}

.action-button.edit {
  border: 1px solid #DCE7ED;
  color: #285C79;
}

.action-button.edit:hover {
  background: #E8F2F8;
}

.action-button.delete {
  border: 1px solid #F2DADA;
  color: #B33A3A;
}

.action-button.delete:hover {
  background: #FFF0F0;
}

.table-footer {
  padding: 13px 22px;
  font-size: 10px;
  color: #718078;
  border-top: 1px solid #edf0ed;
}

.empty-state {
  min-height: 230px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #718078;
  padding: 25px;
}

.empty-state h3 {
  font-family: 'Playfair Display', serif;
  color: #071827;
  font-size: 17px;
  margin: 12px 0 5px;
}

.empty-state p {
  font-size: 11px;
}

.alert {
  padding: 12px 15px;
  border-radius: 9px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.alert button {
  margin-left: auto;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.alert.success {
  background: #E7F6EC;
  color: #176B3F;
  border: 1px solid #C8E8D2;
}

.alert.danger {
  background: #FFF0F0;
  color: #A52F2F;
  border: 1px solid #F1D1D1;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  padding: 20px;
  display: grid;
  place-items: center;
  background: rgba(4,16,25,0.65);
  backdrop-filter: blur(5px);
}

.modal {
  width: min(100%, 570px);
  max-height: 90vh;
  overflow-y: auto;
  background: #FDFDFC;
  border-radius: 16px;
  box-shadow: 0 20px 70px rgba(0,0,0,0.25);
  padding: 25px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-family: 'Playfair Display', serif;
  color: #071827;
  font-size: 22px;
  margin: 6px 0;
}

.modal-header p {
  font-size: 11px;
  color: #718078;
  margin: 0;
}

.modal-alert {
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 11px;
  font-weight: 700;
  color: #263B32;
}

.form-field input,
.form-field select {
  height: 42px;
  padding: 0 11px;
}

.form-field textarea {
  padding: 11px;
  resize: vertical;
}

.field-help {
  color: #A66A19;
  font-size: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 18px;
  border-top: 1px solid #edf0ed;
}

.girando {
  animation: girar 1s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 850px) {
  .summary-grid {
    gap: 10px;
  }

  .summary-card {
    padding: 12px;
  }
}

@media (max-width: 650px) {
  .page-heading {
    flex-wrap: wrap;
  }

  .page-heading .btn-primary {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    height: 40px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field.full {
    grid-column: auto;
  }

  .modal {
    padding: 19px;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
</style>
