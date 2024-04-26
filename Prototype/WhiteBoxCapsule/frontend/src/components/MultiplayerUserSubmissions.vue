<template>
  <div v-if="playable" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
    <h3>Please wait a minute.</h3>
    <h6>{{ show_solution_timer }} seconds left.</h6>
    <p>Other players are seeing your solution.</p>
    <p>After a minute, you will be able to see the solution.</p>
  </div>
  <div v-else>
    <div class="row" style="text-align: center;">
      <h1>Round Solution</h1>
    </div>
    <div class="row"
      style="display: grid; grid-template-columns: 45% 45%; place-content: center; grid-gap: 10px; grid-template-rows: 100%; max-height: 100%;">
      <div class="col" style="display: grid; grid-template-rows: 100%; grid-gap: 5px; overflow-y: scroll;">
        <div class="col">
          <div class="row" style="margin-bottom: 2.5px;">
            <h6 style="margin: 0px;">Logged Interactions</h6>
          </div>

          <div class="col" style="overflow-y: scroll; overflow-x: hidden;">
            <div class="row">
              <div style="margin-bottom: 10px; width: 100%; justify-content: center;" :id="'log-info-' + index"
                v-for="(interaction, index) in solution.log[solution.currentKey]">
                <div class='alert alert-secondary player-info precondition-alert' :id="'log-info-alert-' + index"
                  style="display: flex; justify-content: start;">
                  <div class="row" style="display: flex; align-self: center; text-align: center;">
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;"
                      v-if="interaction.type == 'move'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' from ' }} <em> {{ this.getPosition(interaction.start) }}</em> {{ ' to ' }} <em> {{
                        this.getPosition(interaction.destination) }} </em>.
                    </p>
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;"
                      v-else-if="interaction.type == 'add'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' '
                        +
                        interaction.color + ' piece in ' }} <em>{{ this.getPosition(interaction.destination) }}</em>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="col" style="display: flex; justify-content: end; flex-direction: row; padding: 0px;">
        <ChallengeSubmissionViewer :challenge="challenge" :attempt="attempt" />
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from '../store/authStore';
import { useToast } from 'vue-toastification';
import { solutionViewer } from '../store/solutionViewer';
import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import ChallengeSubmissionViewer from '../components/ChallengeSubmissionViewer.vue';
import { Challenge } from '../store/models/challenge';

export default {
  components: { ChallengeSubmissionViewer },

  props: {
    attempt: {},
    challenge: Challenge,
    show_solution_timer: Number,
    playable: Boolean
  },

  async beforeMount() {
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
    this.toast = useToast()
    this.solution = solutionViewer()
    await this.getUsers()
    loader.hide()
  },

  data() {
    return {
      users: [],
      selectedUser: {},
      //challenge: {},
    }
  },

  methods: {
    async getUsers() {
      await this.$axios.get(this.$api_link + '/users/', this.auth.config)
        .then(response => {
          this.users = response.data
          this.selectedUser = this.users['' + this.attempt.player_id]
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    getPosition(position) {
      return '(' + position.x + ', ' + position.y + ')'
    },

  },
}
</script>
