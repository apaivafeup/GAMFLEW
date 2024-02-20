<template>
  <head>
    <meta charset="utf-8">
    <title>Gamflew</title>
  </head>
  <router-view></router-view>
  <button v-if="!url.includes('content-challenge') && !url.includes('challenge/')" @click="toggleMode"
    id="theme-toggle">💡 Theme</button>

</template>

<script>
import { authStore } from './store/authStore';

export default {
  beforeMount() {
    this.authStore = authStore()
    this.authStore.checkAuth()
  },
  
  components: { },
  data: () => {
    return {
      url: window.location.href
    };
  },

  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    }
  }
}
</script>
