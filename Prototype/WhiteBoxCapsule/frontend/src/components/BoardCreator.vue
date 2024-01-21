<template>
  <div style="display: flex; justify-content: right">
    <div style="flex-direction: column; display: flex; justify-content: space-between;">
      <div class="col" style="">
        <div class="game-board-out-labels" v-if="!board.table">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out</div>
        </div>
        <div class="game-board-out creator">
          <div class="box">
            <OutPieceStackCreator />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" id="piece-stack-out-x"
              class="col box" style="width: 30px; text-align: center; font-size: 12px" type="number" />
            <input v-else id="piece-stack-out-x" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" disabled />
            <input v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" id="piece-stack-out-y"
              class="col box" style="width: 30px; text-align: center; font-size: 12px" type="number" />
            <input v-else id="piece-stack-out-y" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" disabled />
          </div>
        </div>

        <div class="buttons-grid">
          <button id="add-button" class="button is-primary is-fullwidth add-button" v-if="!board.passed && !board.pause"
            @click="this.board.addMode()">
            {{ !board.add ? 'Add' : 'Move' }}
          </button>
          <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default" v-else>
            {{ !board.add ? 'Add' : 'Move' }}
          </button>
          <button id="reset-button" class="button is-primary is-fullwidth"
            v-if="!board.passed && !board.pause && !board.add" @click="board.generateState(true)">
            Reset
          </button>
          <button id="reset-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
            Reset
          </button>
        </div>
        <button id="exit-button" class="button is-primary is-fullwidth" @click="board.exit()">
          Exit
        </button>
      </div>
      </div>


      
    <div style="align-content: center" v-if="!board.table">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels-creator">
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
    <div style="justify-self: right" v-if="!board.table">
      <div class="game-board-col-labels-creator">
        <div class="game-board-label col" style="display: flex; justify-content: center">0</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">1</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">2</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">3</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">4</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">5</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">6</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">7</div>
      </div>
      <div class="creator game-board" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStackCreator :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieceStackCreator from './PieceStackCreator.vue'
import SubmitModal from './modals/SubmitModal.vue'

// JS
import { Challenge } from '../store/models/challenge'
import { boardCreatorStore } from '../store/boardCreator'

import * as utils from '../store/utils.js'
import OutPieceStackCreator from './OutPieceStackCreator.vue'
import 'vue3-easy-data-table'

export default {
  components: { PieceStackCreator, OutPieceStackCreator, SubmitModal },
  props: {
    challenge: Challenge
  },

  data() {
    return {
      headers: [],
      items: [],
      itemsSelected: [],
      outcomeInput: '',
      board: null
    }
  },

  beforeMount() {
    this.board = boardCreatorStore()
    this.board.generateState()

    console.log(this.board.state)
  },

  mounted() { },

  methods: {

  },

  watch: {}
}
</script>
