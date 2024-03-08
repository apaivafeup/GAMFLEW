<template>
  <div style="display: flex; justify-content: right; padding: 0px;">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col" v-if="!board.table">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out" >
          <div class="box">
            <OutPieceStack :x="this.outX" :y="this.outY" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" :v-model="this.outX" id="piece-stack-out-x"
             @input="this.changeX()" class="col box" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="x"/>
             <input v-else id="piece-stack-out-x" :value="this.outX"
             class="col box disabled" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="x"/>
            <input @input="this.changeY()" v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" :v-model="this.outY" id="piece-stack-out-y"
              class="col box" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="y" />
              <input v-else id="piece-stack-out-y" :value="this.outY" class="col box disabled" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="y" />
          </div>
        </div>
      </div>
      <div class="col" style="height: 315.5px;" v-else>

      </div>

      <div class="progress-bar">
        {{ this.board.currentKey + 1 + '/' + challenge.test_cases_count }}
      </div>

      <button id="view-button" class="button is-primary is-fullwidth" v-if="!board.passed && !board.pause && !board.add && needsTable()"
        @click="board.tableMode(this.challenge)">
        {{ !board.table ? 'Condition Table' : 'Game Board' }}
      </button>
      <button id="view-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
        {{ !board.table ? 'Condition Table' : 'Game Board' }}
      </button>
      <div class="buttons-grid">
        <button id="previous-button" class="button is-primary is-fullwidth" v-if="board.currentKey != 0 && !board.add"
          @click="board.previous()">
          Previous
        </button>
        <button id="previous-button" class="button is-primary is-fullwidth disabled" v-else style="cursor: default">
          Previous
        </button>
        <button id="next-button" class="button is-primary is-fullwidth"
          v-if="board.currentKey + 1 != challenge.test_cases_count && !board.add && !board.table" @click="board.next()">
          Next
        </button>
        <button id="next-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Next
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button" v-if="!board.passed && !board.pause"
          @click="this.board.addMode()">
          {{ !board.add ? 'Add' : 'Move' }}
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default" v-else>
          {{ !board.add ? 'Add' : 'Move' }}
        </button>
        <button id="go-button" class="button is-primary is-fullwidth"
          v-if="board.currentKey + 1 == challenge.test_cases_count && !board.passed && !board.pause"
          @click="go(this.board)">
          Go!
        </button>
        <button id="go-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Go!
        </button>
        <button id="reset-button" class="button is-primary is-fullwidth"
          v-if="!board.passed && !board.pause && !board.add" @click="board.generateState(true)">
          Reset
        </button>
        <button id="reset-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Reset
        </button>
        <button id="comment-button" class="button is-primary is-fullwidth" v-if="board.passed && !board.submitted"
        data-bs-toggle="modal" data-bs-target="#submit-modal"
        style="border-color: rgb(169, 89, 255); background-color: rgb(169, 89, 255)">
        Comment
      </button>
      <button id="comment-button" class="button is-primary is-fullwidth" v-else data-bs-toggle="modal"
        data-bs-target="#fail-modal">
        Comment
      </button>
      </div>
      
      <button id="retry-button" class="button is-primary is-fullwidth" v-if="board.passed" @click="board.retry()">
        Retry
      </button>
      <button id="exit-button" class="button is-primary is-fullwidth" @click="board.exit()">
        Exit
      </button>
    </div>
    <div style="align-content: center;" v-if="!board.table">
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
    <div style="justify-self: right;" v-if="!board.table">
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
    <div style="justify-self: right; justify-content: end;" v-else>
      <EasyDataTable style="width: 525px; height: 537px; margin-left: 10px; margin-right: 2.5px; overflow: scroll;"
      :headers="board.dataTable.headers" :items="board.dataTable.rows" :rows-per-page="11" :fixed-checkbox="true"
      :checkbox-column-width="36" v-model:items-selected="itemsSelected" :maxPaginationNumber="10" v-if="board.table"
      :theme-color="'#A959FF'">
    </EasyDataTable>
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
import OutPieceStack from './OutPieceStack.vue'
import 'vue3-easy-data-table'

export default {
  components: { PieceStack, OutPieceStack, SubmitModal },
  props: {
    challenge: Challenge
  },

  data() {
    return {
      headers: [],
      items: [],
      itemsSelected: [],
      outcomeInput: '',
      outX: -1,
      outY: -1
    }
  },

  beforeMount() {
    this.board = boardStore()
  },

  mounted() {
    
  },

  methods: {
    changeX() {
      if (!isNaN(document.getElementById('piece-stack-out-x').value)) {
        this.outX = document.getElementById('piece-stack-out-x').value
      }
    },

    changeY() {
      if (!isNaN(document.getElementById('piece-stack-out-x').value)) {
        this.outY = document.getElementById('piece-stack-out-y').value
      }
    },

    needsTable() {
      return this.challenge.challenge_type == 'condition' || this.challenge.challenge_type == 'mcdc' || this.challenge.challenge_type == 'condition/decision'
    },

    // Submit functions
    go(input) {
      var type = this.challenge.challenge_type

      if (type == 'statement') {
        this.goUnique(input)
      } else if (type == 'decision') {
        this.goDecision(input)
      } else if (type == 'condition' || type == 'mcdc' || type == 'condition/decision') {
        this.goCondition(input)
      } else {
        console.error('Invalid submit type')
      }
    },

    goUnique(input) {
      var preconditions = this.challenge.passing_criteria.preconditions,
        tests = this.challenge.passing_criteria.tests

      for (var i = 0; i < preconditions.length; i++) {
        var precondition = preconditions[i]
        if (!eval(precondition)) {
          this.board.fail()
          return
        }
      }

      var count = 0
      for (var i = 0; i < tests.length; i++) {
        var test = tests[i]
        if (!eval(test)) {
          this.board.fail()
          return
        } else {
          count++
        }
      }

      if (count == tests.length) {
        this.board.addMode = false
        this.board.pass(this.challenge.score)
      }
    },

    goDecision(input) {
      var preconditions = this.challenge.passing_criteria.preconditions,
        tests = this.challenge.passing_criteria.tests

      var passed = Array(tests.length).fill(false)
      for (var case_num = 0; case_num <= this.board.currentKey; case_num++) {
        for (var i = 0; i < preconditions.length; i++) {
          var precondition = preconditions[i]
          if (!eval(precondition)) {
            this.board.fail()
            return
          }
        }

        for (var i = 0; i < tests.length; i++) {
          var test = tests[i]

          if (passed[i] == true) {
            continue
          }

          if (!eval(test)) {
            continue
          } else {
            passed[i] = true
            break
          }
        }
      }

      if (!passed.includes(false)) {
        this.board.addMode = false
        this.board.pass(this.challenge.score)
      } else {
        this.board.fail()
      }
    },

    goCondition(input) {
      var preconditions = this.challenge.passing_criteria.preconditions,
        tests = this.challenge.passing_criteria.tests

      var passed = Array(tests.length).fill(false)
      for (var case_num = 0; case_num <= this.board.currentKey; case_num++) {
        for (var i = 0; i < preconditions.length; i++) {
          var precondition = preconditions[i]
          if (!eval(precondition)) {
            this.board.fail()
            return
          }
        }

        for (var i = 0; i < tests.length; i++) {
          var test = tests[i]

          if (!eval(test)) {
            continue
          } else {
            passed[i] = true
          }
        }
      }

      if (!passed.includes(false)) {
        this.board.addMode = false
        this.board.pass(this.challenge.score)
      } else {
        this.board.fail()
      }
    }
  },
  components: { PieceStack, OutPieceStack },

  watch: {}
}
</script>
