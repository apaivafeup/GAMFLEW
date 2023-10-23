<script>
import BoardProgressBar from './BoardProgressBar.vue'
import { Challenge } from '../store/models/challenge'

// JS
import PieceStack from './pieces/PieceStack.vue'
import { bluePos, redPos, boardStore } from '../store/boardStore'

export default {
  props: {
    challenge: Challenge
  },

  beforeMount() {
    this.board = boardStore()
    this.board.generateState()
  },

  methods: {},
  components: { PieceStack }
}
</script>

<template>
  <div style="display: flex">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="game-board-out">
        <div class="box">
          <!-- <PieceStack :id="piece-stack-out" :coordinates="{x: 0, y: 0}" :stack="{red: 0, blue: 0}" /> -->
        </div>
      </div>

      <div class="buttons">
        <div style="display: flex; flex-direction: column">
          <button class="button is-primary is-fullwidth" @click="board.generateState()">
            Reset
          </button>
          <button class="button is-primary is-fullwidth" @click="board.undo()">Undo</button>
          <button class="button is-primary is-fullwidth" v-if="board.currentKey != 0" @click="board.previous()">
            Previous
          </button>
          <button class="button is-primary is-fullwidth" @click="board.next()">Next</button>
          <button class="button is-primary is-fullwidth" v-if="board.currentKey + 1 == challenge.count"
            @click="board.submit()">
            Submit
          </button>
        </div>
      </div>
    </div>
    <div style="justify-content: center">
      <div class="game-board" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStack :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
      <!-- <BoardProgressBar /> -->
    </div>
  </div>
</template>
