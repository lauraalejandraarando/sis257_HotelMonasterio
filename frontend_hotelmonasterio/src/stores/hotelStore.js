
import { defineStore } from 'pinia'

export const useHotelStore = defineStore('hotel', {
  state: () => {
    const usuarioGuardado = sessionStorage.getItem('hotel_usuario')
    const tokenGuardado = sessionStorage.getItem('hotel_token')

    let usuario = null

    try {
      usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null
    } catch {
      sessionStorage.removeItem('hotel_usuario')
    }

    return {
      nombreHotel: 'Hotel Monasterio',
      ciudad: 'Sucre',
      pais: 'Bolivia',
      moneda: 'Bs',
      usuario,
      token: tokenGuardado || null,
      autenticado: Boolean(usuario && tokenGuardado)
    }
  },

  actions: {
    iniciarSesion(usuario, token) {
      this.usuario = usuario
      this.token = token
      this.autenticado = true

      sessionStorage.setItem(
        'hotel_usuario',
        JSON.stringify(usuario)
      )

      sessionStorage.setItem('hotel_token', token)
    },

    cerrarSesion() {
      this.usuario = null
      this.token = null
      this.autenticado = false

      sessionStorage.removeItem('hotel_usuario')
      sessionStorage.removeItem('hotel_token')
    }
  }
})
