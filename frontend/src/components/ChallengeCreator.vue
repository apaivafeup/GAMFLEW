<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div class="container" style="max-width: 95% !important;" v-if="auth.user.user_type == 'admin'">
    <div style="display: flex; flex-direction: column; justify-content: center; margin-bottom: 10px;">
      <div class="row" style="justify-content: center; display: flex; flex-direction: row;">
        <div class="col">
          <div class="row" style="width: 100%; margin: 0px;">
            <h5 style="padding: 0px; margin-bottom: 5px;">Code File</h5>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">Choose an existing code file below.</p>
          </div>
          <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
            <select class="button is-primary guide-button" id="code-file-select" style="width: 650px;"
              :value="challenge?.code_file" @change="selectCode(selectedCode)" v-model="selectedCode">
              <option v-for="code in codeFiles" :value="code.id">{{ code.name }}
              </option>
            </select>
          </div>

          <div class="row" style="width: 100%; padding: 0px; margin: 0px;">
            <CodeBlock @change="Prism.highlightAll()" class="col line-numbers" theme="default" height="445px"
              data-line="1" :prismjs="true" :code="codeFiles[challenge?.code_file - 1]?.content" lang="javascript"
              prism-plugin prism-js style="font-size: 16px; overflow: scroll; margin-bottom: 5px; width: 650px;"
              :copy-icon="false" :copy-button="false" :copy-tab="false" :tabs="false" />
          </div>
        </div>
        <div class="col">
          <div class="row" style="width: 100%; margin: 0px;">
            <h5 style="padding: 0px; margin-bottom: 5px;">Board State</h5>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">Choose an existing board state below.</p>
          </div>
          <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
            <select class="button is-primary guide-button" id="board-state-select" :value="challenge?.initial_board"
              v-model="selectedBoard" @change="selectState(selectedBoard)">
              <option v-for="state in boardStates" :id="state.name + '-option'" :value="state.id">{{ state.name }}
              </option>
            </select>
          </div>
          <div class="row" style="padding: 0px; margin: 0px;">
            <BoardChecker />
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <div class="row">
          <h5 style="text-align: left; margin-bottom: 5px;">Challenge Details</h5>
        </div>
        <div class="row" style="font-size: 10px; margin-bottom: 7.5px;">
          <p style="margin-bottom: 5px;">Fill out these details for the challenge.</p>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col" id="name-input">
            <h6 style="text-align: left; margin-bottom: 5px;">Name</h6>
            <input id="input-name-box" class="box" @input="changeName($event)" type="text"
              placeholder="Challenge X.Y: Challenge Name" style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
        </div>
        <!-- <div class="row" style="margin-bottom: 5px;">
          <div class="col" id="description-input">
            <h6 style="text-align: left; margin-bottom: 5px;">Description</h6>
            <input id="input-description-box" @input="changeDescription($event)" class="box" type="text"
              placeholder="Anything about the challenge!" style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
        </div> -->
        <div class="row" style="margin-bottom: 5px;">
          <div class="col" id="hint-input">
            <h6 style="text-align: left; margin-bottom: 5px;">Hint</h6>
            <input id="input-hint-box" @input="changeHint($event)" class="box" type="text"
              placeholder="Anything to help the player!" style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col" id="objective-input">
            <h6 style="text-align: left; margin-bottom: 5px;">Objective</h6>
            <input id="input-objective-box" @input="changeObjective($event)" class="box" type="text"
              placeholder="[COVERAGE] coverage of line X." style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
        </div>
        <div class="row" style="margin-bottom: 7.5px;">
          <div class="col" id="score-input">
            <h6 style="text-align: left; margin-bottom: 5px;">Score</h6>
            <p style="font-size: 10px; margin-bottom: 5px;">The more test cases, the more points a player should get!
            </p>
            <input id="input-score-box" inputmode="numeric" @input="changeScore($event)" class="box" type="number"
              max-length="5" min="100" pattern="[0-9]{5}" value="100" step="25"
              style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
          <div class="col" id="condition-count-input"
            v-if="challenge?.challenge_type == 'condition' || challenge?.challenge_type == 'mcdc' || challenge?.challenge_type == 'condition/decision'">
            <h6 style="text-align: left; margin-bottom: 5px;">Condition Count</h6>
            <p style="font-size: 10px; margin-bottom: 5px;">Remember, for a condition with X variables, we get
              2<sup>x</sup>
              possible test cases!</p>
            <input id="input-condition-box" @input="changeConditionCount($event)" class="box" type="number"
              placeholder="Number of variables." value="1" min="0" max="5"
              style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
          <div class="col disabled" id="condition-count-input" v-else>
            <h6 style="text-align: left; margin-bottom: 5px;">Condition Count</h6>
            <p style="font-size: 10px; margin-bottom: 5px;">Remember, for a condition with X variables, we get
              2<sup>x</sup>
              possible test cases!</p>
            <input id="input-condition-box" @input="changeConditionCount($event)" class="box" type="number" max="10"
              placeholder="Number of variables." style="margin: 0px; width: 100%; font-size: 18px;" />
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Coverage & Difficulty</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px; text-align: justify;">Each challenge must have a singular coverage type
                associated.<br />A difficulty level is also required.</p>
            </div>
            <div class="row" style="margin: 0px;">
              <div class="col" style="padding: 0px; margin-right: 5px;">
                <select class="button is-primary guide-button" id="coverage-select" style="width: 100%;"
                  v-model="selectedCoverage" @change="selectCoverage(selectedCoverage)">
                  <option v-for="coverage in coverageTypes" :value="coverage">
                    {{ coverage }}
                  </option>
                </select>
              </div>
              <div class="col" style="padding: 0px;">
                <select class="button is-primary guide-button" id="difficulty-select" style="width: 100%;"
                  :value="challenge?.difficulty" @change="selectDificulty(selectedDificulty)"
                  v-model="selectedDificulty">
                  <option v-for="difficulty in difficulties" :value="difficulty">
                    {{ difficulty }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: center; flex-direction: column;">
      <div class="row">
        <h5 style="padding: 0px; margin-bottom: 5px;">Challenge Validation</h5>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="padding: 0px; margin-bottom: 10px;">Check if the challenge is ready to be submitted. Assertion stands
          for
          Assertions, T for Test. Green means True, red
          means False.</p>
      </div>
      <div class="row" style="margin-bottom: 10px; justify-content: start; display: flex;">
        <div class="col" style="padding: 0px; max-width: 10%; display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        align-items: center;">
          <button class="box" style="width: 100%; padding: 20px;" @click="addTest(index)" v-if="!boardChecker.passed">
            Add Test
          </button>
          <button class="box disabled" style="width: 100%; padding: 20px;" v-else>
            Add Test
          </button>
          <button class="box" style="width: 100%; padding: 20px;" @click="addPrecondition(index)"
            v-if="!boardChecker.passed">
            Add Assertion
          </button>
          <button class="box disabled" style="width: 100%; padding: 20px;" v-else>
            Add Assertion
          </button>
          <div class="row" style="text-align: center; font-size: 15px;">
            <p style="margin: 0px;">Assertions: <strong>
                {{ preconditions.length }}
              </strong>
            </p>
          </div>
          <div class="row" style="text-align: center; font-size: 15px;">
            <p style="margin: 0px;">Tests: <strong>
                {{ tests.length }}
              </strong>
            </p>
          </div>
        </div>
        <div class="col"
          style="max-width: 90%; display: grid; grid-template-columns: 35% 27.5% 37.5%; grid-gap: 5px; padding-left: -12px;">
          <ChallengeCreatorInfo />
        </div>

      </div>
      <div class="row"
        style="display: grid; grid-template-columns: 48% 50%; grid-gap: 2vw; grid-template-rows: 100%; max-height: 100%;">
        <div class="col" style="display: flex; flex-direction: column; max-height: 537px; overflow-y: scroll;">
          <div v-if="preconditions.length != 0">
            <div class="row" style="margin-bottom: 10px;" :id="'precondition-info-' + index"
              v-for="(precondition, index) in preconditions">
              <div class="col" style="max-width: 90%; padding: 0px;">
                <div class="alert alert-info player-info precondition-alert" :id="'precondition-info-alert-' + index"
                  style="display: flex; justify-content: start;">
                  <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                    <strong style="margin-right: 2.5px;">{{ 'A' + (index + 1) + ':' }}</strong>
                  </div>
                  <div class="col" style="max-width: 90%">
                    <textarea class="box" rows="5" :value="precondition" style="width: 100%; text-align: start;"
                      @input="changePreconditionExpression($event, index)" />
                  </div>
                </div>
              </div>
              <div class="col" style="display: flex; flex-direction: column; max-width: 10%; align-self: center;">
                <button class="box" style="padding: 10px; border-radius: 50px; " @click="addPrecondition(index)"
                  v-if="!boardChecker.passed">
                  <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box disabled" style="padding: 10px; border-radius: 50px; "
                  @click="addPrecondition(index)" v-else>
                  <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box" style="padding: 10px; border-radius: 50px; " @click="removePrecondition(index)"
                  v-if="!boardChecker.passed">
                  <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box disabled" style="padding: 10px; border-radius: 50px; "
                  @click="removePrecondition(index)" v-else>
                  <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
                </button>
              </div>
            </div>
          </div>
          <div style="margin-bottom: 10px;" id="tests-row" v-if="tests.length != 0">
            <div class="row" style="margin-bottom: 10px;" :id="'test-info-' + index" v-for="(test, index) in tests">
              <div class="col" style="max-width: 90%; padding: 0px;">
                <div class="alert alert-info player-info test-alert" :id="'test-info-alert-' + index"
                  style="display: flex; justify-content: start;">
                  <div class="col" style="max-width: 10%; align-self: center; text-align: center;">
                    <strong style="margin-right: 2.5px;">{{ 'T' + (index + 1) + ':' }}</strong>
                  </div>
                  <div class="col" style="max-width: 90%">
                    <textarea class="box" rows="5" :value="test" style="width: 100%; text-align: start;"
                      @input="changeTestExpression($event, index)" />
                  </div>
                </div>
              </div>
              <div class="col" style="display: flex; flex-direction: column; max-width: 10%; align-self: center;">
                <button class="box" style="padding: 10px; border-radius: 50px; " @click="addTest(index)"
                  v-if="!boardChecker.passed">
                  <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box disabled" style="padding: 10px; border-radius: 50px; " @click="addTest(index)"
                  v-else>
                  <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box" style="padding: 10px; border-radius: 50px; " @click="removeTest(index)"
                  v-if="!boardChecker.passed">
                  <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
                </button>
                <button class="box disabled" style="padding: 10px; border-radius: 50px; " @click="removeTest(index)"
                  v-else>
                  <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col" style="display: flex; justify-content: end; flex-direction: row; padding: 0px;">
          <ChallengeChecker :challenge="challenge" />
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 10px;">
      <div style="padding: 0px; margin-bottom: 10px;">
        <div class="alert alert-success player-info" v-if="boardChecker.passed">
          OK! You passed the challenge you just made. Click the button below to submit the challenge!
        </div>
        <div class="alert alert-danger player-info" v-else-if="boardChecker.failed">
          You didn't pass. Keep trying. You need to pass your own challenge to submit it.
        </div>
        <div class="alert alert-secondary player-info" v-else>
          When you try passing your challenge, the result will be here.
        </div>
      </div>
      <div class="" style="display: flex; justify-content: center; align-items: center; flex-direction: row;">
        <button id="submit-challenge-button" class="box is-primary" style="min-width: 50%; padding: 10px; margin: 10px;"
          v-if="boardChecker.passed" @click="submitChallenge()">
          Submit Challenge
        </button>
        <button class="box is-primary disabled" style="min-width: 50%; padding: 10px; margin: 10px;" v-else>
          Submit Challenge
        </button>
        <button id="delete-challenge-button" class="box is-primary" style="min-width: 50%; padding: 10px; margin: 10px;"
          v-if="challenge.id > 99" @click="deleteChallenge()">
          Delete Challenge
        </button>
        <button class="box is-primary disabled" style="min-width: 50%; padding: 10px; margin: 10px;" v-else>
          Delete Challenge
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
</script>

<script>
import GameCredits from '../pages/GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardChecker from '../components/BoardChecker.vue'
import { boardCreatorStore } from '../store/boardCreator.js'
import { boardCheckerStore } from '../store/boardChecker.js'
import ChallengeChecker from '../components/ChallengeChecker.vue'
import ChallengeCreatorInfo from '../components/ChallengeCreatorInfo.vue'

import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";
import * as utils from '../store/utils.js'
import { authStore } from '../store/authStore.js'

import { h, resolveComponent, getCurrentInstance } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import Prism from 'prismjs'

export default {
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
      }, this.$slots.default);

    this.boardCreator = boardCreatorStore()
    this.boardChecker = boardCheckerStore()
    this.auth = authStore()
    this.auth.checkAuth()

    await this.getBoardStates()
    await this.getCodeFiles()
    await this.getDictionary()

    if (this.id != null) {
      await this.getChallenge()

      if (this.$error) {
        loader.hide()
        return
      }

      this.preconditions = [], this.tests = [], this.expressionType = {}
      var j = 1;
      for (var i = 0; i < this.challenge.passing_criteria.preconditions.length; i++) {
        this.expressionType[j] = 'precondition'
        j++
      }
      for (var i = 0; i < this.challenge.passing_criteria.tests.length; i++) {
        this.expressionType[j] = 'test'
        j++
      }

      this.challenge.passing_criteria.preconditions.forEach((precondition) => this.preconditions.push(this.makeExpression(precondition, true)))
      this.challenge.passing_criteria.tests.forEach((test) => this.tests.push(this.makeExpression(test, true)))

      // Code file and initial board.
      this.selectState(this.challenge.initial_board)

      // Coverage and difficulty
      document.getElementById('coverage-select').value = this.challenge.challenge_type
      document.getElementById('difficulty-select').value = this.challenge.difficulty

      // Challenge details

      document.getElementById('input-name-box').value = this.challenge.name
      document.getElementById('input-hint-box').value = this.challenge.hint
      document.getElementById('input-objective-box').value = this.challenge.objective
      document.getElementById('input-score-box').value = this.challenge.score
      document.getElementById('input-condition-box').value = this.challenge.passing_criteria.expression_count
      this.selectedCode = this.challenge.code_file
      this.selectedBoard = this.challenge.initial_board

    }

    loader.hide()
    Prism.highlightAll()
  },

  props: {
    id: String
  },

  data() {
    return {
      boardStates: [],
      codeFiles: [],
      selectedBoard: 1,
      stateName: 'empty',
      selectedCode: 1,
      selectedCoverage: 'statement',
      selectedDificulty: 'Very Easy',
      challenge: {
        id: 0,
        name: '',
        hint: '',
        owner_id: 0,
        objective: '',
        score: 100,
        difficulty: 'Very Easy',
        challenge_type: 'statement',
        initial_board: 1,
        test_cases_count: 1,
        code_file: 1,
        passing_criteria: {
          expression_count: 0,
          preconditions: [''],
          tests: ['']
        },
        visible: false
      },
      preconditions: [''],
      tests: [''],
      codeString: '',
      coverageTypes: ['statement', 'decision', 'condition', 'mcdc', 'condition/decision'],
      difficulties: ['Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard'],
      selectedInput: '',
      expressionType: {
        1: 'precondition',
        2: 'test'
      },
      valid: {
        1: true
      },
      errors: {
        1: 'Errors will appear here.'
      },
      success: 'No errors found!',
      boardAccess: '',
    }
  },

  methods: {
    addTest(index) {
      if (this.challenge.test_cases_count > 1 && this.challenge.challenge_type == 'statement') {
        alert('For statement coverage, you can only have one test case. Did you mean to add a precondition?')
        return
      }

      this.tests.splice(index + 1, 0, '')
      this.challenge.passing_criteria.tests.splice(index + 1, 0, '')
      this.expressionType[index] = 'test'
      this.challenge.test_cases_count += 1
    },

    removeTest(index) {
      if (this.challenge.test_cases_count - 1 < 1) {
        alert('At least one test is required. Did you mean to remove a precondition?')
        return
      }

      this.tests.splice(index, 1)
      this.challenge.passing_criteria.tests.splice(index, 1)
      delete this.expressionType[index + 1]
      this.challenge.test_cases_count -= 1
    },

    addPrecondition(index) {
      this.preconditions.splice(index + 1, 0, '')
      this.expressionType[index] = 'precondition'
    },

    removePrecondition(index) {
      this.preconditions.splice(index, 1)
      this.challenge.passing_criteria.preconditions.splice(index, 1)
      delete this.expressionType[index + 1]
    },

    makeExpression(expression, reverse = false) {
      var dict = this.dictionary

      var boardAccess
      if (Object.entries(this.expressionType).filter(([k, v]) => v == 'test').length > 1) {
        boardAccess = 'case_num'
      } else {
        boardAccess = 'input.currentKey'
      }

      if (reverse) {
        expression = expression.replaceAll(boardAccess, 'X')

        var array = Object.entries(dict).sort((a, b) => b[1].length - a[1].length)
        for (var entry in array) {
          expression = expression.replaceAll(array[entry][1], array[entry][0])
        }

        return expression
      }

      var array = Object.entries(dict).sort((a, b) => b[0].length - a[0].length)
      for (var item in array) {
        var regex = new RegExp('board.log[[A-z]+].start||board.log[[A-z]+].destination')
        if (array[item][0] == 'start' || array[item][0] == 'destination') {
          if (regex.test(expression)) {
            continue
          }
        }
        expression = expression.replaceAll(array[item][0], array[item][1])
      }

      expression = expression.replaceAll('X', boardAccess)

      return expression
    },

    // 65 is A, 97 is a
    changeTestExpression(event, index) {
      this.tests[index] = event.target.value
      this.challenge.passing_criteria.tests[index] = this.makeExpression(this.tests[index])
    },

    changePreconditionExpression(event, index) {
      this.preconditions[index] = event.target.value
      this.challenge.passing_criteria.preconditions[index] = this.makeExpression(this.preconditions[index])
    },

    changeName(event) {
      this.challenge.name = event.target.value;
    },

    // changeDescription(event) {
    //   this.challenge.description = event.target.value;
    // },

    changeHint(event) {
      this.challenge.hint = event.target.value;
    },

    changeObjective(event) {
      this.challenge.objective = event.target.value;
    },

    changeScore(event) {
      if (isNaN(event.target.value)) {
        this.challenge.score = this.challenge.score
        return
      }
      this.challenge.score = event.target.value
    },

    changeConditionCount(event) {
      this.conditionCount = event.target.value;
    },

    selectState(id) {
      this.challenge.initial_board = id
      this.boardCreator.changeState(this.boardStates[id - 1])
      this.boardChecker.changeState(this.boardStates[id - 1])
    },

    selectCode(id) {
      this.challenge.code_file = id
      this.$forceUpdate();
    },

    selectCoverage(coverage) {
      this.challenge.challenge_type = coverage
    },

    selectDifficulty(diff) {
      this.challenge.difficulty = diff
    },

    async submitChallenge(challenge) {
      this.challenge.owner_id = this.auth.user.id

      if (this.id == null) {
        await this.$axios.post(this.$api_link + '/create/challenge', this.challenge, this.auth.config)
          .then((response) => {
            if (response.status == 200) {
              alert('Challenge submitted successfully!')
              this.$router.push({ name: 'challenge-manager' })
            } else {
              alert('There was an error submitting the challenge. Try again.')
            }
          })
      } else {
        await this.$axios.post(this.$api_link + '/update/challenge/' + this.id, this.challenge, this.auth.config)
          .then((response) => {
            if (response.status == 200) {
              alert('Challenge updated successfully!')
              this.$router.push({ name: 'challenge-manager' })
            } else {
              alert('There was an error updating the challenge. Try again.')
            }
          })
      }

    },

    async deleteChallenge() {
      await this.$axios.delete(this.$api_link + '/challenge/' + this.id, this.auth.config)
        .then((response) => {
          if (response.status == 200) {
            alert('Challenge deleted successfully!')
            this.$router.push({ name: 'challenge-manager' })
          } else {
            alert('There was an error deleting the challenge. Please try again.')
          }
        })
    },

    async getBoardStates() {
      await this.$axios.get(this.$api_link + '/board-states/', this.auth.config).then((response) => {
        response.data.forEach((board_state) => {
          this.boardStates.push(board_state)
        })
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      })
    },

    async getCodeFiles() {
      await this.$axios.get(this.$api_link + '/code-files/', this.auth.config).then((response) => {
        response.data.forEach((codeFile) => {
          this.codeFiles.push(codeFile)
        })
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        this.$error = true
      })
    },

    async getDictionary() {
      await this.$axios.get(this.$api_link + '/code-file-dictionary/', this.auth.config).then((response) => {
        this.dictionary = response.data
        //console.log(response.data)
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        this.$error = true
      })
    },

    async getChallenge() {
      await this.$axios.get(this.$api_link + '/challenges/' + this.id, this.auth.config).then((response) => {
        this.challenge = response.data
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        this.$error = true
      })
    }
  },

  updated() {
    Prism.highlightAll()
  },

  components: {
    Menu,
    'code-editor': CodeEditor,
    BoardChecker,
    ChallengeChecker,
    ChallengeCreatorInfo
  },
}
</script>