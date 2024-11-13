<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore.js'

export default {
  beforeMount() {
    this.auth = authStore()
    console.log('passed auth store...')
    this.auth.checkAuth()
    console.log('checked auth...')
  },

  methods: {
  },
  components: { Menu, Login }
}
</script>

<template>
  <div class="row" style="text-align: center; justify-content: center;">
    <img src="../assets/pictures/logo.png" style="width: 600px; margin-top: 30px;" />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px" v-if="auth.authenticated == false">
    <Login />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px" v-else-if="auth.authenticated == true">
    <Menu />
  </div>
</template>
