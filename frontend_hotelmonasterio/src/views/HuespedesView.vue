
<template>
  <main class="huespedes-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">GESTIÓN HOTELERA</span>
        <h1>Huéspedes</h1>
        <p>Registro y administración de huéspedes del Hotel Monasterio.</p>
      </div>

      <button class="btn-primary" @click="abrirNuevo">
        <UserPlus :size="18" />
        Nuevo huésped
      </button>
    </header>

    <div v-if="mensaje" class="alert-message" :class="tipoMensaje">
      <CheckCircle v-if="tipoMensaje === 'success'" :size="18" />
      <AlertCircle v-else :size="18" />
      {{ mensaje }}
    </div>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon blue">
          <Users :size="22" />
        </div>
        <div>
          <span>Total de huéspedes</span>
          <strong>{{ huespedes.length }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green">
          <UserCheck :size="22" />
        </div>
        <div>
          <span>Huéspedes activos</span>
          <strong>{{ activos }}</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold">
          <UserX :size="22" />
        </div>
        <div>
          <span>Huéspedes inactivos</span>
          <strong>{{ inactivos }}</strong>
        </div>
      </article>
    </section>

    <section class="content-card">
      <div class="toolbar">
        <div>
          <h2>Directorio de huéspedes</h2>
          <p>Consulta y administra los registros del hotel.</p>
        </div>

        <div class="filters">
          <div class="search-box">
            <Search :size="18" />
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar huésped..."
            />
          </div>

          <select v-model="filtroEstado" class="filter-select">
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
      </div>

      <div v-if="cargando" class="empty-state">
        <LoaderCircle class="loading-icon" :size="30" />
        <p>Cargando huéspedes...</p>
      </div>

      <div v-else-if="huespedesFiltrados.length === 0" class="empty-state">
        <Users :size="36" />
        <h3>No se encontraron huéspedes</h3>
        <p>Prueba con otro término de búsqueda o registra un huésped nuevo.</p>
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>HUÉSPED</th>
              <th>DOCUMENTO</th>
              <th>CONTACTO</th>
              <th>NACIONALIDAD</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="huesped in huespedesFiltrados" :key="huesped.id">
              <td>
                <div class="guest-cell">
                  <div class="avatar">
                    {{ iniciales(huesped) }}
                  </div>
                  <div>
                    <strong>{{ huesped.nombres }} {{ huesped.apellidos }}</strong>
                    <small>Huésped #{{ huesped.id }}</small>
                  </div>
                </div>
              </td>

              <td>
                <strong>{{ huesped.tipoDocumento }}</strong>
                <small class="secondary-text">{{ huesped.numeroDocumento }}</small>
              </td>

              <td>
                <span>{{ huesped.telefono || 'Sin teléfono' }}</span>
                <small class="secondary-text">{{ huesped.correo || 'Sin correo' }}</small>
              </td>

              <td>{{ huesped.nacionalidad }}</td>

              <td>
                <span
                  class="status-badge"
                  :class="huesped.estado ? 'active' : 'inactive'"
                >
                  {{ huesped.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <td>
                <div class="actions">
                  <button
                    class="icon-button edit"
                    title="Editar huésped"
                    @click="abrirEdicion(huesped)"
                  >
                    <Pencil :size="17" />
                  </button>

                  <button
                    v-if="huesped.estado"
                    class="icon-button deactivate"
                    title="Desactivar huésped"
                    @click="cambiarEstado(huesped, false)"
                  >
                    <UserX :size="17" />
                  </button>

                  <button
                    v-else
                    class="icon-button activate"
                    title="Reactivar huésped"
                    @click="cambiarEstado(huesped, true)"
                  >
                    <UserCheck :size="17" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!cargando && huespedesFiltrados.length > 0"
        class="table-footer"
      >
        Mostrando {{ huespedesFiltrados.length }} de {{ huespedes.length }} huéspedes
      </div>
    </section>

    <!-- MODAL DE REGISTRO Y EDICIÓN -->
    <div
      v-if="mostrarFormulario"
      class="modal-overlay"
      @click.self="cerrarFormulario"
    >
      <section class="modal-card">
        <header class="modal-header">
          <div>
            <span class="eyebrow">HOTEL MONASTERIO</span>
            <h2>{{ modoEdicion ? 'Editar huésped' : 'Registrar huésped' }}</h2>
            <p>
              {{ modoEdicion
                ? 'Actualiza la información del huésped.'
                : 'Completa los datos para registrar un nuevo huésped.' }}
            </p>
          </div>

          <button class="close-button" @click="cerrarFormulario">
            <X :size="21" />
          </button>
        </header>

        <form @submit.prevent="guardarHuesped">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombres <span>*</span></label>
              <input
                v-model.trim="formulario.nombres"
                type="text"
                maxlength="100"
                placeholder="Ej. María Fernanda"
                required
              />
            </div>

            <div class="form-group">
              <label>Apellidos <span>*</span></label>
              <input
                v-model.trim="formulario.apellidos"
                type="text"
                maxlength="100"
                placeholder="Ej. Pérez López"
                required
              />
            </div>

            <div class="form-group">
              <label>Tipo de documento <span>*</span></label>
              <select v-model="formulario.tipoDocumento" required>
                <option value="" disabled>Selecciona un documento</option>
                <option value="CI">Cédula de identidad (CI)</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div class="form-group">
              <label>Número de documento <span>*</span></label>
              <input
                v-model.trim="formulario.numeroDocumento"
                type="text"
                maxlength="30"
                placeholder="Número de documento"
                required
              />
            </div>

            <div class="form-group">
              <label>Nacionalidad <span>*</span></label>
              <input
                v-model.trim="formulario.nacionalidad"
                type="text"
                maxlength="60"
                placeholder="Ej. Boliviana"
                required
              />
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input
                v-model.trim="formulario.telefono"
                type="tel"
                maxlength="30"
                placeholder="Número de contacto"
              />
            </div>

            <div class="form-group full-width">
              <label>Correo electrónico</label>
              <input
                v-model.trim="formulario.correo"
                type="email"
                maxlength="120"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div class="form-group full-width">
              <label>Dirección</label>
              <textarea
                v-model.trim="formulario.direccion"
                rows="3"
                placeholder="Dirección del huésped"
              ></textarea>
            </div>
          </div>

          <div class="form-note">
            <span>*</span> Los campos marcados son obligatorios.
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="cerrarFormulario"
            >
              Cancelar
            </button>

            <button type="submit" class="btn-primary" :disabled="guardando">
              <LoaderCircle
                v-if="guardando"
                class="loading-icon"
                :size="17"
              />
              <Save v-else :size="17" />
              {{ guardando ? 'Guardando...' : 'Guardar huésped' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Pencil,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  LoaderCircle
} from 'lucide-vue-next'

import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const huespedes = ref([])
const cargando = ref(false)
const guardando = ref(false)

const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const huespedSeleccionado = ref(null)

const busqueda = ref('')
const filtroEstado = ref('todos')

const mensaje = ref('')
const tipoMensaje = ref('success')

let temporizadorMensaje = null

const formularioInicial = () => ({
  nombres: '',
  apellidos: '',
  tipoDocumento: '',
  numeroDocumento: '',
  nacionalidad: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const formulario = ref(formularioInicial())

const activos = computed(() =>
  huespedes.value.filter(h => h.estado === true).length
)

const inactivos = computed(() =>
  huespedes.value.filter(h => h.estado === false).length
)

const huespedesFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return huespedes.value.filter(h => {
    const coincideBusqueda = [
      h.nombres,
      h.apellidos,
      h.numeroDocumento,
      h.telefono,
      h.correo
    ].some(valor => String(valor || '').toLowerCase().includes(texto))

    const coincideEstado =
      filtroEstado.value === 'todos' ||
      (filtroEstado.value === 'activos' && h.estado === true) ||
      (filtroEstado.value === 'inactivos' && h.estado === false)

    return coincideBusqueda && coincideEstado
  })
})

// Función central para realizar peticiones autenticadas.
async function peticion(url, opciones = {}) {
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
  let resultado = null

  try {
    resultado = texto ? JSON.parse(texto) : null
  } catch {
    resultado = texto
  }

  if (!respuesta.ok) {
    const detalle = Array.isArray(resultado?.message)
      ? resultado.message.join(', ')
      : resultado?.message || resultado?.error

    throw new Error(
      detalle || `Error del servidor (${respuesta.status}).`
    )
  }

  return resultado
}

function mostrarMensaje(texto, tipo = 'success') {
  mensaje.value = texto
  tipoMensaje.value = tipo

  if (temporizadorMensaje) {
    clearTimeout(temporizadorMensaje)
  }

  temporizadorMensaje = setTimeout(() => {
    mensaje.value = ''
  }, 4000)
}

async function cargarHuespedes() {
  cargando.value = true

  try {
    const resultado = await peticion('/huespedes')

    huespedes.value = Array.isArray(resultado)
      ? resultado
      : []
  } catch (error) {
    console.error('Error al cargar huéspedes:', error)

    mostrarMensaje(
      `No fue posible cargar los huéspedes: ${error.message}`,
      'error'
    )
  } finally {
    cargando.value = false
  }
}

function iniciales(huesped) {
  const primera = huesped.nombres?.trim().charAt(0) || ''
  const segunda = huesped.apellidos?.trim().charAt(0) || ''

  return (primera + segunda).toUpperCase()
}

function abrirNuevo() {
  modoEdicion.value = false
  huespedSeleccionado.value = null
  formulario.value = formularioInicial()
  mostrarFormulario.value = true
}

function abrirEdicion(huesped) {
  modoEdicion.value = true
  huespedSeleccionado.value = huesped

  formulario.value = {
    nombres: huesped.nombres || '',
    apellidos: huesped.apellidos || '',
    tipoDocumento: huesped.tipoDocumento || '',
    numeroDocumento: huesped.numeroDocumento || '',
    nacionalidad: huesped.nacionalidad || '',
    telefono: huesped.telefono || '',
    correo: huesped.correo || '',
    direccion: huesped.direccion || ''
  }

  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  formulario.value = formularioInicial()
  huespedSeleccionado.value = null
}

function obtenerDatos() {
  const datos = {
    nombres: formulario.value.nombres,
    apellidos: formulario.value.apellidos,
    tipoDocumento: formulario.value.tipoDocumento,
    numeroDocumento: formulario.value.numeroDocumento,
    nacionalidad: formulario.value.nacionalidad
  }

  if (formulario.value.telefono) {
    datos.telefono = formulario.value.telefono
  }

  if (formulario.value.correo) {
    datos.correo = formulario.value.correo
  }

  if (formulario.value.direccion) {
    datos.direccion = formulario.value.direccion
  }

  return datos
}

async function guardarHuesped() {
  if (guardando.value) return

  guardando.value = true

  const estabaEditando = modoEdicion.value

  try {
    const datos = obtenerDatos()

    const url = estabaEditando
      ? `/huespedes/${huespedSeleccionado.value.id}`
      : '/huespedes'

    await peticion(url, {
      method: estabaEditando ? 'PATCH' : 'POST',
      body: JSON.stringify(datos)
    })

    cerrarFormulario()
    modoEdicion.value = false

    await cargarHuespedes()

    mostrarMensaje(
      estabaEditando
        ? 'Huésped actualizado correctamente.'
        : 'Huésped registrado correctamente.'
    )
  } catch (error) {
    console.error('Error al guardar huésped:', error)

    mostrarMensaje(
      error.message || 'Ocurrió un error al guardar.',
      'error'
    )
  } finally {
    guardando.value = false
  }
}

async function cambiarEstado(huesped, nuevoEstado) {
  const accion = nuevoEstado ? 'reactivar' : 'desactivar'

  const confirmado = window.confirm(
    `¿Estás segura de que deseas ${accion} a ${huesped.nombres} ${huesped.apellidos}?`
  )

  if (!confirmado) return

  try {
    if (nuevoEstado) {
      await peticion(`/huespedes/${huesped.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: true })
      })
    } else {
      await peticion(`/huespedes/${huesped.id}`, {
        method: 'DELETE'
      })
    }

    await cargarHuespedes()

    mostrarMensaje(
      nuevoEstado
        ? 'Huésped reactivado correctamente.'
        : 'Huésped desactivado correctamente.'
    )
  } catch (error) {
    console.error('Error al cambiar estado:', error)

    mostrarMensaje(
      error.message || 'Ocurrió un error al actualizar el huésped.',
      'error'
    )
  }
}

onMounted(cargarHuespedes)
</script>

<style scoped>
.huespedes-page {
  padding: 30px;
  color: #071827;
  font-family: 'DM Sans', sans-serif;
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  color: #b08d57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  margin: 5px 0;
  color: #071827;
}

.page-header p,
.toolbar p,
.modal-header p {
  color: #82909b;
  font-size: 13px;
  margin: 0;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 9px;
  padding: 12px 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary {
  background: #071827;
  color: #00ff66;
}

.btn-primary:hover {
  background: #102b3f;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: wait;
}

.btn-secondary {
  background: #f0f2f3;
  color: #53616b;
}

.btn-secondary:hover {
  background: #e3e8eb;
}

.alert-message {
  padding: 13px 16px;
  border-radius: 9px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
}

.alert-message.success {
  background: #e9f8ef;
  color: #167341;
}

.alert-message.error {
  background: #fff0ed;
  color: #b84235;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border: 1px solid #e9edef;
  border-radius: 12px;
  padding: 21px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 3px 12px rgba(7, 24, 39, 0.025);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 11px;
  display: grid;
  place-items: center;
}

.stat-icon.blue {
  background: #e9f0f6;
  color: #16456b;
}

.stat-icon.green {
  background: #e8f8ed;
  color: #168346;
}

.stat-icon.gold {
  background: #f8f1e5;
  color: #a27c3e;
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #83909a;
  margin-bottom: 5px;
}

.stat-card strong {
  font-size: 23px;
  color: #071827;
}

.content-card {
  background: white;
  border: 1px solid #e9edef;
  border-radius: 13px;
  overflow: hidden;
  box-shadow: 0 3px 14px rgba(7, 24, 39, 0.025);
}

.toolbar {
  padding: 23px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #edf0f2;
}

.toolbar h2 {
  font-family: 'Playfair Display', serif;
  font-size: 19px;
  margin: 0 0 5px;
  color: #071827;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  height: 40px;
  border: 1px solid #e4e9ec;
  border-radius: 8px;
  color: #8b98a1;
  min-width: 220px;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  min-width: 0;
  font-size: 12px;
  color: #071827;
  background: transparent;
}

.filter-select {
  height: 40px;
  border: 1px solid #e4e9ec;
  border-radius: 8px;
  padding: 0 10px;
  background: white;
  color: #52616b;
  font-size: 12px;
  outline: none;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
}

thead {
  background: #f8fafb;
}

th {
  padding: 15px 18px;
  text-align: left;
  font-size: 10px;
  color: #82909b;
  font-weight: 800;
  letter-spacing: 0.7px;
}

td {
  padding: 15px 18px;
  border-top: 1px solid #f0f2f3;
  color: #394b58;
  font-size: 12px;
  vertical-align: middle;
}

td strong {
  display: block;
  color: #152b3b;
  font-size: 12px;
}

td small {
  display: block;
  font-size: 11px;
  margin-top: 4px;
}

.guest-cell {
  display: flex;
  align-items: center;
  gap: 11px;
}

.avatar {
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #071827;
  color: #00ff66;
  font-size: 12px;
  font-weight: 800;
}

.secondary-text {
  color: #8b98a1;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
}

.status-badge.active {
  background: #e8f8ed;
  color: #168346;
}

.status-badge.inactive {
  background: #f1f2f3;
  color: #7d8992;
}

.actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.icon-button {
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.icon-button.edit {
  background: #eaf1f7;
  color: #24577b;
}

.icon-button.deactivate {
  background: #fff0ed;
  color: #bb5548;
}

.icon-button.activate {
  background: #e8f8ed;
  color: #168346;
}

.icon-button:hover {
  transform: translateY(-2px);
  filter: brightness(0.96);
}

.table-footer {
  padding: 15px 22px;
  border-top: 1px solid #edf0f2;
  color: #8b98a1;
  font-size: 11px;
}

.empty-state {
  padding: 55px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: #9aa5ad;
}

.empty-state h3 {
  margin: 4px 0 0;
  color: #263d4d;
  font-size: 15px;
}

.empty-state p {
  margin: 0;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 17, 28, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-card {
  background: #fff;
  width: 100%;
  max-width: 650px;
  border-radius: 15px;
  padding: 27px;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.2);
  margin: auto;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-family: 'Playfair Display', serif;
  color: #071827;
  font-size: 23px;
  margin: 5px 0;
}

.close-button {
  border: none;
  background: #f0f3f4;
  color: #586975;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #344956;
  font-size: 12px;
  font-weight: 700;
}

.form-group label span,
.form-note span {
  color: #c05c4d;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e0e6e9;
  border-radius: 8px;
  padding: 11px 12px;
  color: #263d4d;
  font-size: 12px;
  outline: none;
  background: white;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #b08d57;
  box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.form-note {
  color: #89959e;
  font-size: 11px;
  margin-top: 17px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 23px;
  padding-top: 18px;
  border-top: 1px solid #edf0f2;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    width: 100%;
  }

  .search-box {
    flex: 1;
  }
}

@media (max-width: 650px) {
  .huespedes-page {
    padding: 18px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    min-height: 40px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .modal-card {
    padding: 20px;
  }
}
</style>
