<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Editor</h2>
  </div>
  <div class="container" style="display: flex; justify-content: center; margin-bottom: 10px;">
    <div class="row" style="justify-content: center; display: flex; flex-direction: row;">
      <div class="col">
        <div class="row" style="width: 100%; margin: 0px;">
          <h5 style="padding: 0px; margin-bottom: 5px;">Code File</h5>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Choose an existing code file below.</p>
        </div>
        <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
          <select class="button is-primary guide-button" id="code-file-select" style="width: 650px;">
            <option @click="this.selectCode(code.id)" v-for="code in codeFiles" :value="code.id">{{ code.name }}</option>
          </select>
        </div>
        <div class="row" style="width: 100%; padding: 0px; margin: 0px;">
          <CodeBlock id="code-block-example" class="line-numbers" theme="default" height="440px" data-line="1"
            :prismjs="true" :name="name" :code="codeString" lang="javascript" prism-js
            style="font-size: 16px; width: 650px;" :copy-icon="false" :copy-button="false" :copy-tab="false"
            :tabs="false" />
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
          <select class="button is-primary guide-button" id="board-state-select">
            <option @click="this.selectState(state.id)" v-for="state in boardStates" :value="state.id">{{ state.name }}
            </option>
          </select>
        </div>
        <div class="row" style="padding: 0px; margin: 0px;">
          <BoardChecker />
        </div>
      </div>
    </div>
  </div>
  <div class="container" style="display: flex; justify-content: center; flex-direction: column; margin-bottom: 15px;">
    <div class="row" style="width: 100%; text-align: left; justify-content: start; display: flex;">
      <h5 style="text-align: left; margin-bottom: 5px;">Validation Expression Maker</h5>
    </div>
    <div class="row" style="font-size: 10px;">
      <p style="margin-bottom: 5px;">If a submission is correct, the expression must return True.</p>
    </div>
    <div class="row">
      <div class="col">
        <div class="row" style="margin-bottom: 5px;">
          <div class="row">
            <h6 style="text-align: left; margin-bottom: 5px;">Test Cases Count</h6>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">Challenges with multiple cases require different function calls.</p>
          </div>
          <div class="row" style="margin: 0px;">
            <input id="test-case-count-input" style="margin-left: 0px; margin-right: 0px;" class="box" type="number"
              min="1" max="16" value="1" :v-model="this.testCasesCount" @change="this.changeCount($event)" />
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px; text-align: justify;">For challenges of only 1 test case, only 1 board is
              needed.
              <em>currentKey</em> then represents the one existing board state. In challenges with more cases,
              <em>case_num</em>
              is used as an iterator. All board states are covered in validation!
            </p>
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
                <select class="button is-primary guide-button" id="coverage-select" style="width: 100%;">
                  <option @click="this.selectCoverage(coverage)" v-for="coverage in coverageTypes" :value="coverage">{{
                    coverage }}
                  </option>
                </select>
              </div>
              <div class="col" style="padding: 0px;">
                <select class="button is-primary guide-button" id="difficulty-select" style="width: 100%;">
                  <option @click="this.selectDifficulty(difficulty)" v-for="difficulty in difficulties"
                    :value="difficulty">
                    {{ difficulty }}
                  </option>
                </select>
              </div>
            </div>
          </div>
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
          <input id="input-name-box" class="box" @input="this.changeName($event)" type="text"
            placeholder="Challenge X.Y: Challenge Name" style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
      </div>
      <div class="row" style="margin-bottom: 5px;">
        <div class="col" id="description-input">
          <h6 style="text-align: left; margin-bottom: 5px;">Description</h6>
          <input id="input-description-box" @input="this.changeDescription($event)" class="box" type="text"
            placeholder="Anything about the challenge!" style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
      </div>
      <div class="row" style="margin-bottom: 5px;">
        <div class="col" id="hint-input">
          <h6 style="text-align: left; margin-bottom: 5px;">Hint</h6>
          <input id="input-hint-box" @input="this.changeHint($event)" class="box" type="text"
            placeholder="Anything to help the player!" style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
      </div>
      <div class="row" style="margin-bottom: 5px;">
        <div class="col" id="objective-input">
          <h6 style="text-align: left; margin-bottom: 5px;">Objective</h6>
          <input id="input-objective-box" @input="this.changeObjective($event)" class="box" type="text"
            placeholder="[COVERAGE] coverage of line X." style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
      </div>
      <div class="row" style="margin-bottom: 7.5px;">
        <div class="col" id="score-input">
          <h6 style="text-align: left; margin-bottom: 5px;">Score</h6>
          <p style="font-size: 10px; margin-bottom: 5px;">The more test cases, the more points a player should get!</p>
          <input id="input-score-box" inputmode="numeric" @input="this.changeScore($event)" class="box" type="number"
            max-length="5" min="100" pattern="[0-9]{5}" value="100" step="25"
            style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
        <div class="col" id="condition-count-input"
          v-if="this.selectedCoverage == 'condition' || this.selectedCoverage == 'mcdc' || this.selectedCoverage == 'path'">
          <h6 style="text-align: left; margin-bottom: 5px;">Condition Count</h6>
          <p style="font-size: 10px; margin-bottom: 5px;">Remember, for a condition with X variables, we get 2<sup>x</sup>
            possible test cases!</p>
          <input id="input-condition-box" @input="this.changeConditionCount($event)" class="box" type="number"
            placeholder="Number of variables." value="1" min="0" max="5"
            style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
        <div class="col disabled" id="condition-count-input" v-else>
          <h6 style="text-align: left; margin-bottom: 5px;">Condition Count</h6>
          <p style="font-size: 10px; margin-bottom: 5px;">Remember, for a condition with X variables, we get 2<sup>x</sup>
            possible test cases!</p>
          <input id="input-condition-box" @input="this.changeConditionCount($event)" class="box" type="number" max="10"
            placeholder="Number of variables." style="margin: 0px; width: 100%; font-size: 18px;" />
        </div>
      </div>
    </div>
    <div class="row" style="margin: 5px; justify-content: center; display: flex;">
      <button class="box" style="padding: 7.5px;" @click="validateExpression()">
        Validate
      </button>
    </div>
  </div>
  <div class="container" style="display: flex; justify-content: center; flex-direction: column;">
    <div class="row">
      <h5 style="padding: 0px; margin-bottom: 5px;">Challenge Validation</h5>
    </div>
    <div class="row" style="font-size: 10px;">
      <p style="padding: 0px; margin-bottom: 10px;">Check if the challenge is ready to be submitted. P stands for Precondition, T for Test. Green means True, red
        means False.</p>
    </div>
    <div class="row">
      <div class="col" style="display: flex; flex-direction: column; max-height: 445px;">
        <div style="margin-bottom: 10px;" v-if="this.challenge.passing_criteria.preconditions.length != 0">
          <div class="row" :id="'test-info-' + index" v-for="(precondition, index) in this.challenge.passing_criteria.preconditions">
            <div class="col" style="max-width: 90%; padding: 0px;">
              <div class="alert alert-info player-info" style="display: flex; justify-content: start;">
                <div class="col" style="max-width: 10%; align-self: center;">
                  <strong style="margin-right: 2.5px;">{{ 'P' + (index + 1) + ':' }}</strong>
                </div>
                <div class="col" style="max-width: 90%">
                  <textarea class="box" rows="5" :value="precondition" style="width: 100%; text-align: start;"
                    @input="this.changePreconditionExpression($event, index)" />
                </div>
              </div>
            </div>
            <div class="col" style="display: flex; flex-direction: column; max-width: 10%; align-self: center;">
              <button class="box" style="padding: 10px; border-radius: 50px; " @click="this.addPrecondition(index)">
                <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
              </button>
              <button class="box" style="padding: 10px; border-radius: 50px; " @click="this.removePrecondition(index)">
                <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
              </button>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 10px;" id="tests-row" v-if="this.challenge.passing_criteria.tests.length != 0">
          <div class="row" :id="'test-info-' + index" v-for="(test, index) in this.challenge.passing_criteria.tests">
            <div class="col" style="max-width: 90%; padding: 0px;">
              <div class="alert alert-info player-info" style="display: flex; justify-content: start;">
                <div class="col" style="max-width: 10%; align-self: center;">
                  <strong style="margin-right: 2.5px;">{{ 'T' + (index + 1) + ':' }}</strong>
                </div>
                <div class="col" style="max-width: 90%">
                  <textarea class="box" rows="5" :value="test" style="width: 100%; text-align: start;"
                    @input="this.changeTestExpression($event, index)" />
                </div>
              </div>
            </div>
            <div class="col" style="display: flex; flex-direction: column; max-width: 10%; align-self: center;">
              <button class="box" style="padding: 10px; border-radius: 50px; " @click="this.addTest(index)">
                <font-awesome-icon icon="plus" style="color: rgb(169, 89, 255)" />
              </button>
              <button class="box" style="padding: 10px; border-radius: 50px; " @click="this.removeTest(index)">
                <font-awesome-icon icon="trash" style="color: rgb(169, 89, 255)" />
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div style="padding: 0px; margin-bottom: 10px;">
            <div class="alert alert-success player-info" v-if="this.boardChecker.passed">
              OK! You passed the challenge you just made. Click the button below to submit the challenge!
            </div>
            <div class="alert alert-danger player-info" v-else-if="this.boardChecker.failed">
              You didn't pass. Keep trying. You need to pass your own challenge to submit it.
            </div>
            <div class="alert alert-secondary player-info disabled" v-else>
              When you try passing your challenge, the result will be here.
            </div>
          </div>
          <div class="row">
            <button class="box is-primary" style="min-width: 100%; padding: 10px; margin: 10px;"
              v-if="this.boardChecker.passed" @click="this.submitChallenge()">
              Submit Challenge
            </button>
          </div>
        </div>
      </div>
      <div class="col">
        <ChallengeChecker :challenge="this.challenge" />
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
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardChecker from '../components/BoardChecker.vue'
import { boardCreatorStore } from '../store/boardCreator'
import { boardCheckerStore } from '../store/boardChecker'
import ChallengeChecker from '../components/ChallengeChecker.vue'

