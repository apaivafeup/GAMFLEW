<template>
  <div class="vertical-center" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
    <div class="row">
      <h2 style="text-align: center; margin-bottom: 10px;">Game Room {{ this.id }} is closed.</h2>
      <p style="text-align: center;">To play again, you need to create another room.</p>
      <p style="height: 30px; "/>
      <h4 style="text-align: center;" v-if="this.winner.length > 1">Here are the winners!</h4>
      <h4 style="text-align: center;" v-else>Here is the winner!</h4>
    </div>
    <div class="row container" style="justify-content: center;">
      <div class="winner-bar" v-for="w in this.winner">
        <div class="player-bar" style="display: flex; flex-direction: column; padding: 0px 10px;">
          <div style="display: grid; grid-template-columns: 80% 20%; grid-template-rows: 100%; padding: 3px 5px;">
            <div style="display: flex; align-content: start; align-items: start; flex-direction: column; justify-content: center;">
              <div class="row" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
                <img :src="this.$api_link + w.picture" class="player-bar-avatar" />
                <div class="col" style="justify-content: center; display: flex; flex-direction: column;">
                  <div class="row">
                    <b style="font-size: 14px">{{ w.name }}</b>
                  </div>
                  <div class="row">
                    <em style="font-size: 10px">
                      {{ w.username }}
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p style="height: 30px; "/>
    <div class="column container" style="display: grid; justify-content: center; align-content: center;">
      <div class="round-bar" v-for="(r, index) in this.round">
        <div style="display: grid; grid-template-columns: 60% 40%; grid-template-rows: 100%; grid-gap: 30px; padding: 10px; place-content: center;">
          <div style="display: flex; flex-direction: column; align-items: start; justify-content: start;">
            <div style="display: flex; flex-wrap: nowrap; flex-direction: row;">
              <div style="display: flex; margin-bottom: 5px;
              align-content: center;
              display: flex;
              justify-content: center;
              align-items: center;">
                <strong style="font-size: 12px; margin-right: 5px;">Round {{ index + 1 }} of {{ this.room.rounds }}</strong>
                <div class="badge bg-primary" style="margin: 0px; font-size: 12px; background-color: rgb(255, 193, 7)!important;"><strong>{{ r.score }} points</strong></div>
              </div>
            </div>
            <p style="margin-bottom: 0px; font-size: 8px; font-style: italic;"><strong>{{ r.challenge.split(':')[0] }}</strong>{{ ': ' + r.challenge.split(':')[1] }}</p>
          </div>
          <div style="display: grid; align-items: center; justify-content: end;">
            <div class="row" style="display: flex; flex-direction: row; justify-content: center;">
              <img :src="this.$api_link + this.users[r.player_id].picture" class="round-summary-avatar" />
                <div class="col" style="justify-content: center; display: flex; flex-direction: column;">
                  <div class="row">
                    <b style="font-size: 14px">{{ this.users[r.player_id].name }}</b>
                  </div>
                  <div class="row">
                    <em style="font-size: 10px">
                      {{ this.users[r.player_id].username }}
                    </em>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import { authStore } from '../store/authStore'
import { RouterLink } from 'vue-router'

export default defineComponent({
  beforeMount() {
    this.auth = authStore()

    this.getResults()
  },

  mounted() {
    this.getUsers()
  },

  props: {
    winner: [],
    room: {},
    id: String
  },

  components: {
  },

  data() {
    return {
      round: {},
      users: {}
    }
  },

  methods: {
    getResults() {
      this.$axios.get(this.$api_link + '/game-room/' + this.id + '/results', this.auth.config)
        .then(response => {
          this.round = response.data
        })
        .catch((error) => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
          return
        })
    },

    getUsers() {
      var users = []

      if (this.room.player_1_id != null) {
        users.push(this.room.player_1_id)
      }

      if (this.room.player_2_id != null) {
        users.push(this.room.player_2_id)
      }

      if (this.room.player_3_id != null) {
        users.push(this.room.player_3_id)
      }

      this.$axios.post(this.$api_link + '/users', users, this.auth.config)
        .then(response => {
          response.data.forEach(user => {
            this.users[user.id] = user
          })
        })
        .catch((error) => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
          return
        })
    }
  }
})
</script>
