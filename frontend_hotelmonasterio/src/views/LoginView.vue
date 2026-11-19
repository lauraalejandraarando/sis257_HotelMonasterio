
<template>
  <main class="login-page" @mousemove="seguirCursor">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <section class="login-card">

      <!-- LADO DE LA MASCOTA -->
      <div class="brand-section">

        <div class="brand-top">
          <span class="brand-line"></span>
          <span>HOTEL BOUTIQUE</span>
          <span class="brand-line"></span>
        </div>

        <!-- MASCOTA TOALLITA -->
        <div
          class="mascot-area"
          :class="{
            'is-password': mirandoPassword,
            'is-error': asustada,
            'is-happy': feliz
          }"
        >
          <div class="mascot-shadow"></div>

          <svg
            class="towel-ghost"
            viewBox="0 0 260 270"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="towelGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#E4EBF0"/>
              </linearGradient>

              <linearGradient id="foldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#DCE6ED"/>
              </linearGradient>

              <filter id="towelShadow">
                <feGaussianBlur stdDeviation="3"/>
              </filter>

              <clipPath id="towelClip">
                <path d="M55 65 Q55 53 70 53 H190 Q205 53 205 68
                  L211 207 Q211 229 190 231 Q130 241 70 231
                  Q49 229 49 207 Z"/>
              </clipPath>
            </defs>

            <!-- Sombra -->
            <ellipse cx="130" cy="239" rx="72" ry="9"
              fill="#000000" opacity=".18" filter="url(#towelShadow)"/>

            <!-- CUERPO DE LA TOALLA -->
            <path
              class="towel-body"
              d="M55 65 Q55 53 70 53 H190 Q205 53 205 68
                L211 207 Q211 229 190 231 Q130 241 70 231
                Q49 229 49 207 Z"
              fill="url(#towelGradient)"
              stroke="#C8D6E0"
              stroke-width="2"
            />

            <!-- TEXTURA DE ALGODÓN -->
            <g clip-path="url(#towelClip)" opacity=".35"
              stroke="#B9C9D5" stroke-width="1" fill="none">
              <path d="M60 85 H200 M58 94 H202 M57 103 H203
                M56 112 H204 M55 121 H205 M55 130 H205
                M55 139 H205 M55 148 H205 M56 157 H204
                M57 166 H203 M58 175 H202 M59 184 H201"/>

              <path d="M75 60 V225 M85 58 V227 M95 57 V228
                M105 56 V229 M115 55 V230 M125 55 V230
                M135 55 V230 M145 55 V230 M155 55 V230
                M165 56 V229 M175 57 V228 M185 58 V227"/>
            </g>

            <!-- DOBLADILLO SUPERIOR -->
            <path d="M63 69 Q130 78 197 69"
              fill="none"
              stroke="#D0DCE5"
              stroke-width="3"
              stroke-linecap="round"/>

            <!-- DOS FRANJAS AZULES -->
            <g clip-path="url(#towelClip)">
              <path d="M45 202 Q130 208 215 202"
                stroke="#315C85"
                stroke-width="5"
                fill="none"/>

              <path d="M45 213 Q130 219 215 213"
                stroke="#7196B8"
                stroke-width="4"
                fill="none"/>
            </g>

            <!-- OJITOS -->
            <g class="eyes">
              <ellipse cx="101" cy="132" rx="11" ry="15" fill="white"/>
              <ellipse cx="159" cy="132" rx="11" ry="15" fill="white"/>

              <circle :cx="101 + ojoX" :cy="132 + ojoY"
                r="7" fill="#071827"/>
              <circle :cx="159 + ojoX" :cy="132 + ojoY"
                r="7" fill="#071827"/>

              <circle :cx="104 + ojoX" :cy="129 + ojoY"
                r="2.5" fill="white"/>
              <circle :cx="162 + ojoX" :cy="129 + ojoY"
                r="2.5" fill="white"/>
            </g>

            <!-- CEJITAS DE SORPRESA -->
            <g class="surprise-brows">
              <path d="M87 109 Q100 99 113 109"
                stroke="#071827"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>

              <path d="M147 109 Q160 99 173 109"
                stroke="#071827"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>
            </g>

            <!-- BOQUITAS -->
            <path
              class="normal-mouth"
              d="M119 159 Q130 170 141 159"
              fill="none"
              stroke="#071827"
              stroke-width="3"
              stroke-linecap="round"
            />

            <ellipse
              class="scared-mouth"
              cx="130"
              cy="164"
              rx="8"
              ry="12"
              fill="#071827"
            />

            <path
              class="happy-mouth"
              d="M112 155 Q130 181 148 155"
              fill="none"
              stroke="#071827"
              stroke-width="4"
              stroke-linecap="round"
            />

            <!-- MEJILLAS -->
            <g class="cheeks">
              <ellipse cx="76" cy="157" rx="10" ry="5" fill="#F2A9A9"/>
              <ellipse cx="184" cy="157" rx="10" ry="5" fill="#F2A9A9"/>
            </g>

            <!-- ESQUINAS DOBLADAS DE LA TOALLA -->
            <g class="towel-hands">
              <path
                class="left-hand"
                d="M59 76 Q39 60 31 83 Q26 103 48 121
                  L91 145 Q103 149 106 135
                  L91 96 Q76 83 59 76 Z"
                fill="url(#foldGradient)"
                stroke="#C7D8E0"
                stroke-width="2"
              />

              <path
                class="right-hand"
                d="M201 76 Q221 60 229 83 Q234 103 212 121
                  L169 145 Q157 149 154 135
                  L169 96 Q184 83 201 76 Z"
                fill="url(#foldGradient)"
                stroke="#C7D8E0"
                stroke-width="2"
              />

              <!-- FRANJAS AZULES EN LOS DOBLECES -->
              <path d="M39 88 Q60 97 83 126"
                stroke="#315C85"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"/>

              <path d="M221 88 Q200 97 177 126"
                stroke="#315C85"
                stroke-width="4"
                fill="none"
                stroke-linecap="round"/>

              <path d="M35 97 Q57 108 77 134"
                stroke="#7196B8"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>

              <path d="M225 97 Q203 108 183 134"
                stroke="#7196B8"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>
            </g>

            <!-- ESTRELLITA -->
            <path
              class="sparkle"
              d="M224 48 L229 60 L241 65 L229 70
                L224 82 L219 70 L207 65 L219 60 Z"
              fill="#B08D57"
            />
          </svg>

          <div class="mascot-caption">
            <span v-if="asustada">¡Ups! Algo salió mal...</span>
            <span v-else-if="feliz">¡Bienvenido al Monasterio!</span>
            <span v-else-if="mirandoPassword">Shhh... tu secreto está a salvo</span>
            <span v-else>¡Hola! Te estábamos esperando</span>
          </div>
        </div>

        <div class="brand-title">
          <p class="brand-subtitle">HOSPITALIDAD · TRADICIÓN</p>
          <h1>Hotel Monasterio</h1>
          <span class="gold-line"></span>
          <p class="brand-description">
            Una experiencia de hospitalidad y tradición
            en el corazón de Sucre.
          </p>
        </div>

        <div class="brand-footer">
          <span>SUCRE</span>
          <span class="footer-dot"></span>
          <span>BOLIVIA</span>
        </div>
      </div>

      <!-- FORMULARIO -->
      <div class="form-section">

        <div class="form-heading">
          <div class="welcome-label">
            <span class="welcome-dot"></span>
            ACCESO AL SISTEMA
          </div>

          <h2>Bienvenido</h2>

          <p class="form-description">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        <form @submit.prevent="iniciarSesion">

          <div class="form-group">
            <label for="usuario">Nombre de usuario</label>

            <div class="input-wrapper">
              <span class="input-icon">♙</span>
              <input
                id="usuario"
                v-model.trim="nombreUsuario"
                type="text"
                placeholder="Tu nombre de usuario"
                autocomplete="username"
                required
                @focus="mirandoPassword = false"
                @input="limpiarError"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>

            <div class="input-wrapper">
              <span class="input-icon">⌑</span>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Tu contraseña"
                autocomplete="current-password"
                required
                @focus="mirandoPassword = true"
                @blur="mirandoPassword = false"
                @input="limpiarError"
              />
            </div>
          </div>

          <transition name="error">
            <div v-if="error" class="error-message">
              <span class="error-icon">!</span>
              {{ error }}
            </div>
          </transition>

          <button
            type="submit"
            :disabled="cargando"
            :class="{ 'button-success': feliz }"
          >
            <span v-if="cargando">Verificando acceso...</span>
            <span v-else-if="feliz">¡Bienvenido!</span>
            <span v-else>Ingresar al sistema</span>
            <span v-if="!cargando" class="button-arrow">→</span>
            <span v-else class="loader"></span>
          </button>

        </form>

        <div class="security-note">
          <span class="security-icon">◆</span>
          Acceso exclusivo para personal autorizado
        </div>

        <div class="form-bottom">
          <span class="bottom-line"></span>
          <span>HOTEL MONASTERIO</span>
          <span class="bottom-line"></span>
        </div>

      </div>
    </section>

    <footer class="page-footer">
      © HOTEL MONASTERIO · SUCRE · BOLIVIA
    </footer>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHotelStore } from '../stores/hotelStore'

