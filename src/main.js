import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import enrutador from './enrutador'

const app = createApp(App)

app.use(enrutador)
app.mount('#app')
