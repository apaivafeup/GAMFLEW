<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Creator</h2>
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
          <select class="button is-primary guide-button" style="width: 650px;">
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
          <select class="button is-primary guide-button">
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
        <div class="box" id="validation-expression-row" @change="this.badgeManager()"
          style="display: inline-block; padding: 5px; margin: 0px; margin-bottom: 5px; width: 100%; min-height: 687.5px;">
        </div>
      </div>
      <div class="col">
        <div class="row" style="margin-bottom: 5px;">
          <div style="width: 50%;">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Test Cases Count</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">Challenges with multiple cases require different function calls.</p>
            </div>
            <div class="row" style="margin: 0px;">
              <input style="margin-left: 0px; margin-right: 0px;" class="box" type="number" min="1" max="16" value="1"
                :v-model="this.testCasesCount" @change="this.changeCount($event)" />
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
          <div style="width: 50%">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Board State</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">Everything related to the board is accessible here.</p>
            </div>
            <div class="row"
              style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 30px; grid-template-columns: 150px 150px;">
              <button style="margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('board', 'input')">Board
                Grid
                (8x8)</button>
              <button style="margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('board_spot', 'input')">Board Grid
                (X, Y)
              </button>
              <button style="margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('log', 'input')">Log (All Movements)</button>
              <button style="margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('log_last', 'input')">Log
                (Last Movement)</button>
              <button style="margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('out_of_bounds', 'input')">Out
                of Bounds Spot</button>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="row">
            <h6 style="text-align: left; margin-bottom: 5px;">Auxiliary Functions</h6>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">To provide computed values from the board's state. Check the Guide if needed.
            </p>
          </div>
          <div class="row"
            style="margin: 0px; grid-gap: 6px; display: grid; grid-template-rows: 45px 45px; grid-template-columns: 100px 100px 100px 100px 100px 100px;">
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('isTriangle', 'auxiliary')">Triangle</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('distance', 'auxiliary')">Euclidean
              Distance</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('count_blue_pieces', 'auxiliary')"># of Blue
              Pieces</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('count_red_pieces', 'auxiliary')"># of Red
              Pieces</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('count_empty_spaces', 'auxiliary')">Empty
              Spaces</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_first_red_piece', 'auxiliary')">1st Red
              Piece</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_first_blue_piece', 'auxiliary')">1st
              Blue Piece</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_first_stack', 'auxiliary')">1st
              Stack</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_blue_pieces', 'auxiliary')">Blue
              Pieces</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_red_pieces', 'auxiliary')">Red
              Pieces</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box"
              @click="addBadge('find_stacks', 'auxiliary')">Stacks</button>
            <button style="padding: 10px 5px; font-size: 12px;" class="box" @click="addWildcardBadge()">
              Add Wildcard
            </button>
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Operators</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">To create Boolean expressions.</p>
            </div>
            <div class="row"
              style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 35px 35px; grid-template-columns: 100px 100px 100px 100px 100px 100px;">
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('less', 'operators')">
                &lt;</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('greater', 'operators')">>
              </button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('equal', 'operators')">=
              </button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('equality', 'operators')">== (SAME AS)</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('inequality', 'operators')">!= (DIFFERENT)</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('not', 'operators')">!
                (NOT)</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('and', 'operators')">&&
                (AND)</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('or', 'operators')">||
                (OR)</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('open_par', 'operators')">(</button>
              <button style="padding: 5px; margin-left: 0px; margin-right: 0px; font-size: 12px;" class="box"
                @click="addBadge('close_par', 'operators')">)</button>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Precondition or Test</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px; text-align: justify;">Preconditions must pass along with tests (they're
                verified before tests).
                In multiple test cases, <strong>they're applied before every test</strong>. They're not required.</p>
            </div>
            <div class="row" style="margin: 0px;">
              <button id="precondition-label" class="box"
                style="width: 100%; height: 45px; text-align: left; padding: 5px; background: rgb(169, 89, 255);"
                v-if="this.expressionType[this.selectedTestCase] != 'test'"
                @click="this.expressionType[this.selectedTestCase] = 'test'">
                Precondition
              </button>
              <button id="test-label" class="box"
                style="width: 100%; height: 45px; text-align: left; padding: 5px; background: #8adc6d;" v-else-if="this.testCasesCount != 1"
                @click="this.expressionType[this.selectedTestCase] = 'precondition'">
                Test
              </button>
              <button id="test-label" class="box disabled"
                style="width: 100%; height: 45px; text-align: left; padding: 5px; background: #8adc6d;" v-else>
                Test
              </button>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Coverage & Difficulty</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px; text-align: justify;">Each challenge must have a singular coverage type
                associated.<br />A difficulty level is also required.</p>
            </div>
            <div class="row" style="margin: 0px;">
              <select class="button is-primary guide-button">
                <option @click="this.selectCoverage(coverage)" v-for="coverage in coverageTypes" :value="coverage">{{
                  coverage }}
                </option>
              </select>
              <select class="button is-primary guide-button">
                <option @click="this.selectDifficulty(difficulty)" v-for="difficulty in difficulties" :value="difficulty">
                  {{ difficulty }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="row">
            <h6 style="text-align: left; margin-bottom: 5px;">Checking for Errors</h6>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">Validate and submit the expression.</p>
          </div>
          <div class="row"
            style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 45px; grid-template-columns: 150px 150px 150px 150px;">
            <button class="box" style="text-align: left; padding: 5px;" @click="checkExpression()">
              Check Errors
            </button>
            <button class="box" v-if="this.selectedTestCase != 1" style="text-align: left; padding: 5px;"
              @click="changeTestCase(-1)">
              Previous
            </button>
            <button class="box disabled" v-else style="text-align: left; padding: 5px;">
              Previous
            </button>
            <button class="box" v-if="this.selectedTestCase < this.testCasesCount" style="text-align: left; padding: 5px;"
              @click="changeTestCase(1)">
              Next
            </button>
            <button class="box disabled" v-else style="text-align: left; padding: 5px;">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-bottom: 10px;">
      <div class="row">
        <h6 style="text-align: left; margin-bottom: 5px;">Values</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">A piece (in any board spot) includes position <em>(x, y)</em> and color (empty,
          red, blue, stack). You can use any JavaScript function to fill these values, as long as you follow syntax.</p>
      </div>
      <div class="row">
        <div class="col" id="value-badges-inputs">

        </div>
      </div>
    </div>
    <div style="margin-bottom: 7.5px;">
      <div class="row">
        <h6 style="text-align: left; margin-bottom: 5px;">Errors</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Potential validation errors will appear here. Know that semantic errors are yours
          to catch!</p>
      </div>
      <div class="row" v-if="this.valid[this.selectedTestCase]">
        <div id="error-info" class="alert alert-success player-info" style="margin: 0px 10px; width: 98%">
          {{ this.success }}
        </div>
      </div>
      <div class="row" v-else>
        <div id="error-info" class="alert alert-danger player-info" style="margin: 0px 10px; width: 98%;">
          {{ this.errors[this.selectedTestCase] }}
        </div>
      </div>
    </div>

    <div>
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
      <p style="padding: 0px; margin-bottom: 10px;">Check if the challenge is ready to be submitted. Green means True, red means False.</p>
    </div>
    <div class="row">
      <div class="col" style="display: flex; flex-direction: column; max-height: 445px;">
        <div style="margin-bottom: 10px;" v-if="preconditions.length != 0">
          <div class="row">
            <h6 style="padding-left: 0px; margin-bottom: 5px;">Preconditions</h6>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">If a precondition fails, it's an immediate fail.</p>
          </div>
          <div class="row">
            <div :id="'precondition-info-' + index" class="alert alert-info player-info" style="display: flex; justify-content: space-between;"
              v-for="(precondition, index) in preconditions">
              <div class="col" style="max-width: 20%;">  
              <strong style="margin-right: 5px; align-self: center;">
                  {{ 'Precondition ' + (index + 1) + ': ' }}</strong>
                  </div>
                  <div class="col" style="max-width: 80%">
                    <input class="box" :value="precondition" style="width: 100%;" @input="this.changePreconditionExpression($event, index)" />
                  </div>
            </div>
          </div>
      </div>
      <div style="margin-bottom: 10px;" class="disabled" v-else>
        <div class="row">
          <h6 style="padding-left: 0px; margin-bottom: 5px;">Preconditions</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="padding-left: 0px;">No preconditions defined. If a precondition doesn't yield True, it's an immediate fail.</p>
        </div>
      </div>
      <div style="margin-bottom: 10px;" v-if="tests.length != 0">
        <div class="row">
          <h6 style="padding-left: 0px; margin-bottom: 5px;">Tests</h6>
        </div>
        <div class="row">
          <div class="alert alert-info player-info" style="display: flex; justify-content: start;" :id="'test-info-' + index" v-for="(test, index) in tests">
              <div class="col" style="max-width: 10%; align-self: center;">
                <strong style="margin-right: 2.5px;">{{ 'Test ' + (index + 1) + ':' }}</strong>
              </div>
              <div class="col" style="max-width: 90%">
                <input class="box" :value="test" style="width: 100%;" @input="this.changeTestExpression($event, index)" />
              </div>
                
          </div>
        </div>
      </div>
      <div style="margin-bottom: 10px;" class="disabled" v-else>
        <div class="row">
          <h6 style="padding-left: 0px; margin-bottom: 5px;">Tests</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="padding-left: 0px;">No tests defined... yet.</p>
        </div>
      </div>
      <div class="row">
        <div style="padding: 0px;">
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
          <button class="box is-primary" style="width: 100%; padding: 5px;" v-if="this.boardChecker.passed" @click="this.submitChallenge()">
            Submit Challenge
          </button>
        </div>
      </div>
      </div>
      <div class="col">
        <ChallengeChecker :challenge="this.challenge" />
      </div>
    </div>
