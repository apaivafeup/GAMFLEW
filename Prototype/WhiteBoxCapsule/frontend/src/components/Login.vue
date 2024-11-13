<template>
  <div class="row" style="display: flex; justify-content: center; margin-bottom: 15px;">
    <h4 style="text-align: center;">Login</h4>
  </div>
  <div class="row" style="display: flex; justify-content: center;">
    <form style="max-width: 500px;">
      <div style="margin-bottom: 10px;">
        <label for="exampleInputUsername">Username</label>
        <input name="username" type="text" class="form-control" @input="setUsername($event)" id="exampleInputUsername"
          aria-describedby="usernameHelp" placeholder="username">
        <small id="usernameHelp" class="form-text text-muted"
          style="margin-top: 0px; padding-top: 0px; font-size: 10px; color: var(--text-color) !important;">A username may be an e-mail.</small>
      </div>
      <div style="margin-bottom: 10px;">
        <label for="exampleInputPassword">Password</label>
        <input name="password" type="password" class="form-control" @input="setPassword($event)" id="exampleInputPassword"
          placeholder="password">
        <small id="passwordHelp" class="form-text text-muted"
          style="margin-top: 0px; padding-top: 0px; font-size: 10px; color: var(--text-color) !important;">We'll never share your password with anyone
          else.</small>
      </div>
      <div class="row" style="display: flex; justify-content: center;">
        <button @click="sendLoginForm($event)" class="btn btn-primary" id="login-button"
          style="padding: 10px; max-width: 100px; border-radius: 15px; margin-bottom: 10px;">Login</button>
        <small id="registerHelp" class="form-text text-muted"
          style="margin-top: 0px; padding-top: 0px; font-size: 10px; text-align: center; color: var(--text-color) !important;">Don't have an account? You can
          <RouterLink id="register-link" to="/register">register</RouterLink>!</small>
      </div>
    </form>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { authStore } from '../store/authStore.js'
import { RouterLink } from 'vue-router'

export default defineComponent({
  beforeMount() {
    this.auth = authStore()
    this.auth.checkAuth()
  },

  components: {
    RouterLink
  },

  data() {
    return {
      username: '',
      password: ''
    }
  },

  methods: {
    setUsername(event) {
      this.username = event.target.value
    },

    setPassword(event) {
      this.password = event.target.value
    },

    async sendLoginForm(event) {
      event.preventDefault()
      
      var formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      
      this.auth.login(formData)
      this.beforeMount()
    },

    goToRegister(event) {
      event.preventDefault()
      this.$router.push('/register')
    }
  }
})
</script>