const API = 'http://localhost:3000'

const router = useRouter()
const hotelStore = useHotelStore()

const nombreUsuario = ref('')
const password = ref('')
const cargando = ref(false)
const error = ref('')

const mirandoPassword = ref(false)
const asustada = ref(false)
const feliz = ref(false)

const ojoX = ref(0)
const ojoY = ref(0)

function seguirCursor(evento) {
  if (mirandoPassword.value || asustada.value || feliz.value) {
    return
  }

  const centroX = window.innerWidth / 2
  const centroY = window.innerHeight / 2

  const diferenciaX = (evento.clientX - centroX) / centroX
  const diferenciaY = (evento.clientY - centroY) / centroY

  ojoX.value = Math.max(-6, Math.min(6, diferenciaX * 6))
  ojoY.value = Math.max(-5, Math.min(5, diferenciaY * 5))
}

function limpiarError() {
  error.value = ''
  asustada.value = false
}

async function iniciarSesion() {
  error.value = ''
  asustada.value = false
  feliz.value = false
  cargando.value = true

  try {
    const respuesta = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreUsuario: nombreUsuario.value,
        password: password.value
      })
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(
        datos.message || 'Usuario o contraseña incorrectos.'
      )
    }

    hotelStore.iniciarSesion(datos.usuario, datos.access_token)

    feliz.value = true

    await new Promise(resolve => setTimeout(resolve, 800))

    await router.push('/')

  } catch (err) {
    error.value = err.message || 'No se pudo conectar con el servidor.'
    asustada.value = true
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(0, 255, 102, 0.07), transparent 35%),
    radial-gradient(ellipse at 80% 80%, rgba(176, 141, 87, 0.08), transparent 35%),
    #071827;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px 20px;
  font-family: 'DM Sans', sans-serif;
  color: #F5F0E6;
}

