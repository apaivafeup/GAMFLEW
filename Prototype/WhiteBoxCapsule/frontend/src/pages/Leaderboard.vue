<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore.js'
import LoadingIcon from '../components/LoadingIcon.vue'
import { defineComponent, h, resolveComponent } from 'vue'
import AdminLeaderboardPlayerBar from '../components/AdminLeaderboardPlayerBar.vue'
import PlayerLeaderboardPlayerBar from '../components/PlayerLeaderboardPlayerBar.vue'

export default {
  beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: h(resolveComponent('LoadingIcon'))
      });

    this.auth = authStore()
    this.auth.checkAuth()
    this.getLeaderboard()

    loader.hide()

  },

  methods: {
    async getLeaderboard() {
      await this.$axios.get(this.$api_link + '/leaderboard', this.auth.config)
        .then((response) => {
          this.leaderboard = response.data
          this.user_type = this.auth.user.user_type
        })
        .catch((error) => {
          this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }});
          return
        })
    }
  },

  data() {
    return {
      leaderboard: [],
    }
  },
  components: { LoadingIcon, AdminLeaderboardPlayerBar, PlayerLeaderboardPlayerBar }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h1>Leaderboard</h1>
  </div>

  <div class="row" v-if="this.user_type == 'admin'">
    <div class="col">
      <AdminLeaderboardPlayerBar v-for="player in leaderboard" :key="player.id" :user="player" />
    </div>
  </div>
  <div class="row" v-else>
    <div class="col">
      <PlayerLeaderboardPlayerBar v-for="player in leaderboard" :key="player.id" :user="player" />
    </div>
  </div>
</template>
