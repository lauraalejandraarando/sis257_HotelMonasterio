
<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BedDouble,
  Plus,
  Search,
  Pencil,
  Power,
  X,
  Save,
  RefreshCw,
  Users,
  Bath,
  CheckCircle2,
  AlertCircle,
  CircleDollarSign
} from 'lucide-vue-next'

import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

// MODIFICADO POR BRAYAN: Tipos predeterminados con imágenes ilustrativas.
const tiposPredeterminidos = [
  {
    nombre: 'Simple',
    capacidad: 1,
    imagen: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=85',
    descripcion: 'Habitación cómoda para una persona.'
  },
  {
    nombre: 'Doble',
    capacidad: 2,
    imagen: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=85',
    descripcion: 'Habitación con dos camas individuales.'
  },
  {
    nombre: 'Triple',
    capacidad: 3,
    imagen: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85',
    descripcion: 'Habitación amplia para tres huéspedes.'
  },
  {
    nombre: 'Matrimonial',
    capacidad: 2,
    imagen: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=85',
    descripcion: 'Habitación con cama matrimonial.'
  },
  {
    nombre: 'Suite',
    capacidad: 2,
    imagen: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=85',
    descripcion: 'Habitación superior con mayor comodidad.'
  }
]

const tipos = ref([])
const cargando = ref(false)
const guardando = ref(false)
const modalAbierto = ref(false)
const editando = ref(false)
const busqueda = ref('')
const filtroEstado = ref('todos')
const mensaje = ref('')
const error = ref('')
const tipoId = ref(null)

const formularioInicial = () => ({
  nombre: '',
  capacidad: 1,
  tipoBano: 'privado',
  precioNoche: 0,
  descripcion: '',
  activo: true
})

const formulario = ref(formularioInicial())

const tiposFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return tipos.value.filter(tipo => {
    const coincideTexto =
      String(tipo.nombre || '').toLowerCase().includes(texto) ||
      String(tipo.tipoBano || '').toLowerCase().includes(texto) ||
      String(tipo.capacidad || '').includes(texto)

    const coincideEstado =
      filtroEstado.value === 'todos' ||
      (filtroEstado.value === 'activos' && tipo.activo) ||
      (filtroEstado.value === 'inactivos' && !tipo.activo)

    return coincideTexto && coincideEstado
  })
})

const totalTipos = computed(() => tipos.value.length)
const tiposActivos = computed(() => tipos.value.filter(t => t.activo).length)
const tiposInactivos = computed(() => tipos.value.filter(t => !t.activo).length)

// MODIFICADO POR BRAYAN: Identificar la fotografía según el nombre del tipo.
function imagenTipo(nombre) {
  const encontrado = tiposPredeterminidos.find(
    t => t.nombre.toLowerCase() === String(nombre || '').toLowerCase()
  )

  return encontrado?.imagen || tiposPredeterminidos[0].imagen
}

// MODIFICADO POR BRAYAN: Seleccionar tipo y completar capacidad automáticamente.
function seleccionarTipo(tipo) {
  formulario.value.nombre = tipo.nombre
  formulario.value.capacidad = tipo.capacidad
  formulario.value.descripcion = tipo.descripcion
}

function limpiarMensajes() {
  mensaje.value = ''
  error.value = ''
}

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

    throw new Error(detalle || 'Ocurrió un error en la solicitud.')
  }

  return datos
}

async function cargarTipos() {
  cargando.value = true
  limpiarMensajes()

  try {
    const datos = await solicitud('/tipos-habitacion')
    tipos.value = Array.isArray(datos) ? datos : []
  } catch (e) {
    console.error('Error al cargar tipos de habitación:', e)
    error.value = e.message || 'No se pudieron cargar los tipos de habitación.'
  } finally {
    cargando.value = false
  }
}

function abrirNuevo() {
  limpiarMensajes()
  editando.value = false
  tipoId.value = null
  formulario.value = formularioInicial()
  modalAbierto.value = true
}

