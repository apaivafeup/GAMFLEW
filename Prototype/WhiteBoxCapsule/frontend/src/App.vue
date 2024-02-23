<template>
  <head>
    <meta charset="utf-8">
    <title>Gamflew</title>
  </head>
  <router-view></router-view>
  <button v-if="!url.includes('content-challenge') && !url.includes('challenge/')" @click="toggleMode"
    id="theme-toggle">💡 Theme</button>
  <LoadingIcon />
</template>

<script>
import { authStore } from './store/authStore';
import LoadingIcon from './components/LoadingIcon.vue';
import {h} from 'vue';

export default {
  beforeMount() {
    this.auth = authStore()
    this.auth.checkAuth()

    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
    });

    setTimeout(() => {
      loader.hide()
    }, 5000)
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
