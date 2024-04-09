<template>
  <div class="row" style="text-align: center; margin-bottom: 15px;">
    <h1>User Submissions</h1>
  </div>
    <div class="row" style="display: flex; grid-template-columns: 1fr 1fr; grid-template-rows: 100%; place-content: center; gap: 30px; margin-bottom: 15px;">
      <div style="width: 650px;">
        <label for="challenge-select" style="margin-right: 10px;">
          <h6>Challenge</h6>
        </label>
        <select class="button is-primary guide-button" id="challenge-select" style="width: 650px;"
          :value="selectedChallengeId" v-if="challenges.length > 0">
          <option @click="updateAttempts(challenge.id)" v-for="challenge in challenges" :value="challenge.id">{{
            challenge.name }}</option>
        </select>
      </div>
    <div style="width: 650px;">
      <label for="attempt-select" style="margin-right: 10px;">
        <h6>Attempt</h6>
      </label>
      <select class="button is-primary guide-button" id="attempt-select" style="width: 650px;"
        v-if="challenge_attempts.length > 0" :value="selectedAttemptId">
        <option @click="updateSolutionViewer(attempt.id)" v-for="attempt in challenge_attempts" :value="attempt.id">
          Attempt by {{
            this.users.find(user => user.id == attempt.player_id).name }} (<em>{{ this.users.find(user => user.id ==
            attempt.player_id).username }}</em>)</option>
      </select>
    </div>
  </div>
  <div class="row container" style="display: flex;">
    <div class="col" style="display: grid; grid-template-rows: 50% 50%; width: 40%;">
      <div class="row">
        <div v-if="this.preconditions.length != 0">
          <div class="row" style="margin-bottom: 10px;" :id="'precondition-info-' + index"
            v-for="(precondition, index) in this.preconditions">
            <div class="col" style="max-width: 90%; padding: 0px;">
              <div class="alert alert-info player-info precondition-alert" :id="'precondition-info-alert-' + index"
                style="display: flex; justify-content: start;">
                <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                  <strong style="margin-right: 2.5px;">{{ 'A' + (index + 1) + ':' }}</strong>
                </div>
                <div class="col" style="max-width: 90%">
                  <textarea class="box" rows="5" :value="precondition" style="width: 100%; text-align: start;"
                    @input="this.changePreconditionExpression($event, index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">

      </div>
    </div>
    <div class="col" style="display: grid; grid-template-columns: 100%; width: 60%;">
      <ChallengeSubmissionViewer :challenge="this.challenge" />
    </div>
  </div>
</template>

<script>
import { auxiliaryFunctions } from '../assets/js/auxiliary_functions';
import { authStore } from '../store/authStore';
import { useToast } from 'vue-toastification';
import { solutionViewer } from '../store/solutionViewer';
import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import ChallengeSubmissionViewer from '../components/ChallengeSubmissionViewer.vue';

export default {
  components: { ChallengeSubmissionViewer },

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
    await this.getAttempts()
    await this.getChallenges()
    await this.getUsers()
    this.updateAttempts()
    loader.hide()
  },

  data() {
    return {
      attempts: Object,
      challenges: [],
      users: [],
      challenge: {},
      challenge_attempts: [],
      preconditions: [],
      tests: [],
      selectedChallengeId: 1
    }
  },

  methods: {
    async getAttempts() {
      await this.$axios.get(this.$api_link + '/challenges/attempts/', this.auth.config)
        .then(response => {
          this.attempts = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    async getChallenges() {
      await this.$axios.get(this.$api_link + '/challenges/', this.auth.config)
        .then(response => {
          this.challenges = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    async getUsers() {
      await this.$axios.get(this.$api_link + '/users/', this.auth.config)
        .then(response => {
          this.users = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    updateAttempts(challenge_id = this.selectedChallengeId) {
      this.challenge = this.challenges.find(challenge => challenge.id == challenge_id)
      this.challenge_attempts = this.attempts['' + challenge_id]
      this.selectedAttemptId = this.challenge_attempts[0].id
      this.updateSolutionViewer(this.challenge_attempts[0].id)
    },

    updateSolutionViewer(attempt_id) {
      var challenge = this.challenges.find(challenge => challenge.id == this.selectedChallengeId),
        attempt = this.challenge_attempts.find(attempt => attempt.id == attempt_id)
      this.solution.changeState(attempt.test_cases)
    }


  },
}
</script>
