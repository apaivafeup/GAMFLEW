<script>
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
      <div class="col">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">(-1, -1)</div>
        </div>
        <div class="game-board-out">
          <div class="box">
            <PieceStack :id="'piece-stack-out'" :x="-1" :y="-1" />
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ (this.board.currentKey + 1) + '/' + challenge.count }}
      </div>

      <div class="buttons">
        <div style="display: flex; flex-direction: column">
          <button class="button is-primary is-fullwidth" @click="board.generateState()">
            Reset
          </button>
          <!-- <button class="button is-primary is-fullwidth" @click="board.undo()">Undo</button> -->
          <button class="button is-primary is-fullwidth" v-if="board.currentKey != 0" @click="board.previous()">
            Previous
          </button>
          <button class="button is-primary is-fullwidth" v-if="board.currentKey + 1 != challenge.count" @click="board.next()">Next</button>
          <button class="button is-primary is-fullwidth" v-if="board.currentKey + 1 == challenge.count"
            @click="board.submit()">
            Submit
          </button>
        </div>
      </div>
    </div>
    <div style="align-content: center">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels">
        <div class="game-board-label row" style="align-self: center; justify-content: center;">0</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">1</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">2</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">3</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">4</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">5</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">6</div>
        <div class="game-board-label row" style="align-self: center; justify-content: center;">7</div>
      </div>
    </div>
    <div style="justify-content: center">
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
          <PieceStack :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>
