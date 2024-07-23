<template>
  <div class="col" v-if="main && auth.user.user_type != 'admin' && auth.user.user_type != 'teacher'" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
    <button class="menu-button" id="single-player-button" @click="this.$router.push('challenges')" style="width: 500px">
      Single Player
    </button>
    <button class="menu-button" id="multiplayer-button" @click="this.$router.push('multiplayer')" style="width: 500px">
      Multiplayer
    </button>
    <button class="menu-button" id="achievements-button" @click="this.$router.push('achievements')" style="width: 500px">
      Achievements
    </button>
    <button class="menu-button" @click="this.$router.push('how-to')" id="how-to-button" style="width: 500px">
      How To Play
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'leaderboard' })" id="leaderboard-button" style="width: 500px;">
      Leaderboard
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'edit-user', params: { id: auth.user.id } })" id="edit-user-button" style="width: 500px">
      Edit User
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'user-export' })"
      v-if="auth.user.user_type == 'player'" id="export-button" style="width: 500px">
      Export
    </button>
    <button class="menu-button" @click="this.$router.push({ name: 'credits' })" id="credits-button"
      style="width: 500px">
      Credits
    </button>
    <button class="menu-button" @click="logout($event)" id="logout-button" style="width: 500px">
      Logout
    </button>
  </div>

  <div class="col" v-else-if="main && auth.user.user_type == 'admin' || auth.user.user_type == 'teacher'">
    <div class="row" style="display: grid; grid-template-columns: repeat(3, 300px); grid-gap: 30px; place-content: center; margin-bottom: 15px;" >
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Play</h4>
      <button class="admin-menu-button" id="single-player-button" @click="this.$router.push('challenges')"
        style="">
        Single Player
      </button>
      <button class="admin-menu-button" id="multiplayer-button" @click="this.$router.push('multiplayer')" style="">
        Multiplayer
      </button>
      <button class="admin-menu-button" id="achievements-button" @click="this.$router.push('achievements')" style="">
        Achievements
      </button>
      <button class="admin-menu-button" @click="this.$router.push('how-to')" id="how-to-button" style="">
        How To Play
      </button>
      </div>
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Challenges</h4>
      <button class="admin-menu-button" id="challenge-content-button" v-if="auth.user.user_type == 'admin' || auth.user.user_type == 'teacher'"
        @click="this.$router.push('content-creator')" style="">
        Challenge Content Creator
      </button>
      <button class="admin-menu-button" id="challenge-manager-button" v-if="auth.user.user_type == 'admin' || auth.user.user_type == 'teacher'"
        @click="this.$router.push('challenge-manager')" style="">
        Challenge Manager
      </button>
      </div>
      <div class="col" style="margin: 0px; padding: 0px;">
      <h4 style="text-align: center;">Game Information</h4>
      <button class="admin-menu-button" @click="this.$router.push({ name: 'leaderboard' })" id="leaderboard-button" style="">
        Leaderboard
      </button>
      <button class="admin-menu-button" @click="this.$router.push({ name: 'edit-user', params: { id: auth.user.id } })" id="edit-user-button" style="">
        Edit User
      </button>
      <button class="admin-menu-button" @click="this.$router.push({ name: 'user-export' })" id="export-button" style="">
        Export
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
          v-if="auth.user.user_type == 'admin'" id="import-button" style="">
          Import
        </button> -->
        <button class="admin-menu-button" @click="this.$router.push({ name: 'validate-admin' })" id="validate-admin-button" style="">
          Validate New Administrators
        </button>
        <button class="admin-menu-button" @click="this.$router.push({ name: 'check-user-submissions' })" id="check-user-submission-button" style="">
          Check User Submissions
        </button>

      </div>
    </div>
    <div class="row" style="display: flex; justify-content: center; margin-top: 40px;">
      <button class="admin-menu-button" @click="logout($event)" id="logout-button" style="width: 300px;">
        Logout
      </button>
    </div>
  </div>

</template>

<script>
import { defineComponent } from 'vue'
import { authStore } from '../store/authStore.js'

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
    }
  }
})
</script>
