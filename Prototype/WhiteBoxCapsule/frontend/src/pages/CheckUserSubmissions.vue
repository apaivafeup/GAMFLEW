<template>
  <div class="row" style="text-align: center;">
    <h1>User Submissions</h1>
  </div>
  <div style="display: flex; flex-direction: row; gap: 2vw; margin-bottom: 10px; place-content: center;">
    <div style="width: 650px;">
      <label for="challenge-select" style="margin-right: 10px;">
        <h6 style="margin-bottom: 2.5px;">Challenge</h6>
      </label>
      <select class="button is-primary guide-button" id="challenge-select" style="width: 650px;"
        :value="selectedChallengeId" v-if="challenges.length > 0">
        <option @click="updateAttempts(challenge.id)" v-for="challenge in challenges" :value="challenge.id">{{
          challenge.name }}</option>
      </select>
    </div>
    <div style="width: 650px;" >
      <label for="attempt-select" style="margin-right: 10px;">
        <h6 style="margin-bottom: 2.5px;">Attempt</h6>
      </label>
      <select class="button is-primary guide-button" id="attempt-select" style="width: 650px;"
        v-if="challenge_attempts.length > 0 && this.selectedAttemptId != null" :value="selectedAttemptId">
        <option @click="updateSolutionViewer(attempt.id)" v-for="attempt in challenge_attempts" :value="attempt.id">
          Attempt by {{
          this.users.find(user => user.id == attempt.player_id).name }} (<em style="font-style: italic;">{{
          this.users.find(user => user.id ==
            attempt.player_id).username }}</em>)</option>
      </select>
      <select class="button is-primary guide-button disabled" id="attempt-select" style="width: 650px;" v-else>
        <option>No attempts submitted.</option>
      </select>
    </div>
  </div>
  <div class="row" style="display: grid; grid-template-columns: 45% 45%; place-content: center; grid-gap: 10px; grid-template-rows: 100%; max-height: 100%;">
    <div class="col" style="display: grid; grid-template-rows: 50% 50%; overflow-y: scroll;">
        <div class="col" style="margin-bottom: 10px; overflow-y: scroll;">
            <div v-if="this.preconditions.length != 0" style="margin-bottom: 10px; width: 100%; justify-content: center;" :id="'precondition-info-' + index"
              v-for="(precondition, index) in this.preconditions">
                <div :class="this.evaluateExpression(precondition, this.solution) == null ? 'alert alert-info player-info precondition-alert' : !this.evaluateExpression(precondition, this.solution) ? 'alert player-info alert-danger' : 'alert player-info alert-success'" :id="'precondition-info-alert-' + index"
                  style="display: flex; justify-content: start;">
                  <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                    <strong style="margin-right: 2.5px;">{{ 'A' + (index + 1) + ':' }}</strong>
                  </div>
                  <div class="col" style="max-width: 90%; align-self: center;">
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">{{ this.replace(precondition) }}</p>
                  </div>
                </div>
            </div>
            <div v-else class="alert alert-info player-info precondition-alert" style="display: flex; justify-content: center;">
                <div class="col" style="max-width: 100%; align-self: center;">
                  <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">No assertions included.</p>
                </div>
            </div>
            <div v-if="this.tests.length != 0" style="margin-bottom: 10px; width: 100%; justify-content: center;" :id="'test-info-' + index" v-for="(test, index) in this.tests">
                <div :class="this.evaluateExpression(test, this.solution) == null ? 'alert alert-info player-info precondition-alert' : !this.evaluateExpression(test, this.solution) ? 'alert player-info alert-danger' : 'alert player-info alert-success'" :id="'test-info-alert-' + index"
                  style="display: flex; justify-content: start;">
                  <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                    <strong style="margin-right: 2.5px;">{{ 'T' + (index + 1) + ':' }}</strong>
                  </div>
                  <div class="col" style="max-width: 90%; align-self: center;">
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">{{ this.replace(test)
                      }}
                    </p>
                  </div>
                </div>
            </div>
        </div>
        <div class="row">

        </div>
    </div>
    <div class="col" v-if="this.selectedAttemptId != null" style="display: flex; justify-content: end; flex-direction: row; padding: 0px;">
      <ChallengeSubmissionViewer :challenge="this.challenge"  />
    </div>
    <div class="col" style="display: flex; place-content: center; flex-direction: row; padding: 0px;" v-else>
        <ChallengeSubmissionViewer class="disabled" :challenge="this.challenge"  />
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
    await this.getDictionary()
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
      selectedChallengeId: 1,
      dictionary: {},
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

    async getDictionary() {
      await this.$axios.get(this.$api_link + '/code-file-dictionary/', this.auth.config).then((response) => {
        this.dictionary = response.data
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
      })
    },

    updateAttempts(challenge_id = this.selectedChallengeId) {
      this.challenge = this.challenges.find(challenge => challenge.id == challenge_id)
      this.preconditions = this.challenge.passing_criteria.preconditions
      this.tests = this.challenge.passing_criteria.tests
      this.challenge_attempts = this.attempts['' + challenge_id]
      this.selectedAttemptId = (this.challenge_attempts.length > 0 ? this.challenge_attempts[0].id : null)
      this.solution.generateState()

      if (this.selectedAttemptId != null)
        this.updateSolutionViewer(this.challenge_attempts[0].id)
    },

    updateSolutionViewer(attempt_id) {
      var challenge = this.challenges.find(challenge => challenge.id == this.selectedChallengeId),
        attempt = this.challenge_attempts.find(attempt => attempt.id == attempt_id)
      this.solution.changeState(attempt.test_cases)
    },

    replace(test) {
      var dict = this.dictionary

      var boardAccess
      if (this.challenge.passing_criteria.tests.length > 1) {
        boardAccess = 'case_num'
      } else {
        boardAccess = 'input.currentKey'
      }

      var expression = test.replaceAll(boardAccess, 'X'),
        array = Object.entries(dict).sort((a, b) => b[1].length - a[1].length)
        
      for (var entry in array) {
        expression = expression.replaceAll(array[entry][1], array[entry][0])
      }

      for (var item in array) {
        var regex = new RegExp('board.log[[A-z]+].start||board.log[[A-z]+].destination')
        if (array[item][0] == 'start' || array[item][0] == 'destination') {
          if (regex.test(expression)) {
            continue
          }
        }
        expression = expression.replaceAll(array[item][1], array[item][0])
      }

      return expression
    },

    evaluateExpression(expression, input) {
      try {
        expression = expression.replaceAll('case_num', 'input.currentKey')
        return eval(expression)
      } catch (error) {
        return null
      }
    }


  },
}
</script>