.ambient {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  opacity: 0.13;
}

.ambient-one {
  width: 250px;
  height: 250px;
  background: #00FF66;
  top: -100px;
  left: -80px;
}

.ambient-two {
  width: 300px;
  height: 300px;
  background: #B08D57;
  bottom: -150px;
  right: -100px;
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  min-height: 610px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  border: 1px solid rgba(176, 141, 87, 0.3);
  border-radius: 20px;
  background: #0B2030;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4);
}

/* LADO DE LA MASCOTA */

.brand-section {
  background:
    radial-gradient(ellipse at 50% 40%, rgba(0, 255, 102, 0.09), transparent 55%),
    #061A16;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  padding: 35px 40px 25px;
  border-right: 1px solid rgba(176, 141, 87, 0.16);
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #B08D57;
  font-size: 9px;
  letter-spacing: 4px;
}

.brand-line {
  width: 25px;
  height: 1px;
  background: #B08D57;
  opacity: 0.7;
}

/* MASCOTA */

.mascot-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin: 5px 0;
}

.mascot-shadow {
  position: absolute;
  width: 140px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  filter: blur(9px);
  bottom: 35px;
}

.towel-ghost {
  position: relative;
  z-index: 1;
  width: 235px;
  max-width: 100%;
  overflow: visible;
  animation: float 3.2s ease-in-out infinite;
  transform-origin: center bottom;
}