import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";
import * as utils from '../store/utils.js'

export default {
  async beforeMount() {
    this.boardCreator = boardCreatorStore()
    this.boardChecker = boardCheckerStore()

    await this.$axios.get(this.$api_link + '/challenges/' + this.id).then((response) => {
      this.challenge = response.data
    })

    await this.$axios.get(this.$api_link + '/board-states/').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
      })
    })

    await this.$axios.get(this.$api_link + '/code-files/').then((response) => {
      response.data.forEach((codeFile) => {
        this.codeFiles.push(codeFile)
      })
    })

    // Code file and initial board.
    document.getElementById('code-file-select').value = this.challenge.code_file
    this.codeString = this.codeFiles[this.challenge.code_file - 1].content
    document.getElementById('board-state-select').value = this.challenge.initial_board
    this.selectState(this.challenge.initial_board)

    // Test case count.
    document.getElementById('test-case-count-input').value = this.challenge.passing_criteria.tests.length + this.challenge.passing_criteria.preconditions.length

    // Coverage and difficulty
    document.getElementById('coverage-select').value = this.challenge.challenge_type
    document.getElementById('difficulty-select').value = this.challenge.difficulty

    // Challenge details.
    document.getElementById('input-name-box').value = this.challenge.name
    document.getElementById('input-description-box').value = this.challenge.description
    document.getElementById('input-hint-box').value = this.challenge.hint
    document.getElementById('input-objective-box').value = this.challenge.objective
    document.getElementById('input-score-box').value = this.challenge.score
    document.getElementById('input-condition-box').value = this.challenge.passing_criteria.condition_count
  },

  props: {
    id: Number
  },

  data() {
    return {
      boardStates: [],
      codeFiles: [],
      selectedBoard: '',
      selectedDifficulty: 'Very Easy',
      selectedCoverage: 'statement',
      stateName: '',
      selectedCode: '',
      codeString: '',
      challenge: null,
      challengeName: '',
      challengeDescription: '',
      challengeHint: '',
      challengeScore: 100,
      challengeObjective: '',
      conditionCount: 0,
      coverageTypes: ['statement', 'decision', 'condition', 'mcdc', 'path'],
      difficulties: ['Very Easy', 'Easy', 'Normal', 'Hard', 'Very Hard'],
      selectedInput: '',
      testCasesCount: 1,
      valid: {
        1: true
      },
      errors: {
        1: 'Errors will appear here.'
      },
      success: 'No errors found!'
    }
  },

  methods: {
    addTest(index) {
      this.challenge.passing_criteria.tests.splice(index + 1, 0, '')
    },

    removeTest(index) {
      this.challenge.passing_criteria.tests.splice(index, 1)
    },

    addPrecondition(index) {
      this.challenge.passing_criteria.preconditions.splice(index + 1, 0, '')
    },

    removePrecondition(index) {
      this.challenge.passing_criteria.preconditions.splice(index, 1)
    },

    // 65 is A, 97 is a
    changeTestExpression(event, index) {
      this.challenge.passing_criteria.tests[index] = event.target.value
    },

    changePreconditionExpression(event, index) {
      this.challenge.passing_criteria.preconditions[index] = event.target.value
    },

    changeName(event) {
      this.challengeName = event.target.value;
    },

    changeDescription(event) {
      this.challengeDescription = event.target.value;
    },

    changeHint(event) {
      this.challengeHint = event.target.value;
    },

    changeObjective(event) {
      this.challengeObjective = event.target.value;
    },

    changeScore(event) {
      if (isNaN(event.target.value)) {
        this.challengeScore = this.challengeScore
        return
      }
      this.challengeScore = event.target.value
    },

    changeConditionCount(event) {
      this.conditionCount = event.target.value;
    },

    selectState(id) {
      this.selectedBoard = id
      this.boardCreator.changeState(this.boardStates[id - 1])
    },

    selectCode(id) {
      this.selectedCode = id
      this.codeString = this.codeFiles[id - 1].content
    },

    selectCoverage(coverage) {
      this.selectedCoverage = coverage
    },

    selectDifficulty(diff) {
      this.selectedDifficulty = diff
    },

    changeCount(event) {
      var newValue

      this.testCasesCount = event.target.value

      if (this.tests.length > 1) {
        newValue = 'case_num'
      } else {
        newValue = 'input.currentKey'
      }
    },

    validateExpression() {
      this.boardChecker.initialState = this.boardStates[this.challenge.initial_board - 1]
      this.boardChecker.setState()

      // Precondition and test cases.
      this.preconditions = [], this.tests = []
      this.challenge.passing_criteria.preconditions.forEach((precondition) => {
        this.preconditions.push(precondition)
      })
      this.challenge.passing_criteria.tests.forEach((test) => {
        this.tests.push(test)
      })
    },

    async submitChallenge(challenge) {

      await this.$axios.post(this.$api_link + '/create/challenge', this.challenge)
        .then((response) => {
          if (response.status == 200) {
            alert('Challenge submitted successfully!')
            window.location.href = '/'
          } else {
            alert('There was an error submitting the challenge. Try again.')
          }
        })
    }
  },
  components: {
    Menu,
    'code-editor': CodeEditor,
    BoardChecker,
    ChallengeChecker
  },
}
</script>