function abrirEdicion(tipo) {
  limpiarMensajes()
  editando.value = true
  tipoId.value = tipo.id

  formulario.value = {
    nombre: tipo.nombre || '',
    capacidad: Number(tipo.capacidad || 1),
    tipoBano: tipo.tipoBano || 'privado',
    precioNoche: Number(tipo.precioNoche || 0),
    descripcion: tipo.descripcion || '',
    activo: Boolean(tipo.activo)
  }

  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  formulario.value = formularioInicial()
  tipoId.value = null
  error.value = ''
}

async function guardarTipo() {
  limpiarMensajes()

  if (!formulario.value.nombre.trim()) {
    error.value = 'Debes seleccionar un tipo de habitación.'
    return
  }

  if (Number(formulario.value.capacidad) < 1) {
    error.value = 'La capacidad debe ser como mínimo 1 huésped.'
    return
  }

  if (Number(formulario.value.precioNoche) < 0) {
    error.value = 'El precio no puede ser negativo.'
    return
  }

  guardando.value = true

  const estabaEditando = editando.value

  const datos = {
    nombre: formulario.value.nombre.trim(),
    capacidad: Number(formulario.value.capacidad),
    tipoBano: formulario.value.tipoBano,
    precioNoche: Number(formulario.value.precioNoche),
    descripcion: formulario.value.descripcion.trim() || null,
    activo: Boolean(formulario.value.activo)
  }

  try {
    if (estabaEditando) {
      await solicitud(`/tipos-habitacion/${tipoId.value}`, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      })
    } else {
      await solicitud('/tipos-habitacion', {
        method: 'POST',
        body: JSON.stringify(datos)
      })
    }

    cerrarModal()
    await cargarTipos()

    mensaje.value = estabaEditando
      ? 'Tipo de habitación actualizado correctamente.'
      : 'Tipo de habitación registrado correctamente.'
  } catch (e) {
    console.error('Error al guardar tipo de habitación:', e)
    error.value = e.message || 'No se pudo guardar el tipo de habitación.'
  } finally {
    guardando.value = false
  }
}

