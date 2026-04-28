<script setup>
import { ref } from 'vue'
import vueLogo from '../assets/vue.svg'

const message = ref('¡Hola Mundo!')
</script>

<template>
  <div class="hello-world-container">
    <div class="logo-container">
      <img :src="vueLogo" alt="Vue logo" class="vue-logo" />
    </div>
    <h1 class="greeting">{{ message }}</h1>
    <p class="subtitle">Bienvenido a Vue 3 + Vite</p>
    <div class="color-palette">
      <div class="color-row">
        <div class="color-box color-1"></div>
        <div class="color-box color-2"></div>
        <div class="color-box color-3"></div>
        <div class="color-box color-4"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hello-world-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.logo-container {
  margin-bottom: 1rem;
}

.vue-logo {
  height: 8rem;
  width: auto;
  filter: drop-shadow(0 0 2em var(--color-accent));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.greeting {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text);
  text-shadow: 0 2px 10px var(--color-shadow);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.2rem;
  margin: 0;
  color: var(--color-secondary);
  font-weight: 500;
}

.color-palette {
  margin-top: 2rem;
}

.color-row {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.color-box {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.color-box:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.color-1 {
  background-color: var(--color-primary);
  border: 2px solid var(--color-text);
}

.color-2 {
  background-color: var(--color-secondary);
}

.color-3 {
  background-color: var(--color-accent);
}

.color-4 {
  background-color: var(--color-shadow);
}
</style>
