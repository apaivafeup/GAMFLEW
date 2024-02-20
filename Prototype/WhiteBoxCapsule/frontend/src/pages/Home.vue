<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore'

export default {
  beforeMount() {
    this.authStore = authStore()
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
  <div class="row" style="justify-content: center; margin-top: 30px" v-if="!this.authStore.auth">
    <Login />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px" v-else>
    <Menu />
  </div>
</template>
