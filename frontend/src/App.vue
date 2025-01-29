<template>

  <head>
    <meta charset="utf-8">
    <title>Gamflew</title>
  </head>
  <div id="app" class="container">
    <LoadingIcon v-if="loading"></LoadingIcon> 
    <router-view v-else :key="$route.fullPath"></router-view>
  </div>

  <button v-if="open" @click="toggleMode()" class="theme-toggle" style="bottom: 185px;">💡</button>
  <button @click="back()" class="theme-toggle" v-if="open" style="bottom: 130px;">↩️</button>
  <button @click="home()" v-if="open" class="theme-toggle" id="theme-toggle-house" style="bottom: 75px;">🏠</button>
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
import { boardStore } from './store/boardStore';

export default {
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },

  beforeMount() {
    this.board = boardStore()
    this.auth = authStore()
    this.auth.checkAuth()
    this.loading = false;
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { LoadingIcon },
  data: () => {
    return {
      url: window.location.href,
      open: false,
      loading: true
    };
  },

  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    },

    back() {
      this.board.emptyState();
      this.$router.back().then(() => {
        window.location.reload()
      });
    },

    home() {
      this.board.emptyState();
      this.$router.push({ name: 'home' }).then(() => {
        window.location.reload()
      });
    },
  }
}
</script>
