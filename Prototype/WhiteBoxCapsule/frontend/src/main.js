import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/style.css'
import './assets/css/prism-line-numbers.css'

import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap'

import CodeBlock from 'vue3-code-block'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Challenge from './pages/Challenge.vue'
import Home from './pages/Home.vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrophy, faListCheck, faAward, faClock, faEdit } from '@fortawesome/free-solid-svg-icons'

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import './store/utils.js'
import axios from 'axios'

library.add(faTrophy, faListCheck, faAward, faClock, faEdit)

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.config.globalProperties.$api_link = (
  import.meta.env.MODE == 'development' ? 
  import.meta.env.VITE_API_LINK_LOCAL : 
  import.meta.env.VITE_API_LINK_REMOTE
);

const options = {
  position: POSITION.BOTTOM_LEFT,
  timeout: 7000
};

app.use(Toast, options);


const routes = [
  { name: 'home', path: '', component: Home },
  { name: 'how-to', path: '/how-to', component: () => import('./pages/HowToPlay.vue') },
  { name: 'credits', path: '/about', component: () => import('./pages/GameCredits.vue') },
  { name: 'challenges', path: '/challenges', component: () => import('./pages/ChallengesMenu.vue') },
  { name: 'challenge', path: '/challenge/:id', component: Challenge, props: true },
  { name: 'challenge-creator', path: '/create-challenge', component: () => import('./pages/ChallengeCreator.vue') },
]

app.config.globalProperties.$axios = axios;

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes
})

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component('CodeBlock', CodeBlock).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
