import './assets/css/main.css'
import './assets/css/prism.css'
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.css'

import CodeBlock from 'vue3-code-block'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { boardStore } from './store/boardStore'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('CodeBlock', CodeBlock).mount('#app')
