<template>
  <div style="display: flex; justify-content: right">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out</div>
        </div>
        <div class="game-board-out">
          <div class="box">
            <PieceStack :id="'piece-stack-out'" :x="-1" :y="-1" />
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ this.board.currentKey + 1 + '/' + challenge.count }}
      </div>

      <div class="buttons-grid">
        <button class="button is-primary is-fullwidth" v-if="board.passed" @click="board.retry()">
          Retry
        </button>
        <button class="button is-primary is-fullwidth" v-if="!board.passed" @click="board.generateState()">
          Reset
        </button>
        <button class="button is-primary is-fullwidth" v-if="board.currentKey != 0 && !board.passed"
          @click="board.previous()">
          Previous
        </button>
        <button class="button is-primary is-fullwidth" v-if="board.currentKey + 1 != challenge.count && !board.passed"
          @click="board.next()">
          Next
        </button>
        <button class="button is-primary is-fullwidth" v-if="board.currentKey + 1 == challenge.count && !board.passed"
          @click="go(this.board)">
          Go!
        </button>
        <button class="button is-primary is-fullwidth" v-if="board.passed" data-bs-toggle="modal"
          data-bs-target="#submit-modal">
          Comment
        </button>
        <button class="button is-primary is-fullwidth add-button" v-if="!board.passed" @click="board.addMode()">
          Add
        </button>
        <button class="button is-primary is-fullwidth" @click="board.exit()">Exit</button>
        <button class="button is-primary is-fullwidth" v-if="!board.passed" @click="board.pauseMode()">
          {{ !this.board.pause ? 'Pause' : 'Resume' }}
        </button>
      </div>
    </div>
    <div style="align-content: center">
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
          <PieceStack :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieceStack from './PieceStack.vue'
import SubmitModal from './modals/SubmitModal.vue'

// JS
import { Challenge } from '../store/models/challenge'
import { boardStore } from '../store/boardStore'

import * as utils from '../store/utils.js'

export default {
  components: { PieceStack, SubmitModal },
  props: {
    challenge: Challenge
  },

  beforeMount() {
    this.board = boardStore()
  },

  mounted() {
    console.log('Challenge', this.challenge)
  },

  methods: {
    go(input) {
      var type = this.challenge.submit.type;

      switch (type) {
        case "statement":
          this.goStatement(input);
          break;
        case "decision":
          this.goDecision(input);
          break;
        default:
          console.error("Invalid submit type");
      }
    },

    goStatement(input) {
      var preconditions = this.challenge.submit.preconditions,
        tests = this.challenge.submit.tests;

      for (var i = 0; i < preconditions.length; i++) {
        var precondition = preconditions[i]
        if (!eval(precondition)) {
          this.board.fail()
          return;
        }
      }

      var count = 0
      for (var i = 0; i < tests.length; i++) {
        var test = tests[i]
        if (!eval(test)) {
          this.board.fail()
          return;
        } else {
          count++
        }
      }

      if (count == tests.length) {
        this.board.pass()
      }
    },

    goDecision(input) {
      var preconditions = this.challenge.submit.preconditions,
        tests = this.challenge.submit.tests;

      var count = 0;
      for (var case_num = 0; case_num <= this.board.currentKey; case_num++) {
        for (var i = 0; i < preconditions.length; i++) {
          var precondition = preconditions[i]
          if (!eval(precondition)) {
            this.board.fail()
            return;
          }
        }

        for (var i = 0; i < tests.length; i++) {
          var test = tests[i]
          if (!eval(test)) {
            continue;
          } else {
            count++
          }
        }
      }

      if (count == tests.length) {
        this.board.pass()
      } else {
        this.board.fail()
      }

    }
  },
  components: { PieceStack }
}
</script>
