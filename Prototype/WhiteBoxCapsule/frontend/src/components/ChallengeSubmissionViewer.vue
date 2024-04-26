<template>
  <div style="display: flex; justify-content: right;" class="" v-if="challenge == {}">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out">
          <div class="box">
            <OutPieceStackSolutionViewer class="" :x="solution.outOfBoundsState.position.x" :y="solution.outOfBoundsState.position.y" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input id="piece-stack-out-x" class="col box "
              style="width: 30px; text-align: center; font-size: 12px" type="number" :value="solution.outOfBoundsState.position.x" />
            <input id="piece-stack-out-y" class="col box "
              style="width: 30px; text-align: center; font-size: 12px" type="number" :value="solution.outOfBoundsState.position.y"/>
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ solution.currentKey + 1 + '/' + challenge.test_cases_count }}
      </div>
      <div class="buttons-grid">
        <button id="previous-button" class="button is-primary is-fullwidth" v-if="solution.currentKey != 0"
          @click="solution.previous()">
          Previous
        </button>
        <button id="previous-button" class="button is-primary is-fullwidth disabled" v-else style="cursor: default">
          Previous
        </button>
        <button id="next-button" class="button is-primary is-fullwidth"
          v-if="solution.currentKey + 1 != challenge.test_cases_count" @click="solution.next()">
          Next
        </button>
        <button id="next-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Next
        </button>
      </div>
    </div>
    <div style="align-content: center" v-if="!solution.table">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels">
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          0
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          1
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          2
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          3
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          4
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          5
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          6
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          7
        </div>
      </div>
    </div>
    <div style="justify-self: right">
      <div class="game-board-col-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center">0</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">1</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">2</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">3</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">4</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">5</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">6</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">7</div>
      </div>
      <div class="game-board" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStackSolutionViewer :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: right" v-else>
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col">
        <div class="game-board-out-labels" v-if="!solution.table">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out">
          <div class="box">
            <OutPieceStackSolutionViewer :x="this.outX" :y="this.outY" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input id="piece-stack-out-x" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" :value="this.solution.outOfBoundsState[this.solution.currentKey].position.x" />
            <input id="piece-stack-out-y" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" :value="this.solution.outOfBoundsState[this.solution.currentKey].position.y" />
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ solution.currentKey + 1 + '/' + challenge.test_cases_count }}
      </div>

      <div class="buttons-grid">
        <button id="previous-button" class="button is-primary is-fullwidth" v-if="solution.currentKey != 0"
          @click="solution.previous()">
          Previous
        </button>
        <button id="previous-button" class="button is-primary is-fullwidth disabled" v-else style="cursor: default">
          Previous
        </button>
        <button id="next-button" class="button is-primary is-fullwidth"
          v-if="solution.currentKey + 1 != challenge.test_cases_count && solution.currentKey + 1 != Object.keys(solution.initialState).length " @click="solution.next()">
          Next
        </button>
        <button id="next-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Next
        </button>
      </div>
    </div>
    <div style="align-content: center" v-if="!solution.table">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels">
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          0
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          1
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          2
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          3
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          4
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          5
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          6
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          7
        </div>
      </div>
    </div>
    <div style="justify-self: right" v-if="!solution.table">
      <div class="game-board-col-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center">0</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">1</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">2</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">3</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">4</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">5</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">6</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">7</div>
      </div>
      <div class="game-board" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
            <PieceStackSolutionViewer class="" :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieceStackSolutionViewer from './PieceStackSolutionViewer.vue'

// JS
import { solutionViewer } from '../store/solutionViewer'
import OutPieceStackSolutionViewer from './OutPieceStackSolutionViewer.vue'
import 'vue3-easy-data-table'
import { authStore } from '../store/authStore'
import { Challenge } from '../store/models/challenge'

export default {
  components: { PieceStackSolutionViewer, OutPieceStackSolutionViewer },

  props: {
    challenge: Challenge,
    attempt: null
  },

  async beforeMount() {
    this.solution = solutionViewer()
    this.solution.defaultState()
    this.solution.generateState()
    this.auth = authStore()

    if (this.attempt != null) {
      this.solution.changeState(this.attempt.test_cases)
      this.$forceUpdate()
    }
  },

  methods: {
  },

  components: { PieceStackSolutionViewer, OutPieceStackSolutionViewer },
}
</script>
