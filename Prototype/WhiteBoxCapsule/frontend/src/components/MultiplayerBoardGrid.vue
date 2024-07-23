<template>
  <div style="display: flex; justify-content: right">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col" v-if="!board.table">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out">
          <div class="box" style="justify-self: center; width: 64px; height: 64px;">
            <OutPieceStack :x="board.outOfBoundsState[board.currentKey].position.x" :y="board.outOfBoundsState[board.currentKey].position.y" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center; margin-top: 7.5px;">
            <input id="piece-stack-out-x"
              @change="changeX()" class="col box" name="piece-stack-out-x"
              style="width: 50px; text-align: center; font-size: 12px; width: 32px;" type="number" placeholder="x" />
            <input @change="changeY()" 
              id="piece-stack-out-y" class="col box" name="piece-stack-out-y"
              style=" width: 32px; text-align: center; font-size: 12px" type="number" placeholder="y" />
          </div>
          <div class="row" style="display: flex; justify-content: center; text-align: center; font-size: 10px; margin-bottom: 10px; width: 120%; margin-top: 5px;">
            Move a piece here to get it out of bounds.
            You can change coordinates using the input boxes.
          </div>
        </div>
      </div>
      <div class="col" style="height: 315.5px;" v-else>

      </div>

      <div class="progress-bar">
        <span v-if="board.add" style="font-size: 10px; margin-bottom: 10px;">
          Click a spot to change it! <br />
          More clicks do different things!
        </span>
        <span v-if="playable && timer > 0">
          <strong>Time Left: </strong><em
            :style="timer >= 30 ? 'color: var(--text-color);' : 'color: red;'">{{ timer }}</em>
        </span>
        <span v-if="playable && timer > 0">
          You can play!
        </span>
        <span v-else-if="playable && timer <= 0">
          Loading...
        </span>
        <div class="row" v-if="round != undefined" style="justify-content: center;">
          {{ 'Challenge ' + round.round_number + ' of ' + round.max_rounds }}
        </div>
        <div class="row" style="text-align: center;" v-else-if="round == undefined">
          <p style="text-align: center;">
            Loading...
          </p>
        </div>
      </div>

      <button id="view-button" class="button is-primary is-fullwidth"
        v-if="!board.passed && !board.pause && !board.add && needsTable()" @click="board.tableMode(challenge)">
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
          @click="board.addMode()">
          {{ !board.add ? 'Add' : 'Move' }}
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default"
          v-else>
          {{ !board.add ? 'Add' : 'Move' }}
        </button>
        <button id="go-button" class="button is-primary is-fullwidth"
          v-if="board.currentKey + 1 == challenge.test_cases_count && !board.passed && !board.pause && playable"
          @click="go(board)">
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
        <button id="comment-button" class="button is-primary is-fullwidth disabled" v-if="!playable && !board.passed"
          data-bs-toggle="modal" data-bs-target="#submit-modal">
          Comment
        </button>
        <button id="comment-button" class="button is-primary is-fullwidth" v-else-if="board.passed && !board.submitted"
          data-bs-toggle="modal" data-bs-target="#submit-modal"
          style="border-color: rgb(169, 89, 255); background-color: rgb(169, 89, 255)">
          Comment
        </button>
        <button id="comment-button" class="button is-primary is-fullwidth" v-else data-bs-toggle="modal"
          data-bs-target="#fail-modal">
          Comment
        </button>
        <button id="pass-button" class="button is-primary is-fullwidth" v-if="playable && can_pass" @click="pass()">
          Pass
        </button>
        <button id="pass-button" class="button is-primary is-fullwidth disabled" v-else>
          Pass
        </button>
        <button id="exit-button" class="button is-primary is-fullwidth"
          @click="this.$router.push({ name: 'multiplayer-rooms' })">
          Exit
        </button>
      </div>



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
        <div class="box" v-if="(timer > 0 && timer_set) || (timer <= 0 && !timer_set)"
          v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStack :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
        <div class="box disabled" v-else v-for="index in 64"
          :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
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

