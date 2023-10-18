import './assets/css/main.css'
import './assets/css/prism.css'
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.css'

import CodeBlock from 'vue3-code-block';
import { createApp } from 'vue'
import App from './App.vue'


createApp(App)
  .component('CodeBlock', CodeBlock)
  .mount('#app')