.towel-body {
  filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.15));
}

.eyes {
  transition: opacity 0.2s;
}

.towel-hands {
  opacity: 0;
  transition: opacity 0.25s;
}

.left-hand {
  transform-origin: 80px 130px;
  transition: transform 0.4s cubic-bezier(.2,.8,.2,1);
}

.right-hand {
  transform-origin: 180px 130px;
  transition: transform 0.4s cubic-bezier(.2,.8,.2,1);
}

.normal-mouth,
.scared-mouth,
.happy-mouth,
.surprise-brows,
.cheeks,
.sparkle {
  transition: opacity 0.2s, transform 0.2s;
}

.scared-mouth,
.happy-mouth,
.surprise-brows {
  opacity: 0;
}

.cheeks {
  opacity: 0.7;
}

.sparkle {
  animation: sparkle 2s ease-in-out infinite;
  transform-origin: center;
}

/* CUANDO ESCRIBE LA CONTRASEÑA */

.is-password .towel-hands {
  opacity: 1;
}

.is-password .left-hand {
  transform: translate(35px, 12px) rotate(18deg);
}

.is-password .right-hand {
  transform: translate(-35px, 12px) rotate(-18deg);
}

.is-password .eyes {
  opacity: 0.1;
}

.is-password .normal-mouth {
  opacity: 0;
}

/* CUANDO SE EQUIVOCA */

.is-error .towel-ghost {
  animation: shake 0.45s ease-in-out 2;
}

.is-error .normal-mouth,
.is-error .eyes {
  opacity: 0;
}

.is-error .scared-mouth,
.is-error .surprise-brows {
  opacity: 1;
}

.is-error .cheeks {
  opacity: 0.9;
}

/* CUANDO INGRESA CORRECTAMENTE */

.is-happy .towel-ghost {
  animation: happyJump 0.65s ease-in-out;
}

.is-happy .normal-mouth,
.is-happy .eyes {
  opacity: 0;
}

.is-happy .happy-mouth {
  opacity: 1;
}

.is-happy .cheeks {
  opacity: 1;
}

.is-happy .sparkle {
  opacity: 1;
  transform: scale(1.5);
}

.mascot-caption {
  min-height: 22px;
  margin-top: -2px;
  color: #B08D57;
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  letter-spacing: 0.3px;
}

.brand-title {
  margin-top: 5px;
}

.brand-subtitle {
  color: #00FF66;
  font-size: 9px;
  letter-spacing: 3px;
  margin: 0 0 10px;
}

.brand-title h1 {
  font-family: 'Playfair Display', serif;
  font-size: 33px;
  font-weight: 500;
  margin: 0;
  color: #F5F0E6;
}

.gold-line {
  display: block;
  width: 48px;
  height: 2px;
  background: #B08D57;
  margin: 17px auto;
}

.brand-description {
  max-width: 270px;
  color: #AABBB3;
  font-size: 12px;
  line-height: 1.8;
}

.brand-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #71877D;
  font-size: 9px;
  letter-spacing: 3px;
}

