<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore.js'

export default {
  beforeMount() {
    this.auth = authStore()
    this.auth.checkAuth()
  },

  methods: {
  },
  components: { Menu, Login }
}
</script>

<template>
  <div class="row" style="text-align: center; justify-content: center;">
    <img src="https://i.ibb.co/BnR2dGP/logo.png" style="width: 600px; margin-top: 30px;" />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px" v-if="!this.auth.auth">
    <Login />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px" v-else-if="this.auth.auth">
    <Menu />
  </div>
</template>
