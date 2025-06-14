import './utils/rem.js'
import 'vant/lib/index.css'
import './assets/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
const app = createApp(App)

app.use(createPinia()).use(router)

app.mount('#app')
