
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHotelStore } from '../stores/hotelStore'
import {
  Users, UserPlus, Search, ShieldCheck, UserCheck,
  UserX, Pencil, Power, X, Save, RefreshCw,
  Mail, Lock, User, AlertCircle
} from 'lucide-vue-next'

const API = 'http://localhost:3000'
const hotelStore = useHotelStore()

const usuarios = ref([])
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')
const busqueda = ref('')
const filtroEstado = ref('todos')
const filtroRol = ref('todos')

const modalAbierto = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)

const usuarioVacio = () => ({
  nombreUsuario: '',
  password: '',
  nombres: '',
  apellidos: '',
  correo: '',
  rol: 'recepcion'
})

const formulario = ref(usuarioVacio())
const usuarioId = ref(null)

const totalUsuarios = computed(() => usuarios.value.length)

const usuariosActivos = computed(() =>
  usuarios.value.filter(u => u.activo).length
)

const usuariosInactivos = computed(() =>
  usuarios.value.filter(u => !u.activo).length
)

const administradores = computed(() =>
  usuarios.value.filter(u => u.rol === 'administrador' && u.activo).length
)

const usuariosFiltrados = computed(() => {
  const texto = busqueda.value.toLowerCase().trim()

  return usuarios.value.filter(usuario => {
    const nombreCompleto =
      `${usuario.nombres || ''} ${usuario.apellidos || ''}`.toLowerCase()

    const coincideTexto =
      !texto ||
      nombreCompleto.includes(texto) ||
      (usuario.nombreUsuario || '').toLowerCase().includes(texto) ||
      (usuario.correo || '').toLowerCase().includes(texto)

    const coincideEstado =
      filtroEstado.value === 'todos' ||
      (filtroEstado.value === 'activos' && usuario.activo) ||
      (filtroEstado.value === 'inactivos' && !usuario.activo)

    const coincideRol =
      filtroRol.value === 'todos' || usuario.rol === filtroRol.value

    return coincideTexto && coincideEstado && coincideRol
  })
})

async function consultar(url, opciones = {}) {
  const respuesta = await fetch(`${API}${url}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${hotelStore.token}`,
      ...(opciones.headers || {})
    }
  })

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const detalle = Array.isArray(datos?.message)
      ? datos.message.join(', ')
      : datos?.message

    throw new Error(detalle || 'No se pudo completar la operación')
  }

  return datos
}

