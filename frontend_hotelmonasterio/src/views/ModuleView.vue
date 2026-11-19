
<script setup>
import { useRoute } from 'vue-router'
import { Hotel } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <section class="module-page">
    <div class="module-heading">
      <div class="module-icon">
        <Hotel :size="30" />
      </div>

      <div>
        <span class="eyebrow">HOTEL MONASTERIO · SUCRE</span>
        <h1>{{ route.meta.titulo }}</h1>
        <p>{{ route.meta.descripcion }}</p>
      </div>
    </div>

    <div class="module-content">
      <div class="content-icon">
        <Hotel :size="32" />
      </div>

      <h2>Módulo en preparación</h2>

      <p>
        Estamos preparando las herramientas de gestión de este apartado.
        Próximamente podrás trabajar desde aquí con la información del hotel.
      </p>
    </div>
  </section>
</template>

<style scoped>
.module-page {
  color: #071827;
}

.module-heading {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 30px;
}

.module-icon,
.content-icon {
  display: grid;
  place-items: center;
  background: #071827;
  color: #00FF66;
  border: 1px solid rgba(0,255,102,0.3);
  border-radius: 14px;
}

.module-icon {
  width: 65px;
  height: 65px;
  flex-shrink: 0;
}

.eyebrow {
  color: #B08D57;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 27px;
  margin: 5px 0;
  color: #071827;
}

.module-heading p {
  color: #718078;
  font-size: 13px;
  margin: 0;
}

.module-content {
  min-height: 300px;
  padding: 45px 25px;
  border: 1px solid rgba(7,24,39,0.12);
  border-radius: 16px;
  background: rgba(255,255,255,0.75);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.content-icon {
  width: 65px;
  height: 65px;
  margin-bottom: 15px;
}

.module-content h2 {
  font-family: 'Playfair Display', serif;
  color: #071827;
  font-size: 21px;
}

.module-content p {
  max-width: 430px;
  color: #718078;
  font-size: 13px;
  line-height: 1.7;
}
</style>
