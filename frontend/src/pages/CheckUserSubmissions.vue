<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable no-unused-vars -->
<template>
  <div>
    <div class="row" style="text-align: center;">
      <h1>User Submissions</h1>
    </div>
    <div style="display: flex; flex-direction: row; gap: 2vw; margin-bottom: 10px; place-content: center;">
      <div style="width: 650px;">
        <label for="challenge-select" style="margin-right: 10px;">
          <h6 style="margin-bottom: 2.5px;">Challenge</h6>
        </label>
        <select v-if="challenges.length > 0" class="button is-primary guide-button" id="challenge-select" style="width: 650px;" v-model="selectedChallengeId" @change="selectChallenge($event)">
          <option :key="'challenge-'+challenge.id" v-for="challenge in challenges" :value="challenge.id">{{ challenge.name }}</option>
        </select>
        <select v-else class="button is-primary guide-button" id="challenge-select" style="width: 650px;">
          <option selected="selected" disabled hidden>No challenges.</option>
        </select>
      </div>
      <div style="width: 650px;">
        <label for="attempt-select" style="margin-right: 10px;">
          <h6 style="margin-bottom: 2.5px;">Attempt</h6>
        </label>
        <select class="button is-primary guide-button" id="attempt-select" style="width: 650px;" v-if="challenge_attempts.length > 0 && users.length > 0 && selectedAttempt != null" v-model="selectedAttemptId" @change="selectAttempt($event)">
          <option :key="'attempt-'+attempt.id" v-for="attempt in challenge_attempts" :value="attempt.id">
            {{ attempt.attempt_type.charAt(0).toUpperCase() + attempt.attempt_type.slice(1) + 'ed' }}
            attempt by {{ users.find(user => user.id == attempt.player_id).name }}
            (<em style="font-style: italic !important;">{{ users.find(user => user.id == attempt.player_id).username }}</em>)
          </option>
          <option v-if="challenge_attempts.length == 0" selected="selected" disabled hidden>No attempts submitted.</option>
        </select>
        <select class="button is-primary guide-button disabled" id="attempt-select" style="width: 650px;" v-else>
          <option selected="selected" disabled hidden>No attempts submitted.</option>
        </select>
      </div>
    </div>
    <div style="display: flex; flex-direction: row; margin-bottom: 10px; justify-content: center;">
      <div class="row" style="width: 1300px;">
        <div class="alert alert-special player-info precondition-alert" v-if="challenge_attempts.length > 0" style="width: 100%;"> <strong
            style="margin-right: 2.5px;">{{ 'Comment:' }}</strong><em>{{ selectedAttempt != null ? selectedAttempt.comment : 'No attempts, so no comment!' }}</em></div>
        <div class="alert alert-special player-info precondition-alert disabled" v-else style="width: 100%;"> <strong
            style="margin-right: 2.5px;">{{ 'Comment:' }}</strong><em>No attempts, so no comment!</em></div>
      </div>
    </div>

    <div class="row"
      style="display: grid; grid-template-columns: 45% 45%; place-content: center; grid-gap: 10px; grid-template-rows: 100%; max-height: 100%;">
      <div class="col"
        style="display: grid; grid-template-rows: 20px calc((512px - 40px)/2) 20px calc((512px - 40px)/2); grid-gap: 5px;">
        <div class="row">
          <h6 style="margin: 0px;">Passing Criteria</h6>
        </div>
        <div class="col" style="overflow-y: scroll; overflow-x: hidden; padding-right: 10px;">
          <div class="col" v-if="preconditions.length != 0" >
            <div style="margin-bottom: 10px; width: 100%; justify-content: center;"
              :id="'precondition-info-' + index" :key="'precondition-'+index" v-for="(precondition, index) in preconditions">
              <div
                :class="evaluateExpression(precondition, solution) == null ? 'alert alert-info player-info precondition-alert' : !evaluateExpression(precondition, solution) ? 'alert player-info alert-danger' : 'alert player-info alert-success'"
                :id="'precondition-info-alert-' + index" style="display: flex; justify-content: start;">
                <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                  <strong style="margin-right: 2.5px;">{{ 'A' + (index + 1) + ':' }}</strong>
                </div>
                <div class="col" style="max-width: 90%; align-self: center;">
                  <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">{{
                    replace(precondition) }}</p>
                </div>
              </div>
            </div>
            <div v-if="preconditions.length == 0" class="alert alert-info player-info precondition-alert disabled"
              style="display: flex; justify-content: center;">
              <div class="col" style="max-width: 100%; align-self: center;">
                <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">No attempts means no expressions!
                </p>
              </div>
            </div>
          </div>
          <div class="col" v-if="tests.length != 0" >

            <div :key="'test-' + index" style="margin-bottom: 10px; width: 100%; justify-content: center;" :id="'test-info-' + index" v-for="(test, index) in tests">
              <div
              :class="evaluateExpression(test, solution) == null ? 'alert alert-info player-info precondition-alert' : !evaluateExpression(test, solution) ? 'alert player-info alert-danger' : 'alert player-info alert-success'"
              :id="'test-info-alert-' + index" style="display: flex; justify-content: start;">
              <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                <strong style="margin-right: 2.5px;">{{ 'T' + (index + 1) + ':' }}</strong>
              </div>
              <div class="col" style="max-width: 90%; align-self: center;">
                <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">{{
                  replace(test) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <h6 style="margin: 0px;">Logged Interactions</h6>
        </div>
        <div class="col" style="overflow-y: scroll; overflow-x: hidden; padding-right: 10px;">
          <div class="col">
            <div class="row" v-if="selectedAttempt != null">
              <div style="margin-bottom: 10px; width: 100%; justify-content: center;" :id="'log-info-' + index" :key="'solution-'+index" v-for="(interaction, index) in solution.log[solution.currentKey]">
                <div class='alert alert-secondary player-info precondition-alert' :id="'log-info-alert-' + index" style="display: flex; justify-content: start;">
                  <div class="row" style="display: flex; align-self: center; text-align: center;">
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;" v-if="interaction.type == 'move'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' from ' }} <em> {{ getPosition(interaction.start) }}</em> {{ ' to ' }} <em> {{ getPosition(interaction.destination) }} </em>.
                    </p>
                    <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;" v-else-if="interaction.type == 'add'">
                      <strong>{{ interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1) }}</strong> {{ ' ' + interaction.color + ' piece in ' }} <em>{{ getPosition(interaction.destination) }}</em>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-secondary player-info precondition-alert disabled" style="display: flex; justify-content: center;">
              <p style="width: 100%; text-align: start; vertical-align: center; margin: 0px;">
                No attempts means no interactions!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="col" v-if="selectedAttemptId != null" style="display: flex; justify-content: end; flex-direction: row; padding: 0px;">
        <ChallengeSubmissionViewer :challenge="challenge" :attempt="selectedAttempt" />
      </div>
      <div class="col" style="display: flex; justify-content: end; flex-direction: row; padding: 0px;" v-else>
        <ChallengeSubmissionViewer class="disabled" :challenge="challenge" :attempt="selectedAttempt" />
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
    this.auth.checkAuth()
    this.toast = useToast()
    this.solution = solutionViewer()
    this.solution.generateState()
    await this.getAttempts()
    await this.getChallenges()
    await this.getUsers()
    await this.getDictionary()
    this.selectChallenge({ target: { value: 1 } })
    this.selectAttempt({ target: { value: 1 } })
    loader.hide()
  },

  data() {
    return {
      dictionary: {},
      selectedAttemptId: 1,
      selectedChallengeId: 1,
      attempts: Object,
      selectedAttempt: null,
      challenges: [],
      users: [],
      challenge: {},
      challenge_attempts: [],
      preconditions: [],
      tests: [],
    }
  },

  methods: {
    selectChallenge(event) {
      this.selectedChallengeId = parseInt(event.target.value);
      this.challenge = this.challenges.find(challenge => challenge.id == this.selectedChallengeId);
      this.updateAttempts(this.selectedAttemptId);
    },

    selectAttempt(event) {
      this.selectedAttemptId = parseInt(event.target.value);
      this.selectedAttempt = this.challenge_attempts.find(attempt => attempt.id == this.selectedAttemptId);
      this.updateSolutionViewer();
    },

    getAttemptUserName(attempt) {
      var user = this.users.find(user => user.id == attempt.player_id)
      return user.name;
    },

    async getAttempts() {
      try {
        const response = await this.$axios.get(this.$api_link + '/challenges/attempts/', this.auth.config);
        this.attempts = response.data;
      } catch (error) {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      }
    },

    async getChallenges() {
      try {
        const response = await this.$axios.get(this.$api_link + '/challenges/', this.auth.config);
        this.challenges = response.data;
      } catch (error) {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      }
    },

    async getUsers() {
      try {
        const response = await this.$axios.get(this.$api_link + '/users/', this.auth.config);
        this.users = response.data;
      } catch (error) {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      }
    },

    async getDictionary() {
      try {
        const response = await this.$axios.get(this.$api_link + '/code-file-dictionary/', this.auth.config);
        this.dictionary = response.data;
      } catch(error) {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      }
    },

    updateAttempts() {
      if (this.selectedChallengeId < 1 || this.challenges.length < 1) {
        this.challenge_attempts = [];
        this.preconditions = [];
        this.tests = [];
        this.solution.defaultState();
        this.solution.generateState();
        return;
      } 

      this.preconditions = this.challenge.passing_criteria.preconditions;

      this.tests = this.challenge.passing_criteria.tests
      this.challenge_attempts = this.attempts[this.selectedChallengeId]
      this.solution.defaultState()
      this.solution.generateState()

      if (this.challenge_attempts.length > 0) {
        this.selectedAttemptId = this.challenge_attempts[0].id
        this.selectedAttempt = this.challenge_attempts[0]
        this.updateSolutionViewer()
      } else {
        this.selectedAttempt = null
        this.challenge_attempts = []
        this.preconditions = []
        this.tests = []
      }
    },

    updateSolutionViewer() {
      this.solution.defaultState()
      this.solution.generateState()
     
      if (this.selectedAttempt == {} || this.selectedAttempt == null || this.selectedAttempt == undefined) {
        this.selectedAttempt = null
        return
      }

      this.solution.changeState(this.selectedAttempt.test_cases)
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
    },

    getPosition(position) {
      return '(' + position.x + ', ' + position.y + ')'
    },

    getLog() {
      // console.log(this.solution.log[this.solution.currentKey])
      if (this.solution.log != {}) {
        return this.solution.log[this.solution.currentKey]
      }
      return null
    }
  },
}
</script>
