import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/style.css'
import './assets/css/prism-line-numbers.css'

import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap'

import CodeBlock from 'vue3-code-block'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { Router } from './router.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrophy, faListCheck, faAward, faClock, faEdit, faCrown, faPlus, faTrash, faCoins, faXmark } from '@fortawesome/free-solid-svg-icons'

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import './store/utils.js'
import axios from 'axios'

import VueHighlightJS from 'vue3-highlightjs'

import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

library.add(faTrophy, faListCheck, faAward, faClock, faEdit, faCrown, faPlus, faTrash, faCoins, faXmark)

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(VueHighlightJS)
app.config.globalProperties.$api_link = (
  import.meta.env.MODE == 'development' ? 
  import.meta.env.VITE_API_LINK_LOCAL : 
  import.meta.env.VITE_API_LINK_REMOTE
);

const options = {
  position: POSITION.BOTTOM_LEFT,
  timeout: 3000
};

app.use(Toast, options);

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$http_names = {
  '200' : 'OK',
  '201' : 'Created',
  '202' : 'Accepted',
  '203' : 'Non-Authoritative Information',
  '204' : 'No Content',
  '205' : 'Reset Content',
  '206' : 'Partial Content',
  '300' : 'Multiple Choices',
  '301' : 'Moved Permanently',
  '302' : 'Found',
  '303' : 'See Other',
  '304' : 'Not Modified',
  '305' : 'Use Proxy',
  '307' : 'Temporary Redirect',
  '400' : 'Bad Request',
  '401' : 'Unauthorized',
  '402' : 'Payment Required',
  '403' : 'Forbidden',
  '404' : 'Not Found',
  '405' : 'Method Not Allowed',
  '406' : 'Not Acceptable',
  '407' : 'Proxy Authentication Required',
  '408' : 'Request Timeout',
  '409' : 'Conflict',
  '410' : 'Gone',
  '411' : 'Length Required',
  '412' : 'Precondition Failed',
  '413' : 'Request Entity Too Large',
  '414' : 'Request-URI Too Long',
  '415' : 'Unsupported Media Type',
  '416' : 'Requested Range Not Satisfiable',
  '417' : 'Expectation Failed',
  '500' : 'Internal Server Error',
  '501' : 'Not Implemented',
  '502' : 'Bad Gateway',
  '503' : 'Service Unavailable',
  '504' : 'Gateway Timeout',
  '505' : 'HTTP Version Not Supported'
};
app.config.globalProperties.$error = false;


pinia.use(({ store }) => {
  store.$axios = app.config.globalProperties.$axios;
  store.$api_link = app.config.globalProperties.$api_link;
  store.$http_names = app.config.globalProperties.$http_names;
  store.$error = app.config.globalProperties.$error;
});
app.config.globalProperties.window = window;



app.use(Router)
app.use(LoadingPlugin);


app.component('EasyDataTable', Vue3EasyDataTable)
app.component('CodeBlock', CodeBlock).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