</div></template>

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

    await this.$axios.get(this.$api_link + '/board-states').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
        this.selectedBoard = 1
      })
    })

    await this.$axios.get(this.$api_link + '/code-files').then((response) => {
      response.data.forEach((codeFile) => {
        this.codeFiles.push(codeFile)

        if (codeFile.id == 1) {
          this.selectedCode = 1
          this.codeString = codeFile.content
        }
      })
    })
  },

  data() {
    return {
      boardStates: [],
      codeFiles: [],
      expressionBadges: {
        1: ''
      },
      inputs: {
        1: ''
      },
      inputsValues: {
        1: []
      },
      expressionType: {
        1: 'test'
      },
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
      preconditions: [],
      tests: [],
      selectedInput: '',
      testCasesCount: 1,
      selectedTestCase: 1,
      badgeCount: 1,
      inputBadge: 1,
      selectedBadge: '',
      dictionary: {
        'board': 'input[X]',
        'board_spot': 'input.state[X][I][J]',
        'log': 'input.log[X]',
        'log_last': 'input.log[X][input.log[X].length - 1]',
        "less": '<',
        'greater': '>',
        'equal': '=',
        'equality': '==',
        'inequality': '!=',
        'not': '!',
        'and': '&&',
        'or': '||',
        "open_par": '(',
        "close_par": ')',
        'out_of_bounds': 'input.outOfBoundsState',
        'isTriangle': 'utils.isTriangle(I, J, M)',
        'distance': 'utils.distance(I, J)',
        'count_blue_pieces': 'utils.count_blue_pieces(L, I)',
        'count_red_pieces': 'utils.count_red_pieces(L, I)',
        'count_empty_spaces': 'utils.count_empty_spaces(L, I)',
        'find_first_red_piece': 'utils.find_first_red_piece(L, I)',
        'find_first_blue_piece': 'utils.find_first_blue_piece(L, I)',
        'find_first_stack': 'utils.find_first_stack(L, I)',
        'find_blue_pieces': 'utils.find_blue_pieces(L, I)',
        'find_red_pieces': 'utils.find_red_pieces(L, I)',
        'find_stacks': 'utils.find_stacks(L, I)',
      },
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

    addWildcardBadge() {
      var row = document.getElementById('validation-expression-row'),
        badge = document.createElement('span')

      badge.setAttribute('id', 'value-badge-' + this.inputBadge)
      badge.setAttribute('class', 'badge text-bg-wildcard')
      badge.setAttribute('style', 'display: inline-flex; width: auto; align-self: center;')

      var button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.setAttribute('class', 'btn-close')
      button.setAttribute('id', 'close-btn-' + this.badgeCount)
      button.style = 'margin-right: 2.5px;'

      badge.innerHTML = button.outerHTML + this.addValueBadge('(' + this.badgeCount + ')')
      row.appendChild(badge)

      document.getElementById('close-btn-' + this.badgeCount).onclick = function () {
        if (!this.parentElement.classList.contains('text-bg-input')) {
          for (var c = 1; c < this.parentElement.children.length; c++) {
            var child = this.parentElement.children[c]
            if (!isNaN(child.innerHTML))
              document.getElementById('value-badge-row-' + child.getAttribute('value-input')).remove()
          }
        }
        this.parentElement.remove()
      }

      this.badgeCount += 1

    },

    addInputBadge(placeholder) {
      var col = document.getElementById('value-badges-inputs')
      var row = document.createElement('div')
      row.setAttribute('class', 'row')
      row.setAttribute('id', 'value-badge-row-' + this.inputBadge)
      row.setAttribute('class', 'value-badge-row')
      row.setAttribute('style', 'display: flex;')

      var div, input
      div = document.createElement('div')
      div.setAttribute('style', 'display: flex; flex-wrap: nowrap; width: auto; align-self: center;')
      div.innerHTML = 'Value ' + this.inputBadge + ':'
      input = document.createElement('input')
      input.setAttribute('id', 'value-badge-input-' + this.inputBadge)
      input.setAttribute('type', 'text')
      input.setAttribute('class', 'box value-badge-input')
      input.setAttribute('style', 'width: 85%; max-width: auto;')
      input.value = placeholder

      row.innerHTML = div.outerHTML + input.outerHTML
      col.appendChild(row)
    },

    addValueBadge(placeholder) {
      var badge = document.createElement('span')
      //badge.setAttribute('id', 'expression-badge-' + this.badgeCount)
      badge.setAttribute('class', 'badge text-bg-values')

      var placeholderNum = placeholder.split('(').join('').split(')').join('')
      if (!isNaN(placeholderNum)) {
        badge.setAttribute('value-input', this.inputBadge)
        this.addInputBadge(this.inputBadge)
        placeholder = '(' + this.inputBadge + ')'
        this.inputBadge += 1
      }

      badge.onclick = function () {
        this.remove()
      }

      badge.innerHTML = placeholder
      return badge.outerHTML
    },

    addBadge(key, type) {
      var row = document.getElementById('validation-expression-row'),
        badge = document.createElement('span')

      badge.setAttribute('class', 'badge text-bg-' + type)
      badge.setAttribute('id', 'expression-badge-' + this.badgeCount)

      var boardAccess = 'case_num'
      if (this.testCasesCount == 1) {
        boardAccess = 'input.currentKey'
      }

      var html = this.dictionary[key]

      if (html.includes('I') && html.includes('J')) {
        html = html.replace('I', this.addValueBadge('(' + this.badgeCount + ')'))
      } else {
        html = html.replace('I', this.addValueBadge(boardAccess))
      }

      if (html.includes('J')) {
        html = html.replace('J', this.addValueBadge('(' + this.badgeCount + ')'))
      }

      if (html.includes('M')) {
        html = html.replace('M', this.addValueBadge('(' + this.badgeCount + ')'))
      }

      html = html.replaceAll('X', this.addValueBadge(boardAccess))
      html = html.replace('L', this.addValueBadge('input'))

      var button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.setAttribute('class', 'btn-close')
      button.setAttribute('id', 'close-btn-' + this.badgeCount)
      var id = 'close-btn-' + this.badgeCount
      button.style = 'margin-right: 2.5px;'

      var button2 = document.createElement('button')
      button2.setAttribute('type', 'button')
      button2.setAttribute('class', 'btn-swap')
      button2.setAttribute('id', 'swap-btn-' + this.badgeCount)
      var swapId = 'swap-btn-' + this.badgeCount
      button2.style = 'margin-right: 2.5px;'

      var icon = document.createElement('font-awesome-icon')
      icon.setAttribute('icon', 'fa-right-left')
      icon.setAttribute('style', 'color: rgb(169, 89, 255)!important')

      button2.innerHTML = "<font-awesome-icon icon='fa-right-left' style='color: rgb(169, 89, 255)!important;'></font-awesome-icon>"

      badge.innerHTML = button.outerHTML + button2.outerHTML + html
      row.appendChild(badge)

      var closeButton = document.getElementById('close-btn-' + this.badgeCount)
      closeButton.onclick = () => {
        var parentElement = document.getElementById(id).parentElement
        for (var c = 1; c < parentElement.children.length; c++) {
          var child = parentElement.children[c]
          if (!isNaN(child.innerHTML))
            document.getElementById('value-badge-row-' + child.getAttribute('value-input')).remove()
          if (this.selectedBadge == parentElement.getAttribute('id'))
            this.selectedBadge = ''
        }
        parentElement.remove()
        this.saveExpression()
      }

      var swapButton = document.getElementById('swap-btn-' + this.badgeCount)
      swapButton.onclick = () => {
        this.selectSwitchBadge(badge)
      }

      this.saveExpression()

      this.badgeCount += 1
    },

    selectSwitchBadge(badge) {
      if (badge.tagName == 'BUTTON') {
        badge = badge.parentElement
      }

      if (document.getElementById(badge.getAttribute('id')) == null || (document.getElementById(this.selectedBadge) == null && this.selectedBadge != '')) {
        this.selectedBadge = ''
        return
      }

      if (this.selectedBadge == '') {
        this.selectedBadge = badge.getAttribute('id')
      } else {
        var secondBadge = document.getElementById(badge.getAttribute('id')),
          firstBadge = document.getElementById(this.selectedBadge),
          parent = document.getElementById('validation-expression-row'),
          temp = document.createComment('')

        parent.insertBefore(temp, firstBadge)
        secondBadge.replaceWith(temp)
        firstBadge.replaceWith(secondBadge)
        temp.replaceWith(firstBadge)

        this.selectedBadge = ''

        this.saveExpression()
      }

    },

    changeCount(event) {
      var holder = document.getElementById('validation-expression-row'),
        newValue

      this.testCasesCount = event.target.value

      if (this.testCasesCount > 1) {
        newValue = 'case_num'
      } else if (this.testCasesCount == 1) {
        newValue = 'input.currentKey'
      }

      for (var badge of holder.children) {
        var children = badge.children
        for (var child of children) {
          if (child.classList.contains('text-bg-values') && (child.innerHTML == 'input.currentKey' || child.innerHTML == 'case_num')) {
            child.innerHTML = newValue
          }
        }
      }
    },

    makeExpression() {
      var expression = document.getElementById('validation-expression-row').textContent

      Array.from(document.getElementsByClassName('value-badge-input')).forEach((element) => {
        if (element.value == '') {
          alert('Please fill Value ' + element.getAttribute('id').split('-')[element.getAttribute('id').split('-').length - 1] + '.')
          return -1
        }

        expression = expression.replaceAll('(' + element.getAttribute('id').split('-')[element.getAttribute('id').split('-').length - 1] + ')', element.value)
      })

      return expression
    },

    changeTestCase(val) {
      this.saveExpression()

      this.selectedTestCase += val

      if (this.expressionBadges[this.selectedTestCase] != undefined) {
        document.getElementById('validation-expression-row').innerHTML = this.expressionBadges[this.selectedTestCase]
        document.getElementById('value-badges-inputs').innerHTML = this.inputs[this.selectedTestCase]
        this.inputsValues[this.selectedTestCase].forEach((val, index) => document.getElementById('value-badges-inputs').children[index].children[1].value = val)
      } else {
        document.getElementById('validation-expression-row').innerHTML = ''
        document.getElementById('value-badges-inputs').innerHTML = ''
        this.valid[this.selectedTestCase] = true
        this.expressionType[this.selectedTestCase] = 'test'
      }

      this.reinstateClickEvents()
    },

    saveExpression() {
      this.expressionBadges[this.selectedTestCase] = document.getElementById('validation-expression-row').innerHTML
      this.inputs[this.selectedTestCase] = document.getElementById('value-badges-inputs').innerHTML
      this.inputsValues[this.selectedTestCase] = []
      Array.from(document.getElementById('value-badges-inputs').children).forEach((element) => this.inputsValues[this.selectedTestCase].push(element.children[1].value))
    },

    reinstateClickEvents() {
      Array.from(document.getElementsByClassName('btn-swap')).forEach((badge) => badge.onclick = () => {
        this.selectSwitchBadge(badge)
      })

      Array.from(document.getElementsByClassName('btn-close')).forEach((element) => element.onclick = () => {
        var parentElement = document.getElementById(element.getAttribute('id')).parentElement
        for (var c = 1; c < parentElement.children.length; c++) {
          var child = parentElement.children[c]
          if (!isNaN(child.innerHTML))
            document.getElementById('value-badge-row-' + child.getAttribute('value-input')).remove()
          if (this.selectedBadge == parentElement.getAttribute('id'))
            this.selectedBadge = ''
        }
        parentElement.remove()
        this.saveExpression()
      });


    },

    checkExpression() {
      try {
        var expression = this.makeExpression()
        if (expression != -1) {
          eval(expression)
        }
      }
      catch (err) {
        if (err instanceof SyntaxError || err instanceof TypeError) {
          this.errors[this.selectedTestCase] = err + '.';
          this.valid[this.selectedTestCase] = false
          return
        }
      }
      this.valid[this.selectedTestCase] = true
    },

    setTestCase(testCase) {
      document.getElementById('validation-expression-row').innerHTML = this.expressionBadges[testCase]
      document.getElementById('value-badges-inputs').innerHTML = this.inputs[testCase]
      this.inputsValues[testCase].forEach((val, index) => document.getElementById('value-badges-inputs').children[index].children[1].value = val)
    },

    validateExpression() {
      this.saveExpression()

      var tests = [], preconditions = [];
      for (var i = 1; i <= this.testCasesCount; i++) {
        this.setTestCase(i)

        if (this.expressionType[i] == 'precondition') {
          preconditions.push(this.makeExpression())
        } else {
          tests.push(this.makeExpression())
        }
      }

      this.setTestCase(this.selectedTestCase);

      var challenge = {
        id: 0,
        name: this.challengeName,
        description: this.challengeDescription,
        difficulty: this.selectedDifficulty,
        hint: this.challengeHint,
        objective: this.challengeObjective,
        test_cases_count: tests.length,
        score: this.challengeScore,
        code_file: this.selectedCode,
        initial_board: this.selectedBoard,
        challenge_type: this.selectedCoverage,
        passing_criteria: {
          preconditions: preconditions,
          tests: tests,
          condition_count: this.conditionCount,
        },
        achievement_criteria: null,
        owner_id: 1
      };

      for (var key in challenge) {
        if (key == 'id') {
          continue
        }

        if (challenge[key] == '') {
          alert('Please fill out the ' + key + ' field.')
          return
        }
      }

      this.challenge = challenge;
      this.preconditions = preconditions;
      this.tests = tests;

      this.challengeValidation();
    },

    challengeValidation() {
      this.boardChecker.initialState = this.boardStates[this.challenge.initial_board - 1]
      this.boardChecker.setState()
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