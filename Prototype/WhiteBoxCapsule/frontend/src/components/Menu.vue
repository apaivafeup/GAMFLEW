<template>
  <div class="col" v-if="main && this.auth.user.user_type != 'admin'">
    style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <button class="menu-button" id="single-player-button" @click="this.$router.push('challenges')" style="width: 500px">
      Single Player
    </button>
    <button class="menu-button" id="multiplayer-button" @click="this.$router.push('multiplayer')" style="width: 500px">
      Multiplayer
    </button>
    <button class="menu-button" @click="this.$router.push('how-to')" id="how-to-button" style="width: 500px">
      How To Play
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'user-export' })"
      v-if="this.auth.user.user_type == 'player'" id="export-button" style="width: 500px">
      Export
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'credits' })" id="credits-button"
      style="width: 500px">
      Credits
    </button>
    <button class="menu-button" @click="this.logout($event)" id="logout-button" style="width: 500px">
      Logout
    </button>
  </div>

  <div class="col" v-else-if="main && this.auth.user.user_type == 'admin'">
    <div class="row" style="display: grid; grid-template-columns: repeat(3, 300px); grid-gap: 30px; place-content: center; margin-bottom: 15px;" >
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Play</h4>
      <button class="admin-menu-button" id="single-player-button" @click="this.$router.push('challenges')"
        style="">
        Single Player
      </button>
      <button class="admin-menu-button" id="multiplayer-button" @click="this.$router.push('multiplayer')"
        style="">
        Multiplayer
      </button>
      </div>
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Challenges</h4>
      <button class="admin-menu-button" id="challenge-content-button" v-if="this.auth.user.user_type == 'admin'"
        @click="this.$router.push('content-creator')" style="">
        Challenge Content Creator
      </button>
      <button class="admin-menu-button" id="challenge-manager-button" v-if="this.auth.user.user_type == 'admin'"
        @click="this.$router.push('challenge-manager')" style="">
        Challenge Manager
      </button>
      </div>
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Game Information</h4>
      <button class="admin-menu-button" @click="this.$router.push({ name: 'user-export' })" id="export-button" style="">
        Export
      </button>
      <button class="admin-menu-button" @click="this.$router.push('how-to')" id="how-to-button" style="">
        How To Play
      </button>
      <button class="admin-menu-button" @click="this.$router.push({ name: 'credits' })" id="credits-button"
      style="">
        Credits
      </button>
      </div>
    </div>
    <div class="row" style="display: grid; grid-template-columns: repeat(1, 300px); place-content: center;" >
      <div class="col" style="margin: 0px; padding: 0px;">
        <h4 style="text-align: center;">Administrator Features</h4>
        <!-- <button class="admin-menu-button" @click="this.$router.push({ name: 'user-import' })"
          v-if="this.auth.user.user_type == 'admin'" id="import-button" style="">
          Import
        </button> -->
        <button class="admin-menu-button" @click="this.$router.push({ name: 'validate-admin' })" id="validate-admin-button" style="">
          Validate New Administrators
        </button>

      </div>
    </div>
    <div class="row" style="display: flex; justify-content: center; margin-top: 75px;">
      <button class="admin-menu-button" @click="this.logout($event)" id="logout-button" style="width: 300px;">
        Logout
      </button>
    </div>
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
