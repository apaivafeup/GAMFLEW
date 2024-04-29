<template>
  <head>
    <meta charset="utf-8">
    <title>Gamflew</title>
  </head>
  <div class="container">
    <router-view :key="$route.fullPath"></router-view>
  </div>
  <button v-if="!url.includes('content-challenge') && !url.includes('challenge/')" @click="toggleMode"
    id="theme-toggle">💡</button>
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
        default: h(resolveComponent('LoadingIcon'))
      });
    this.auth = authStore()
    this.auth.checkAuth()
    loader.hide()
  },
  components: { LoadingIcon },
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
