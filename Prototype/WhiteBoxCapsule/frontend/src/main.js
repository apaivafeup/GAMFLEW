import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/style.css'
import './assets/css/prism-line-numbers.css'

import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap'

import CodeBlock from 'vue3-code-block'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import Challenge from './pages/Challenge.vue'
import Home from './pages/Home.vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrophy, faListCheck, faAward, faClock } from '@fortawesome/free-solid-svg-icons'

import './store/utils.js'

/* add icons to the library */
library.add(faTrophy, faListCheck, faAward, faClock)

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home },
  { path: '/challenge/:id', component: Challenge, props: true }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('CodeBlock', CodeBlock).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
