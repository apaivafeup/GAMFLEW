<template>
  <head>
    <meta charset="utf-8">
    <title>Gamflew</title>
  </head>
  <div id="app" class="container">
    <router-view :key="$route.fullPath"></router-view>
  </div>
  
  <button v-if="open && !url.includes('content-challenge') && !url.includes('challenge/')" @click="toggleMode" class="theme-toggle" style="bottom: 185px;">💡</button>
  <button @click="this.$router.back()" class="theme-toggle" v-if="open && !url.includes('challenge/')" style="bottom: 130px;">↩️</button>
  <button @click="this.$router.push({name: 'home'})" v-if="open" class="theme-toggle" id="theme-toggle-house" style="bottom: 75px;">🏠</button>
  <button v-if="!open" @click="open = !open" class="theme-toggle" style="bottom: 20px; opacity: 40%;">⬆️</button>
  <button v-else @click="open = !open" class="theme-toggle" style="bottom: 20px; opacity: 100%;">⬇️</button>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
</style>


<script>
import { authStore } from './store/authStore';
import LoadingIcon from './components/LoadingIcon.vue'
import { h, resolveComponent } from 'vue'
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';

export default {
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },

  beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: () => h(resolveComponent('LoadingIcon'))
      }, this.$slots.default);
    this.auth = authStore()
    this.auth.checkAuth()
    loader.hide()
  },
  components: { LoadingIcon },
  data: () => {
    return {
      url: window.location.href,
      open: false,
    };
  },

  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    }
  }
}
</script>