async function cambiarEstado(tipo) {
  limpiarMensajes()

  const activar = !tipo.activo
  const accion = activar ? 'activar' : 'desactivar'

  const confirmar = window.confirm(
    `¿Deseas ${accion} el tipo de habitación "${tipo.nombre}"?`
  )

  if (!confirmar) return

  try {
    if (activar) {
      await solicitud(`/tipos-habitacion/${tipo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: true })
      })
    } else {
      await solicitud(`/tipos-habitacion/${tipo.id}`, {
        method: 'DELETE'
      })
    }

    await cargarTipos()

    mensaje.value = activar
      ? 'Tipo de habitación activado correctamente.'
      : 'Tipo de habitación desactivado correctamente.'
  } catch (e) {
    console.error('Error al cambiar estado:', e)
    error.value = e.message || 'No se pudo cambiar el estado del tipo.'
  }
}

function formatoPrecio(precio) {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(precio || 0))
}

onMounted(cargarTipos)
</script>

<template>
  <section class="tipos-page">

    <div class="page-heading">
      <div class="heading-icon">
        <BedDouble :size="30" />
      </div>

      <div class="heading-text">
        <span class="eyebrow">HOTEL MONASTERIO · SUCRE</span>
        <h1>Tipos de habitación</h1>
        <p>Administración de categorías, capacidades y tarifas.</p>
      </div>

      <button class="btn-primary" @click="abrirNuevo">
        <Plus :size="18" />
        Nuevo tipo
      </button>
    </div>

    <div class="summary-grid">
      <article class="summary-card">
        <div class="summary-icon blue">
          <BedDouble :size="21" />
        </div>
        <div>
          <span>Total de tipos</span>
          <strong>{{ totalTipos }}</strong>
        </div>
      </article>

      <article class="summary-card">
        <div class="summary-icon green">
          <CheckCircle2 :size="21" />
        </div>
        <div>
          <span>Tipos activos</span>
          <strong>{{ tiposActivos }}</strong>
        </div>
      </article>

      <article class="summary-card">
        <div class="summary-icon gold">
          <Power :size="21" />
        </div>
        <div>
          <span>Tipos inactivos</span>
          <strong>{{ tiposInactivos }}</strong>
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
          <h2>Listado de tipos de habitación</h2>
          <p>Consulta, registra y administra las categorías del hotel.</p>
        </div>

        <button
          class="refresh-button"
          @click="cargarTipos"
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
            placeholder="Buscar por nombre, capacidad o baño..."
          />
        </div>

        <select v-model="filtroEstado">
          <option value="todos">Todos los tipos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      <div v-if="cargando" class="empty-state">
        <RefreshCw :size="28" class="girando" />
        <p>Cargando tipos de habitación...</p>
      </div>

      <div v-else-if="tiposFiltrados.length === 0" class="empty-state">
        <BedDouble :size="34" />
        <h3>No hay tipos para mostrar</h3>
        <p>Registra un tipo o modifica los filtros de búsqueda.</p>
        <button class="btn-primary small" @click="abrirNuevo">
          <Plus :size="16" />
          Registrar tipo
        </button>
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>IMAGEN</th>
              <th>NOMBRE</th>
              <th>CAPACIDAD</th>
              <th>TIPO DE BAÑO</th>
              <th>PRECIO / NOCHE</th>
              <th>DESCRIPCIÓN</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="tipo in tiposFiltrados" :key="tipo.id">
              <td>
                <img
                  class="table-room-image"
                  :src="imagenTipo(tipo.nombre)"
                  :alt="tipo.nombre"
                />
              </td>

              <td>
                <strong class="type-name">{{ tipo.nombre }}</strong>
              </td>

              <td>
                <span class="capacity">
                  <Users :size="15" />
                  {{ tipo.capacidad }}
                  {{ tipo.capacidad === 1 ? 'huésped' : 'huéspedes' }}
                </span>
              </td>

              <td>
                <span class="bath-type">
                  <Bath :size="15" />
                  {{ tipo.tipoBano === 'privado' ? 'Privado' : 'Compartido' }}
                </span>
              </td>

              <td class="price">
                <CircleDollarSign :size="15" />
                Bs {{ formatoPrecio(tipo.precioNoche) }}
              </td>

              <td class="description">
                {{ tipo.descripcion || 'Sin descripción' }}
              </td>

              <td>
                <span class="status" :class="tipo.activo ? 'activo' : 'inactivo'">
                  {{ tipo.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <td>
                <div class="actions">
                  <button
                    class="action-button edit"
                    title="Editar tipo"
                    @click="abrirEdicion(tipo)"
                  >
                    <Pencil :size="16" />
                  </button>

                  <button
                    class="action-button"
                    :class="tipo.activo ? 'deactivate' : 'activate'"
                    :title="tipo.activo ? 'Desactivar tipo' : 'Activar tipo'"
                    @click="cambiarEstado(tipo)"
                  >
                    <Power :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        Mostrando {{ tiposFiltrados.length }} de {{ totalTipos }} tipos de habitación
      </div>
    </section>

    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <section class="modal">

        <div class="modal-header">
          <div>
            <span class="eyebrow">HOTEL MONASTERIO</span>
            <h2>{{ editando ? 'Editar tipo de habitación' : 'Registrar tipo de habitación' }}</h2>
            <p>
              {{ editando
                ? 'Modifica las características y tarifas del tipo.'
                : 'Selecciona una categoría para comenzar.' }}
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

        <form @submit.prevent="guardarTipo">

          <!-- MODIFICADO POR BRAYAN: Selección visual de categorías con fotografías. -->
          <div class="form-field full">
            <label>Selecciona el tipo de habitación *</label>

            <div class="room-options">
              <button
                v-for="opcion in tiposPredeterminidos"
                :key="opcion.nombre"
                type="button"
                class="room-option"
                :class="{ selected: formulario.nombre === opcion.nombre }"
                :aria-pressed="formulario.nombre === opcion.nombre"
                @click="seleccionarTipo(opcion)"
              >
                <img :src="opcion.imagen" :alt="opcion.nombre" />

                <span class="room-option-info">
                  <strong>{{ opcion.nombre }}</strong>
                  <small>
                    {{ opcion.capacidad }}
                    {{ opcion.capacidad === 1 ? 'huésped' : 'huéspedes' }}
                  </small>
                </span>

                <CheckCircle2
                  v-if="formulario.nombre === opcion.nombre"
                  class="selected-check"
                  :size="21"
                />
              </button>
            </div>

            <small class="selection-help">
              Selecciona una fotografía para elegir la categoría.
            </small>
          </div>

          <div class="form-grid">

            <div class="form-field">
              <label>Capacidad de huéspedes *</label>
              <input
                v-model.number="formulario.capacidad"
                type="number"
                min="1"
                step="1"
                required
              />
            </div>

            <div class="form-field">
              <label>Tipo de baño *</label>
              <select v-model="formulario.tipoBano" required>
                <option value="privado">Privado</option>
                <option value="compartido">Compartido</option>
              </select>
            </div>

            <div class="form-field full">
              <label>Precio por noche (Bs) *</label>
              <input
                v-model.number="formulario.precioNoche"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div class="form-field full">
              <label>Descripción</label>
              <textarea
                v-model="formulario.descripcion"
                rows="3"
                placeholder="Describe las características de este tipo de habitación..."
              ></textarea>
            </div>

            <div v-if="editando" class="form-field full">
              <label>Estado</label>
              <select v-model="formulario.activo">
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
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
              :disabled="guardando"
            >
              <Save :size="17" />
              {{ guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Registrar tipo' }}
            </button>
          </div>
        </form>
      </section>
    </div>

  </section>
</template>

<style scoped>
.tipos-page {
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

.type-name {
  color: #071827;
  font-size: 12px;
}

/* MODIFICADO POR BRAYAN: Fotografías en el listado. */
.table-room-image {
  width: 76px;
  height: 53px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  box-shadow: 0 3px 8px rgba(7,24,39,0.12);
}

.capacity,
.bath-type,
.price {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.capacity,
.bath-type {
  color: #405249;
}

.price {
  font-weight: 700;
  color: #071827;
}

.description {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.status.activo {
  background: #E3F5E9;
  color: #16834C;
}

.status.inactivo {
  background: #F4EBDD;
  color: #956C2F;
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

.action-button.deactivate {
  border: 1px solid #F2DADA;
  color: #B33A3A;
}

.action-button.deactivate:hover {
  background: #FFF0F0;
}

.action-button.activate {
  border: 1px solid #C8E8D2;
  color: #16834C;
}

.action-button.activate:hover {
  background: #E3F5E9;
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
  width: min(100%, 700px);
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

/* MODIFICADO POR BRAYAN: Tarjetas visuales de selección. */
.room-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 5px;
}

.room-option {
  position: relative;
  padding: 0;
  overflow: hidden;
  text-align: left;
  background: white;
  border: 2px solid #E3E9E4;
  border-radius: 11px;
  cursor: pointer;
  transition: 0.2s ease;
  font-family: inherit;
}

.room-option:hover {
  transform: translateY(-3px);
  border-color: #9CB8A5;
  box-shadow: 0 7px 17px rgba(7,24,39,0.09);
}

.room-option.selected {
  border-color: #16834C;
  box-shadow: 0 0 0 2px rgba(22,131,76,0.12);
}

.room-option img {
  width: 100%;
  height: 105px;
  display: block;
  object-fit: cover;
}

.room-option-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 11px;
}

.room-option-info strong {
  color: #071827;
  font-size: 13px;
}

.room-option-info small {
  color: #718078;
  font-size: 10px;
}

.selected-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  background: #16834C;
  border-radius: 50%;
  padding: 2px;
}

.selection-help {
  color: #718078;
  font-size: 10px;
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

  .room-options {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .room-option img {
    height: 95px;
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
