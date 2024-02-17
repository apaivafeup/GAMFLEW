<template>
  <div class="col" v-if="main"
    style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <button class="menu-button" id="single-player-button" @click="this.$router.push('challenges')" style="width: 500px">
      Single Player
    </button>
    <button class="menu-button" id="single-player-button" @click="this.$router.push('content-creator')"
      style="width: 500px">
      Challenge Content Creator
    </button>
    <button class="menu-button" id="single-player-button" @click="this.$router.push('challenge-manager')"
      style="width: 500px">
      Challenge Manager
    </button>
    <button class="menu-button" @click="this.$router.push('how-to')" style="width: 500px">
      How To Play
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'credits' })" style="width: 500px">
      Credits
    </button>
    <button class="menu-button" @click="this.logout()" style="width: 500px">
      Logout
    </button>

  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},

  data() {
    return {
      main: true,
      challenges: false,
      howTo: false,
      credits: false
    }
  },

  methods: {
    logout() {
      this.$axios.defaults.headers.common = {'Authorization': `Bearer ${window.sessionStorage.getItem('access_token')}`}

      this.$axios.post(this.$api_link + '/logout')
        .then((response) => {
          if (response.status === 200) {
            window.sessionStorage.removeItem('access_token')
            window.location.reload()
          }
        })
    },

    switchMenu(target) {
      switch (target) {
        case 'main':
          this.main = true
          this.challenges = false
          this.howTo = false
          this.credits = false
          break
        case 'challenges':
          this.main = false
          this.challenges = true
          this.howTo = false
          this.credits = false
          break
        case 'howTo':
          this.main = false
          this.challenges = false
          this.howTo = true
          this.credits = false
          break
        case 'credits':
          this.main = false
          this.challenges = false
          this.howTo = false
          this.credits = true
          break
      }
    }
  }
})
</script>