// JS
import { Challenge } from '../store/models/challenge.js'
import { boardStore } from '../store/boardStore.js'

import * as utils from '../store/utils.js'
import { Color, Piece } from '../store/models/piece.js'
import OutPieceStack from './OutPieceStack.vue'
import 'vue3-easy-data-table'
import { authStore } from '../store/authStore.js'

export default {
  components: { PieceStack, OutPieceStack },
  props: {
    challenge: Object,
    playable: Boolean,
    round: Object,
    can_pass: Boolean,
    timer: Number,
    timer_set: Boolean
  },

  data() {
    return {
      headers: [],
      items: [],
      itemsSelected: [],
      outcomeInput: ''
    }
  },

  beforeMount() {
    this.board = boardStore()
    this.auth = authStore()
    this.auth.checkAuth()
  },

  mounted() {

  },

  methods: {
    is_triangle(a, b, c) {
      return a + b > c && a + c > b && b + c > a
    },

    is_prime(n) {
      for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if (n % i === 0) {
          return false;
        }
      }
      return n > 1;
    },

    distance(a, b) {
      if (!a || !b) {
        return 0
      }

      return Number.parseFloat(
        Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2))
      ).toFixed(2)
    },

    get_pieces(board, boardKey) {
      var pieces = []

      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY) {
            pieces.push(board.state[boardKey][i][j])
          }
        }
      }

      return pieces
    },

    get_top_pieces(board, boardKey) {
      var pieces = []

      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 8; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY) {
            pieces.push(board.state[boardKey][i][j])
          }
        }
      }

      return pieces
    },

    get_bottom_pieces(board, boardKey) {
      var pieces = []

      for (var i = 4; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY) {
            pieces.push(board.state[boardKey][i][j])
          }
        }
      }

      return pieces
    },

    get_left_pieces(board, boardKey) {
      var pieces = []

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 4; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY) {
            pieces.push(board.state[boardKey][i][j])
          }
        }
      }

      return pieces
    },

    get_right_pieces(board, boardKey) {
      var pieces = []

      for (var i = 0; i < 8; i++) {
        for (var j = 4; j < 8; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY) {
            pieces.push(board.state[boardKey][i][j])
          }
        }
      }

      return pieces
    },

    count_blue_pieces(board, boardKey) {
      var count = 0
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.BLUE) {
            count++
          }
        }
      }
      return count
    },

    count_red_pieces(board, boardKey) {
      var count = 0
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.RED) {
            count++
          }
        }
      }
      return count
    },

    count_empty_spaces(board, boardKey) {
      var count = 0
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.EMPTY) {
            count++
          }
        }
      }
      return count
    },

    find_first_red_piece(board, boardKey) {
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (
            board.state[boardKey][i][j].color == Color.RED ||
            (board.state[boardKey][i][j].color == Color.STACK &&
              board.state[boardKey][i][j].stack.red > 0)
          ) {
            return board.state[boardKey][i][j]
          }
        }
      }

      if (board.outOfBoundsState[boardKey].color == Color.RED || (board.outOfBoundsState[boardKey].color == Color.STACK &&
        board.outOfBoundsState[boardKey].stack.red > 0)) {
        return board.outOfBoundsState[boardKey]
      }

      return new Piece({ x: -2, y: -2 }, Color.EMPTY)
    },

    find_first_blue_piece(board, boardKey) {
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (
            board.state[boardKey][i][j].color == Color.BLUE ||
            (board.state[boardKey][i][j].color == Color.STACK &&
              board.state[boardKey][i][j].stack.blue > 0)
          ) {
            return board.state[boardKey][i][j]
          }
        }
      }

      if (board.outOfBoundsState[boardKey].color == Color.BLUE || (board.outOfBoundsState[boardKey].color == Color.STACK &&
        board.outOfBoundsState[boardKey].stack.blue > 0)) {
        return board.outOfBoundsState[boardKey]
      }

      return new Piece({ x: -2, y: -2 }, Color.EMPTY)
    },

    find_first_stack(board, boardKey) {
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.STACK) {
            return board.state[boardKey][i][j]
          }
        }
      }

      if (board.outOfBoundsState[boardKey].color == Color.STACK) {
        return board.outOfBoundsState[boardKey]
      }

      return new Piece({ x: -2, y: -2 }, Color.EMPTY)
    },

    find_blue_pieces(board, boardKey) {
      var vertices = []
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.BLUE) {
            vertices.push(board.state[boardKey][i][j])
          }
        }
      }

      vertices.sort((a, b) => {
        a.x - b.x == 0 ? a.y - b.y : a.x - b.x
      })
      return vertices
    },

    find_red_pieces(board, boardKey) {
      var vertices = []
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.RED) {
            vertices.push(board.state[boardKey][i][j])
          }
        }
      }
      vertices.sort((a, b) => {
        a.x - b.x == 0 ? a.y - b.y : a.x - b.x
      })
      return vertices
    },

    find_first_single_piece(board, boardKey) {
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color != Color.STACK && board.state[boardKey][i][j].color != Color.EMPTY) {
            return board.state[boardKey][i][j]
          }
        }
      }

      if (board.outOfBoundsState[boardKey].color == Color.STACK && board.state[boardKey][i][j].color != Color.EMPTY) {
        return board.outOfBoundsState[boardKey]
      }

      return new Piece({ x: -2, y: -2 }, Color.EMPTY)
    },

    find_stacks(board, boardKey) {
      var vertices = []
      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color == Color.STACK) {
            vertices.push(board.state[boardKey][i][j])
          }
        }
      }
      vertices.sort((a, b) => {
        a.x - b.x == 0 ? a.y - b.y : a.x - b.x
      })
      return vertices
    },

    moveOutOfBounds() {
      this.board.log[this.board.currentKey].push({
          type: 'move',
          start: { x: this.board.outOfBoundsState[this.board.currentKey].position.x, y: this.board.outOfBoundsState[this.board.currentKey].position.y },
          destination: {
            x: parseInt((document.getElementById('piece-stack-out-x').value == '' ? '-1' : document.getElementById('piece-stack-out-x').value)),
            y: parseInt((document.getElementById('piece-stack-out-y').value == '' ? '-1' : document.getElementById('piece-stack-out-y').value))
          }
        })

      this.board.updateInfoState()
    },

    changeX() {
      if (!isNaN(document.getElementById('piece-stack-out-x').value) && document.getElementById('piece-stack-out-x').value != '-') {
        this.moveOutOfBounds();
        this.board.outOfBoundsState[this.board.currentKey].position.x = document.getElementById('piece-stack-out-x').value
      }

    },

    changeY() {
      if (!isNaN(document.getElementById('piece-stack-out-y').value) && document.getElementById('piece-stack-out-y').value != '-') {
        this.moveOutOfBounds()
        this.board.outOfBoundsState[this.board.currentKey].position.y = document.getElementById('piece-stack-out-y').value
      }
    },

    needsTable() {
      return this.challenge.challenge_type == 'condition' || this.challenge.challenge_type == 'mcdc' || this.challenge.challenge_type == 'condition/decision'
    },

    // Submit functions
    go(input) {
      var type = this.challenge.challenge_type

      try {
        if (type == 'statement') {
          this.goUnique(input)
        } else if (type == 'decision') {
          this.goDecision(input)
        } else if (type == 'condition' || type == 'mcdc' || type == 'condition/decision') {
          this.goCondition(input)
        } else {
          console.error('Invalid submit type')
        }
      } catch (error) {
        console.log(error)
        this.board.fail()
        this.board.error = true;
        return
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
    },

    async pass() {
      await this.$axios.post(this.$api_link + '/game-room/' + this.round.game_room_id + '/game-round/' + this.round.id + '/pass/', {}, this.auth.config)
        .then(response => {
          if (response.data == null) {
            alert("You cannot choose to pass again in this round! Try to pass the challenge before the time runs out!")
          } else {
            this.$router.go()
          }
        })
        .catch((error) => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
          return
        })
    }
  },
  components: { PieceStack, OutPieceStack },

  watch: {}
}
</script>
