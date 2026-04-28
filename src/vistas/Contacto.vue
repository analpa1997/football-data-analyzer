<template>
  <div class="contenedor-pagina">
    <h1>Contacto</h1>
    
    <section class="seccion-introduccion">
      <p>
        Nos encantaría saber de ti. Completa el formulario a continuación
        y nos pondremos en contacto lo antes posible.
      </p>
    </section>

    <section class="formulario-seccion">
      <form class="formulario" @submit.prevent="enviarFormulario">
        <div class="campo-grupo">
          <label for="nombre" class="etiqueta">Nombre *</label>
          <input
            id="nombre"
            v-model="formulario.nombre"
            type="text"
            class="entrada"
            placeholder="Tu nombre completo"
            required
          >
        </div>

        <div class="campo-grupo">
          <label for="correo" class="etiqueta">Correo Electrónico *</label>
          <input
            id="correo"
            v-model="formulario.correo"
            type="email"
            class="entrada"
            placeholder="tu@email.com"
            required
          >
        </div>

        <div class="campo-grupo">
          <label for="asunto" class="etiqueta">Asunto *</label>
          <input
            id="asunto"
            v-model="formulario.asunto"
            type="text"
            class="entrada"
            placeholder="¿Cuál es tu consulta?"
            required
          >
        </div>

        <div class="campo-grupo">
          <label for="mensaje" class="etiqueta">Mensaje *</label>
          <textarea
            id="mensaje"
            v-model="formulario.mensaje"
            class="area-texto"
            placeholder="Cuéntanos más sobre tu consulta..."
            rows="6"
            required
          ></textarea>
        </div>

        <button type="submit" class="boton-enviar" :disabled="enviando">
          {{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}
        </button>

        <div v-if="mensajeExito" class="mensaje-exito">
          ✓ Gracias por tu mensaje. Nos pondremos en contacto pronto.
        </div>

        <div v-if="mensajeError" class="mensaje-error">
          ✗ Hubo un problema. Por favor, intenta más tarde.
        </div>
      </form>
    </section>

    <section class="seccion-informacion">
      <h2>Otros Medios de Contacto</h2>
      
      <div class="grid-contacto">
        <div class="contacto-card">
          <div class="icono">📧</div>
          <h3>Email</h3>
          <p><a href="mailto:info@footballanalyzer.com">info@footballanalyzer.com</a></p>
        </div>

        <div class="contacto-card">
          <div class="icono">💬</div>
          <h3>Chat en Vivo</h3>
          <p>Disponible de lunes a viernes, 9 AM - 6 PM</p>
        </div>

        <div class="contacto-card">
          <div class="icono">🐙</div>
          <h3>GitHub</h3>
          <p><a href="https://github.com/analpa1997" target="_blank">Síguenos en GitHub</a></p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Formulario {
  nombre: string
  correo: string
  asunto: string
  mensaje: string
}

const formulario = ref<Formulario>({
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: ''
})

const enviando = ref(false)
const mensajeExito = ref(false)
const mensajeError = ref(false)

const enviarFormulario = async () => {
  enviando.value = true
  mensajeExito.value = false
  mensajeError.value = false

  try {
    // Simulamos envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Formulario enviado:', formulario.value)
    
    // Limpiamos formulario
    formulario.value = {
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: ''
    }
    
    mensajeExito.value = true
    
    // Ocultamos mensaje después de 5 segundos
    setTimeout(() => {
      mensajeExito.value = false
    }, 5000)
  } catch (error) {
    console.error('Error al enviar:', error)
    mensajeError.value = true
    setTimeout(() => {
      mensajeError.value = false
    }, 5000)
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.contenedor-pagina {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--color-secondary);
  font-size: 2.5rem;
  margin: 0 0 2rem 0;
  text-align: center;
}

h2 {
  color: var(--color-secondary);
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
}

.seccion-introduccion {
  text-align: center;
  margin-bottom: 2rem;
}

.seccion-introduccion p {
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.formulario-seccion {
  background-color: var(--color-primary);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.campo-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.etiqueta {
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.95rem;
}

.entrada,
.area-texto {
  padding: 0.75rem;
  border: 1px solid var(--color-secondary);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--color-text);
  background-color: transparent;
  transition: all 0.3s ease;
}

.entrada:focus,
.area-texto:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.area-texto {
  resize: vertical;
}

.boton-enviar {
  background-color: var(--color-accent);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.boton-enviar:hover:not(:disabled) {
  background-color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.boton-enviar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mensaje-exito,
.mensaje-error {
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
}

.mensaje-exito {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(34, 197, 94);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.mensaje-error {
  background-color: rgba(239, 68, 68, 0.1);
  color: rgb(239, 68, 68);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.seccion-informacion {
  margin-top: 4rem;
}

.grid-contacto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contacto-card {
  background-color: var(--color-primary);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.contacto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.icono {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contacto-card h3 {
  color: var(--color-secondary);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.contacto-card p {
  color: var(--color-text);
  margin: 0;
  line-height: 1.5;
}

.contacto-card a {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.contacto-card a:hover {
  color: var(--color-secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .contenedor-pagina {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .formulario-seccion {
    padding: 1.5rem;
  }

  .grid-contacto {
    grid-template-columns: 1fr;
  }
}
</style>
