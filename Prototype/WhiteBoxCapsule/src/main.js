import './assets/css/main.css'
import './assets/css/prism.css'
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.css'

import CodeBlock from 'vue3-code-block'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import ChallengeTest from './pages/ChallengeTest.vue'
import Menu from './pages/Menu.vue'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Menu },
  { path: '/challenge/test', component: ChallengeTest },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})


app.use(router)
app.component('CodeBlock', CodeBlock).mount('#app')