.footer-dot {
  width: 4px;
  height: 4px;
  background: #B08D57;
  border-radius: 50%;
}

/* FORMULARIO */

.form-section {
  padding: 65px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-label {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #00FF66;
  font-size: 9px;
  letter-spacing: 3px;
  font-weight: 700;
  margin-bottom: 15px;
}

.welcome-dot {
  width: 7px;
  height: 7px;
  background: #00FF66;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 102, 0.6);
}

.form-heading h2 {
  font-family: 'Playfair Display', serif;
  font-size: 37px;
  font-weight: 500;
  margin: 0;
  color: #F5F0E6;
}

.form-description {
  color: #91A1AA;
  font-size: 13px;
  margin: 12px 0 38px;
}

.form-group {
  margin-bottom: 23px;
}

.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #E5E8E4;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #29404D;
  border-radius: 8px;
  background: #071827;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrapper:focus-within {
  border-color: #00D957;
  box-shadow: 0 0 0 3px rgba(0, 255, 102, 0.07);
}

.input-icon {
  width: 42px;
  text-align: center;
  color: #B08D57;
  font-size: 20px;
}

.input-wrapper input {
  width: 100%;
  box-sizing: border-box;
  padding: 15px 14px 15px 0;
  border: none;
  outline: none;
  background: transparent;
  color: #F5F0E6;
  font-size: 13px;
}

.input-wrapper input::placeholder {
  color: #71818A;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(220, 65, 65, 0.12);
  border: 1px solid rgba(220, 65, 65, 0.4);
  border-radius: 7px;
  color: #FF9999;
  font-size: 12px;
  padding: 12px;
  margin: 4px 0 12px;
}

.error-icon {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 1px solid #FF9999;
  border-radius: 50%;
  font-weight: 700;
}

.error-enter-active,
.error-leave-active {
  transition: all 0.2s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: none;
  border-radius: 8px;
  background: #00E85D;
  color: #061A16;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 9px;
}

button:hover:not(:disabled) {
  background: #00FF66;
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 255, 102, 0.17);
}

button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.button-arrow {
  font-size: 19px;
  line-height: 12px;
}

.button-success {
  background: #B08D57;
  color: #071827;
}

.loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(6, 26, 22, 0.3);
  border-top-color: #061A16;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #71818A;
  font-size: 10px;
  text-align: center;
  margin-top: 28px;
}

.security-icon {
  color: #B08D57;
  font-size: 8px;
}

.form-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #61747D;
  font-size: 8px;
  letter-spacing: 3px;
  margin-top: 40px;
}

.bottom-line {
  height: 1px;
  width: 25px;
  background: #29404D;
}

.page-footer {
  position: relative;
  z-index: 1;
  color: #71818A;
  font-size: 9px;
  letter-spacing: 3px;
  margin-top: 25px;
  text-align: center;
}

/* ANIMACIONES */

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-9px) rotate(1deg);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-7px) rotate(-4deg);
  }
  50% {
    transform: translateX(7px) rotate(4deg);
  }
  75% {
    transform: translateX(-5px) rotate(-3deg);
  }
}

@keyframes happyJump {
  0%, 100% {
    transform: translateY(0) rotate(0);
  }
  35% {
    transform: translateY(-22px) rotate(-5deg);
  }
  70% {
    transform: translateY(-8px) rotate(5deg);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE */

@media (max-width: 750px) {
  .login-page {
    padding: 20px 14px;
  }

  .login-card {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .brand-section {
    padding: 25px 25px 20px;
  }

  .towel-ghost {
    width: 175px;
  }

  .mascot-shadow {
    bottom: 25px;
  }

  .brand-title h1 {
    font-size: 28px;
  }

  .brand-description {
    margin-bottom: 5px;
  }

  .brand-footer {
    margin-top: 15px;
  }

  .form-section {
    padding: 38px 28px;
  }

  .form-heading h2 {
    font-size: 32px;
  }

  .form-bottom {
    margin-top: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
