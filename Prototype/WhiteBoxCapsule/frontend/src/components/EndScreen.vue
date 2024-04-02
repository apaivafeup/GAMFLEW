<template>
  <div class="vertical-center" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
    <div class="row">
      <h2 style="text-align: center; margin-bottom: 10px;">Game Room {{ this.id }} is closed.</h2>
      <h4 style="text-align: center;" v-if="this.winner.length > 1">The winners are:</h4>
      <h4 style="text-align: center;" v-else>The winner is:</h4>
    </div>
    <div class="row container" style="justify-content: center;">
      <div class="winner-bar" v-for="w in this.winner">
        <div class="player-bar" style="display: flex; flex-direction: column; padding: 0px 10px;">
          <div style="display: grid; grid-template-columns: 80% 20%; grid-template-rows: 100%; padding: 3px 5px;">
            <div style="display: flex; align-content: center; align-items: start; flex-direction: column; justify-content: center;">
              <div class="row" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
                <img :src="this.$api_link + w.picture" class="player-bar-avatar" />
                <div class="col" style="justify-content: center; display: flex; flex-direction: column;">
                  <div class="row">
                    <b style="font-size: 22px">{{ w.name }}</b>
                  </div>
                  <div class="row">
                    <em style="font-size: 10px">
                      {{ w.username }}
                    </em>
                  </div>
                </div>
              </div>
            </div>
            <div id="player-stats">
              <span class="badge badge-warning" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: end;
                  font-weight: normal;
                  color: var(--text-color);
                  font-size: 14px;
                ">
                <font-awesome-icon icon="trophy" fixed-width style="color: #ffc107; margin-right: 5px" />
                <p style="margin: 0px 7.5px 0px 0px">Wins:</p>
                {{ w.successful_attempts }}
              </span>
              <span class="badge badge-warning" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: end;
                  font-weight: normal;
                  color: var(--text-color);
                  font-size: 14px;
                ">
                <font-awesome-icon icon="list-check" fixed-width style="color: #8adc6d; margin-right: 5px" />
                <p style="margin: 0px 7.5px 0px 0px">Attempts:</p>
                {{ w.successful_attempts + w.failed_attempts }}
              </span>
              <span class="badge badge-warning" style="
                  display: flex;
                  flex-direction: row;
                  justify-content: end;
                  font-weight: normal;
                  color: var(--text-color);
                  font-size: 14px;
                ">
                <font-awesome-icon icon="award" fixed-width style="color: rgb(169, 89, 255); margin-right: 5px" />
                <p style="margin: 0px 7.5px 0px 0px">Achievements:</p>
                {{ w.achievements }}
              </span>
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

  props: {
    winner: [],
    id: String
  },

  components: {
  },

  data() {
    return {
      results: {}
    }
  },

  methods: {
    getResults() {
      this.$axios.get(this.$api_link + '/game-room/' + this.id + '/results', this.auth.config)
        .then(response => {
          this.results = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
          return
        })
    }
  }
})
</script>
