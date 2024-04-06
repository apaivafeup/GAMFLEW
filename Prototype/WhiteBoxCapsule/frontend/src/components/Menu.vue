<template>
  <div class="col" v-if="main"
    style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <button class="menu-button" id="single-player-button" @click="this.$router.push('challenges')" style="width: 500px">
      Single Player
    </button>
    <button class="menu-button" id="multiplayer-button" @click="this.$router.push('multiplayer')" style="width: 500px">
      Multiplayer
    </button>
    <button class="menu-button" id="challenge-content-button" v-if="this.auth.user.user_type == 'admin'" @click="this.$router.push('content-creator')"
      style="width: 500px">
      Challenge Content Creator
    </button>
    <button class="menu-button" id="challenge-manager-button" v-if="this.auth.user.user_type == 'admin'" @click="this.$router.push('challenge-manager')"
      style="width: 500px">
      Challenge Manager
    </button>
    <button class="menu-button" @click="this.$router.push('how-to')" id="how-to-button" style="width: 500px">
      How To Play
    </button>
    <button class="menu-button" @click="this.$router.push({name: 'user-export'})" id="export-button" style="width: 500px">
      Export
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'credits' })" id="credits-button" style="width: 500px">
      Credits
    </button>
    <button class="menu-button" @click="this.logout($event)" id="logout-button" style="width: 500px">
      Logout
    </button>

  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { authStore } from '../store/authStore'

export default defineComponent({
  beforeMount() {
    this.auth = authStore()
  },

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
    async logout(event) {
      event.preventDefault()
      
      this.auth.logout()
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