async function cargarUsuarios() {
  cargando.value = true
  error.value = ''

  try {
    const datos = await consultar('/usuarios')
    usuarios.value = Array.isArray(datos) ? datos : []
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirNuevo() {
  modoEdicion.value = false
  usuarioId.value = null
  formulario.value = usuarioVacio()
  mensaje.value = ''
  error.value = ''
  modalAbierto.value = true
}

function abrirEditar(usuario) {
  modoEdicion.value = true
  usuarioId.value = usuario.id

  formulario.value = {
    nombreUsuario: usuario.nombreUsuario || '',
    password: '',
    nombres: usuario.nombres || '',
    apellidos: usuario.apellidos || '',
    correo: usuario.correo || '',
    rol: usuario.rol || 'recepcion'
  }

  mensaje.value = ''
  error.value = ''
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
  formulario.value = usuarioVacio()
  usuarioId.value = null
}

async function guardarUsuario() {
  mensaje.value = ''
  error.value = ''

  if (
    !formulario.value.nombreUsuario.trim() ||
    !formulario.value.nombres.trim() ||
    !formulario.value.apellidos.trim() ||
    !formulario.value.correo.trim()
  ) {
    error.value = 'Completa todos los campos obligatorios.'
    return
  }

  if (!modoEdicion.value && formulario.value.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  if (
    modoEdicion.value &&
    formulario.value.password &&
    formulario.value.password.length < 8
  ) {
    error.value = 'La nueva contraseña debe tener al menos 8 caracteres.'
    return
  }

  guardando.value = true

  try {
    const datos = {
      nombreUsuario: formulario.value.nombreUsuario.trim(),
      nombres: formulario.value.nombres.trim(),
      apellidos: formulario.value.apellidos.trim(),
      correo: formulario.value.correo.trim(),
      rol: formulario.value.rol
    }

    if (!modoEdicion.value || formulario.value.password) {
      datos.password = formulario.value.password
    }

    if (modoEdicion.value) {
      await consultar(`/usuarios/${usuarioId.value}`, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      })

      mensaje.value = 'Usuario actualizado correctamente.'
    } else {
      await consultar('/usuarios', {
        method: 'POST',
        body: JSON.stringify(datos)
      })

      mensaje.value = 'Usuario registrado correctamente.'
    }

    cerrarModal()
    await cargarUsuarios()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}

async function cambiarEstado(usuario) {
  const accion = usuario.activo ? 'desactivar' : 'reactivar'

  if (!window.confirm(
    `¿Estás seguro de que deseas ${accion} a ${usuario.nombres}?`
  )) return

  error.value = ''
  mensaje.value = ''

  try {
    if (usuario.activo) {
      await consultar(`/usuarios/${usuario.id}`, {
        method: 'DELETE'
      })

      mensaje.value = 'Usuario desactivado correctamente.'
    } else {
      await consultar(`/usuarios/${usuario.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ activo: true })
      })

      mensaje.value = 'Usuario reactivado correctamente.'
    }

    await cargarUsuarios()
  } catch (e) {
    error.value = e.message
  }
}

function nombreRol(rol) {
  const roles = {
    administrador: 'Administrador',
    recepcion: 'Recepción',
    gerencia: 'Gerencia'
  }

  return roles[rol] || rol || 'Sin rol'
}

function fecha(valor) {
  if (!valor) return 'Sin registro'

  return new Date(valor).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(cargarUsuarios)
</script>

<template>
  <section class="usuarios-page">
    <header class="page-header">
      <div>
        <span class="eyebrow">ADMINISTRACIÓN DEL HOTEL</span>
        <h1>Usuarios y roles</h1>
        <p>Gestiona las cuentas de acceso y los permisos del personal.</p>
      </div>

      <button class="btn-primary" @click="abrirNuevo">
        <UserPlus :size="18" />
        Nuevo usuario
      </button>
    </header>

    <div v-if="mensaje" class="alert success">
      <ShieldCheck :size="18" />
      {{ mensaje }}
      <button @click="mensaje = ''"><X :size="16" /></button>
    </div>

    <div v-if="error" class="alert danger">
      <AlertCircle :size="18" />
      {{ error }}
      <button @click="error = ''"><X :size="16" /></button>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon blue"><Users :size="21" /></div>
        <div>
          <span>Total de usuarios</span>
          <strong>{{ totalUsuarios }}</strong>
          <small>Cuentas registradas</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon green"><UserCheck :size="21" /></div>
        <div>
          <span>Usuarios activos</span>
          <strong>{{ usuariosActivos }}</strong>
          <small>Con estado activo</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon gold"><ShieldCheck :size="21" /></div>
        <div>
          <span>Administradores</span>
          <strong>{{ administradores }}</strong>
          <small>Con rol administrador</small>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon red"><UserX :size="21" /></div>
        <div>
          <span>Usuarios inactivos</span>
          <strong>{{ usuariosInactivos }}</strong>
          <small>Cuentas desactivadas</small>
        </div>
      </article>
    </div>

    <div class="directory-card">
      <div class="directory-heading">
        <div>
          <h2>Directorio de usuarios</h2>
          <p>Consulta y administra las cuentas del sistema.</p>
        </div>

        <button class="btn-refresh" @click="cargarUsuarios" :disabled="cargando">
          <RefreshCw :size="16" :class="{ girando: cargando }" />
          Actualizar
        </button>
      </div>

      <div class="filters">
        <div class="search-box">
          <Search :size="18" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por nombre, usuario o correo..."
          />
        </div>

        <select v-model="filtroEstado">
          <option value="todos">Todos los estados</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>

        <select v-model="filtroRol">
          <option value="todos">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="recepcion">Recepción</option>
          <option value="gerencia">Gerencia</option>
        </select>
      </div>

      <div v-if="cargando" class="empty-state">
        <RefreshCw :size="26" class="girando" />
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="usuariosFiltrados.length === 0" class="empty-state">
        <Users :size="32" />
        <strong>No se encontraron usuarios</strong>
        <p>Prueba con otro término o registra un nuevo usuario.</p>
      </div>

      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>DATOS PERSONALES</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>REGISTRO</th>
              <th class="right">ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
              <td>
                <div class="user-cell">
                  <div class="avatar">
                    {{ (usuario.nombres || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <strong>{{ usuario.nombreUsuario }}</strong>
                    <small>ID #{{ usuario.id }}</small>
                  </div>
                </div>
              </td>

              <td>
                <div class="personal-cell">
                  <strong>{{ usuario.nombres }} {{ usuario.apellidos }}</strong>
                  <small><Mail :size="13" /> {{ usuario.correo }}</small>
                </div>
              </td>

              <td>
                <span class="role-badge" :class="usuario.rol">
                  {{ nombreRol(usuario.rol) }}
                </span>
              </td>

              <td>
                <span class="status-badge" :class="usuario.activo ? 'active' : 'inactive'">
                  <span></span>
                  {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <td class="date-cell">{{ fecha(usuario.fechaCreacion) }}</td>

              <td>
                <div class="actions">
                  <button
                    class="action-btn edit"
                    title="Editar usuario"
                    @click="abrirEditar(usuario)"
                  >
                    <Pencil :size="16" />
                  </button>

                  <button
                    class="action-btn"
                    :class="usuario.activo ? 'deactivate' : 'activate'"
                    :title="usuario.activo ? 'Desactivar' : 'Reactivar'"
                    @click="cambiarEstado(usuario)"
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
        Mostrando {{ usuariosFiltrados.length }} de {{ totalUsuarios }} usuarios
      </div>
    </div>

    <div v-if="modalAbierto" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <span class="eyebrow">GESTIÓN DE CUENTAS</span>
            <h2>{{ modoEdicion ? 'Editar usuario' : 'Registrar usuario' }}</h2>
            <p>
              {{ modoEdicion
                ? 'Modifica los datos de la cuenta seleccionada.'
                : 'Completa los datos para crear una nueva cuenta.' }}
            </p>
          </div>

          <button class="close-btn" @click="cerrarModal">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="guardarUsuario">
          <div class="form-grid">
            <div class="form-field">
              <label>Nombre de usuario *</label>
              <div class="input-wrap">
                <User :size="17" />
                <input
                  v-model="formulario.nombreUsuario"
                  type="text"
                  maxlength="50"
                  placeholder="Ej. recepcion01"
                  required
                />
              </div>
            </div>

            <div class="form-field">
              <label>Correo electrónico *</label>
              <div class="input-wrap">
                <Mail :size="17" />
                <input
                  v-model="formulario.correo"
                  type="email"
                  maxlength="120"
                  placeholder="usuario@hotel.com"
                  required
                />
              </div>
            </div>

            <div class="form-field">
              <label>Nombres *</label>
              <input
                v-model="formulario.nombres"
                type="text"
                placeholder="Nombres"
                required
              />
            </div>

            <div class="form-field">
              <label>Apellidos *</label>
              <input
                v-model="formulario.apellidos"
                type="text"
                placeholder="Apellidos"
                required
              />
            </div>

            <div class="form-field full">
              <label>
                {{ modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña *' }}
              </label>
              <div class="input-wrap">
                <Lock :size="17" />
                <input
                  v-model="formulario.password"
                  type="password"
                  :required="!modoEdicion"
                  minlength="8"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <small v-if="modoEdicion">
                Déjala vacía si no deseas cambiar la contraseña.
              </small>
            </div>

            <div class="form-field full">
              <label>Rol del usuario *</label>
              <select v-model="formulario.rol" required>
                <option value="administrador">Administrador</option>
                <option value="recepcion">Recepción</option>
                <option value="gerencia">Gerencia</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="cerrarModal">
              Cancelar
            </button>

            <button type="submit" class="btn-primary" :disabled="guardando">
              <Save :size="17" />
              {{ guardando ? 'Guardando...' : 'Guardar usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.usuarios-page {
  color: #071827;
  display: flex;
  flex-direction: column;
  gap: 25px;
  font-family: 'DM Sans', sans-serif;
}

.page-header, .directory-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.eyebrow {
  color: #b08d57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.page-header h1 {
  margin: 7px 0;
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  color: #071827;
}

.page-header p, .directory-heading p, .modal-header p {
  margin: 0;
  color: #71808c;
  font-size: 13px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 18px;
  background: #071827;
  color: #00ff66;
  border: 1px solid #071827;
  border-radius: 9px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.btn-primary:hover {
  background: #0c2a3d;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 9px;
  font-size: 13px;
}

.alert button {
  margin-left: auto;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.success {
  background: #e9f8ef;
  color: #14733b;
}

.danger {
  background: #fff0ef;
  color: #b42318;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 19px;
  background: #fff;
  border: 1px solid #e8edf0;
  border-radius: 13px;
  box-shadow: 0 3px 12px #07182708;
}

.stat-icon {
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
}

.stat-icon.blue { background: #e9f0f7; color: #245b82; }
.stat-icon.green { background: #e7f8ed; color: #15964b; }
.stat-icon.gold { background: #f7f0e5; color: #a17b3e; }
.stat-icon.red { background: #fff0ef; color: #c45b52; }

.stat-card span, .stat-card small {
  display: block;
  color: #788590;
  font-size: 11px;
}

.stat-card strong {
  display: block;
  margin: 3px 0;
  color: #071827;
  font-size: 24px;
}

.directory-card {
  background: #fff;
  border: 1px solid #e8edf0;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 3px 14px #07182708;
}

.directory-heading h2 {
  margin: 0 0 6px;
  font-family: 'Playfair Display', serif;
  font-size: 20px;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #dce4e8;
  background: #fff;
  color: #334b5b;
  border-radius: 8px;
  cursor: pointer;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 180px 180px;
  gap: 12px;
  margin: 22px 0;
}

.search-box, .input-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  border: 1px solid #dce4e8;
  border-radius: 8px;
  color: #82909a;
  background: #fff;
}

.search-box input, .input-wrap input {
  width: 100%;
  border: 0;
  outline: none;
  padding: 11px 0;
  color: #071827;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.filters select, .form-field > input, .form-field > select {
  width: 100%;
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid #dce4e8;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #071827;
  font: inherit;
  font-size: 13px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 13px 12px;
  background: #f6f8f8;
  color: #77848d;
  font-size: 10px;
  letter-spacing: .8px;
  font-weight: 800;
  white-space: nowrap;
}

td {
  padding: 15px 12px;
  border-bottom: 1px solid #edf0f2;
  font-size: 12px;
  color: #354b59;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #071827;
  color: #00ff66;
  font-weight: 800;
}

.user-cell strong, .personal-cell strong {
  display: block;
  color: #071827;
  font-size: 12px;
}

.user-cell small, .personal-cell small {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  color: #84919a;
  font-size: 11px;
}

.role-badge, .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.role-badge.administrador { background: #f7f0e5; color: #94703a; }
.role-badge.recepcion { background: #e9f0f7; color: #245b82; }
.role-badge.gerencia { background: #e9f7ef; color: #16834a; }

.status-badge.active { background: #e9f8ef; color: #16834a; }
.status-badge.inactive { background: #f1f2f3; color: #737d84; }

.status-badge span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.date-cell { white-space: nowrap; color: #75838d; }
.right { text-align: right; }

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 7px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid #e1e7ea;
  border-radius: 7px;
  background: #fff;
  cursor: pointer;
}

.action-btn.edit { color: #245b82; }
.action-btn.deactivate { color: #c45b52; }
.action-btn.activate { color: #15964b; }

.action-btn:hover { background: #f4f7f8; }

.table-footer {
  padding-top: 15px;
  color: #87939b;
  font-size: 11px;
}

.empty-state {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #81909a;
  text-align: center;
}

.empty-state strong { color: #334b5b; }
.empty-state p { margin: 0; font-size: 12px; }

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #071827a8;
  backdrop-filter: blur(4px);
}

.modal-card {
  width: min(600px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  padding: 25px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 20px 60px #0003;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 23px;
}

.modal-header h2 {
  margin: 6px 0;
  font-family: 'Playfair Display', serif;
  font-size: 23px;
}

.close-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #f1f4f5;
  color: #52636d;
  cursor: pointer;
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
  min-width: 0;
}

.form-field.full { grid-column: 1 / -1; }

.form-field label {
  color: #334b5b;
  font-size: 12px;
  font-weight: 700;
}

.form-field small {
  color: #84919a;
  font-size: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  padding-top: 18px;
  border-top: 1px solid #edf0f2;
}

.btn-cancel {
  padding: 11px 16px;
  border: 1px solid #dce4e8;
  border-radius: 8px;
  background: #fff;
  color: #52636d;
  cursor: pointer;
}

.girando { animation: girar 1s linear infinite; }

@keyframes girar {
  to { transform: rotate(360deg); }
}

@media (max-width: 1000px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .filters { grid-template-columns: 1fr 1fr; }
  .search-box { grid-column: 1 / -1; }
}

@media (max-width: 600px) {
  .page-header, .directory-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid { grid-template-columns: 1fr 1fr; }
  .filters { grid-template-columns: 1fr; }
  .search-box { grid-column: auto; }
  .form-grid { grid-template-columns: 1fr; }
  .form-field.full { grid-column: auto; }
  .modal-card { padding: 19px; }
}
</style>
