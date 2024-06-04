<template>

  <div v-if="playable" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
    <h3>Please wait a minute.</h3>
    <h6>{{ show_solution_timer }} seconds left.</h6>
    <p>Other players are seeing your solution.</p>
    <p>After a minute, you will be able to see the solution.</p>
  </div>
  <div v-else>
    <div class="row" style="text-align: center;">
      <h1>Challenge Solution</h1>
    </div>
    <div class="row" style="display: grid; grid-template-columns: 50% 50%; padding: 30px;">

      <div class="col" style="padding: 0px;">
        <div class="row" style="width: 100%; display: flex; justify-content: center; margin-bottom: 10px;">
          <div class="alert alert-special player-info" style="font-size: 10px;">
            <p style="margin: 0px; padding: 0px; align-self: center;"><strong>Objective: </strong>{{ this.challenge.objective }}</p>
          </div>
        </div>
        <div class="row" style="width: 100%;">
          <ChallengeCode :code_file="code_file" />
        </div>
        <div class="row" style="width: 100%;">
          <div class="col" style="overflow-y: scroll; overflow-x: hidden; padding: 0px; display: flex; flex-direction: column; justify-content: center; align-content: start;">
            <div class="row" style="padding: 0px; margin: 0px;">
              <div style="margin-bottom: 10px; width: 100%; display: flex; flex-direction: row; justify-content: center; padding: 0px;" :id="'log-info'">
                <div class='alert alert-secondary player-info precondition-alert' :id="'log-info-alert'"
                style="min-height: 72px; max-height: 72px; overflow-y: scroll; display: flex; flex-direction: column; align-content: start;">
                  <div class="col" style="font-size: 10px; display: flex; align-self: start; text-align: center; ">
                    <span v-for="(interaction, index) in solution.log[solution.currentKey]">
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;"
                      v-if="interaction.type == 'move'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' from ' }} <em> {{ this.getPosition(interaction.start) }}</em> {{ ' to ' }} <em> {{
                        this.getPosition(interaction.destination) }} </em>.
                    </p>
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;" v-else-if="interaction.type == 'add'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' '
                        +
                        interaction.color + ' piece in ' }} <em>{{ this.getPosition(interaction.destination) }}</em>.
                    </p>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col" style="padding: 0px;">
        <ChallengeSubmissionViewer :challenge="challenge" :attempt="attempt" />
      </div>
  </div>
</div>
</template>

<script>
import { authStore } from '../store/authStore.js';
import { useToast } from 'vue-toastification';
import { solutionViewer } from '../store/solutionViewer.js';
import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import ChallengeSubmissionViewer from '../components/ChallengeSubmissionViewer.vue';
import { Challenge } from '../store/models/challenge.js';
import { CodeFile } from '../store/models/code_file.js';
import ChallengeCode from './ChallengeCode.vue';
import Prism from 'prismjs';

export default {
  components: { ChallengeSubmissionViewer, ChallengeCode },

  props: {
    attempt: {},
    challenge: Challenge,
    code_file: CodeFile,
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
    this.auth.checkAuth()
    this.toast = useToast()
    this.solution = solutionViewer()
    await this.getUsers()
    Prism.highlightAll()
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
