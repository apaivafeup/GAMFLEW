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
    async export() {
      await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/export/', this.auth.config).then((response) => {
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(response.data)]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', this.auth.user.username + '.json')
        document.body.appendChild(link)
        link.click()
      }).catch((error) => {
        this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }})
      })
    }
  },

  components: { Menu, Login }
}
</script>

<template>
  <div class="row" style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: var(--text-color);">User Export</h1>
  </div>
  <div class="row" style="text-align: center; justify-content: center; display: flex;">
    <p style="color: var(--text-color);">
        This page is used to export user data. <br/>
        The data is exported in JSON format and can be used by an Administrator.
    </p>
    <button class="menu-button" @click="export()" id="export-button" style="width: 500px">
      Download
    </button>
  </div>
</template>
