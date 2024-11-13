<template>
  <div style="display: flex; justify-content: right; padding: 0px;">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col" v-if="!board.table">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds Spot</div>
        </div>
        <div class="game-board-out">
          <div class="box" style="justify-self: center; width: 64px; height: 64px;">
            <OutPieceStack :x="board.outOfBoundsState[board.currentKey].position.x"
              :y="board.outOfBoundsState[board.currentKey].position.y" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center; margin-top: 7.5px;">
            <input id="piece-stack-out-x" @change="changeX()" class="col box" name="piece-stack-out-x"
              style="width: 50px; text-align: center; font-size: 12px; width: 32px;" type="number" placeholder="x" />
            <input @change="changeY()" id="piece-stack-out-y" class="col box" name="piece-stack-out-y"
              style=" width: 32px; text-align: center; font-size: 12px" type="number" placeholder="y" />
          </div>
          <div class="row"
            style="display: flex; justify-content: center; text-align: center; font-size: 10px; margin-bottom: 10px; width: 120%; margin-top: 5px;">
            Move a piece here to get it out of bounds.
            You can change coordinates using the input boxes.
          </div>
        </div>
      </div>
      <div class="col" style="height: 315.5px;" v-else>

      </div>

      <router-link id="next-challenge" :to="{ name: 'challenge', params: { id: challenge.id + 1 } }" v-if="board.passed"
        style="opacity: 0%; color: transparent; background-color: transparent;">
        <button id="next-challenge-button" class="button is-primary is-fullwidth">
          Next Challenge
        </button>
      </router-link>
      <div class="progress-bar">
        <div class="row" v-if="board.add"
          style="display: flex; justify-content: center; text-align: center; font-size: 10px; margin-bottom: 10px;">
          Click a spot to change it! <br />
          More clicks do different things!
        </div>
        <div class="row" style="display: flex; justify-content: center; text-align: center;">
          {{ board.currentKey + 1 + '/' + challenge.test_cases_count }}
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
        <button id="go-button" class="button is-primary is-fullwidth" data-bs-toggle="modal"
          data-bs-target="#comment-modal"
          v-if="board.currentKey == challenge.test_cases_count - 1 && !board.passed && !board.pause">
          Go!
        </button>
        <button id="go-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Go!
        </button>
        <button id="reset-button" class="button is-primary is-fullwidth"
          v-if="!board.passed && !board.pause && !board.add" @click="board.generateState(true, true)">
          Reset
        </button>
        <button id="reset-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Reset
        </button>
        <button id="retry-button" class="button is-primary is-fullwidth" v-if="board.passed" @click="board.retry()">
          Retry
        </button>
      </div>
      <div id="go-click-element" style="opacity: 0%" @click="go()">

      </div>

      <button id="exit-button" class="button is-primary is-fullwidth" @click="exit()">
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
      <div class="game-board" v-if="!board.passed" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStack :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
      <div class="game-board disabled" v-else id="challenge-board">
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
        :theme-color="'#A959FF'" @click-row="clickRow">
      </EasyDataTable>
    </div>

  </div>
</template>

<script>
import PieceStack from './PieceStack.vue'

// JS
import { Challenge } from '../store/models/challenge.js'
import { boardStore } from '../store/boardStore.js'
import { authStore } from '../store/authStore.js'
import { useToast } from 'vue-toastification'

import { Color, Piece } from '../store/models/piece.js'
import OutPieceStack from './OutPieceStack.vue'
import 'vue3-easy-data-table'

export default {
  components: { PieceStack, OutPieceStack },
  props: {
    challenge: Object
  },

  data() {
    return {
      goFlag: Boolean,
      headers: [],
      itemsSelected: [],
      outcomeInput: ''
    }
  },

  beforeMount() {
    this.board = boardStore()
    this.auth = authStore()
    this.auth.checkAuth()
    this.toast = useToast()
  },

  methods: {
    clickRow(item) {
    },

    is_triangle(a, b, c) {
      return a + b > c && a + c > b && b + c > a
    },

    is_prime(n) {
      for (let i = 2, s = Math.sqrt(n); i <= s; i++) {
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

    triangle_perimeter(board, boardKey) {
      var vertices = this.find_blue_pieces(board, boardKey)

      if (vertices.length != 3) {
        return 0
      }

      var a = parseFloat(this.distance(vertices[0], vertices[1]))
      var b = parseFloat(this.distance(vertices[1], vertices[2]))
      var c = parseFloat(this.distance(vertices[2], vertices[0]))

      if (!this.is_triangle(a, b, c)) {
        return 0
      }

      return Number.parseFloat(a + b + c).toFixed(2)
    },

    is_pythagorean_triple(board, boardKey) {
      var vertices = this.find_blue_pieces(board, boardKey)

      var a = parseFloat(this.distance(vertices[0], vertices[1]))
      var b = parseFloat(this.distance(vertices[1], vertices[2]))
      var c = parseFloat(this.distance(vertices[2], vertices[0]))

      return Math.pow(a, 2) + Math.pow(b, 2) == Math.pow(c, 2)
    },

    has_adjacent_piece(board, boardKey, color) {
      var vertices = this.find_blue_pieces(board, boardKey)

      var directions = [
        { x: 1, y: 1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ]

      for (var i = 0; i < vertices.length; i++) {
        for (var j = 0; j < directions.length; j++) {
          var x = parseFloat(vertices[i].position.x) + parseFloat(directions[j].x)
          var y = parseFloat(vertices[i].position.y) + parseFloat(directions[j].y)

          if (x < 0 || x > 7 || y < 0 || y > 7) {
            continue
          }

          if (board.state[boardKey][x][y].color == color) {
            return true
          }
        }
      }

      return false
    },

    get_pieces(board, boardKey) {
      var pieces = []

      for (var i = 0; i < board.state[boardKey].length; i++) {
        for (var j = 0; j < board.state[boardKey].length; j++) {
          if (board.state[boardKey][i][j].color != Color.EMPTY && board.state[boardKey][i][j].color != Color.STACK) {
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

    get_middle_piece(board, boardKey, a, b) {
      var a_x = a.x, a_y = a.y,
          b_x = b.x, b_y = b.y,
          m_x = Math.round((parseInt(a_x) + parseInt(b_x))/2),
          m_y = Math.round((parseInt(a_y) + parseInt(b_y))/2)

      return board.state[boardKey][m_x][m_y]
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
    go() {
      if (!this.board.go) {
        return
      }

      var type = this.challenge.challenge_type

      try {
        if (type == 'statement') {
          this.goUnique(this.board)
        } else if (type == 'decision') {
          this.goDecision(this.board)
        } else if (type == 'condition' || type == 'mcdc' || type == 'condition/decision') {
          this.goCondition(this.board)
        } else {
          console.error('Invalid submit type')
        }
      } catch (error) {
        this.board.fail()
        this.board.error = true;
        return
      }


      this.board.achievement = this.board.passed && this.checkAchievement(this.board)
      this.submitAttempt()
      if (this.board.achievement) {
        this.toast.warning("You just won " + this.challenge.name.split(':')[0] + "'s achievement!")
      }
      this.board.go = false

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
        this.board.add = false
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

      //console.log('passed', passed)

      if (!passed.includes(false)) {
        this.board.add = false
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
            //console.log(case_num, precondition)
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

      //console.log('passed', passed)

      if (!passed.includes(false)) {
        this.board.add = false
        this.board.pass(this.challenge.score)
      } else {
        this.board.fail()
      }
    },

    checkAchievement(input) {
      if (this.challenge.achievement == null) {
        return false
      }

      if (this.board.currentKey == 0) {
        try {
          if (eval(this.challenge.achievement)) {
            return true
          }
          return false
        } catch (error) {
          alert('An error occurred while checking the achievement. Please try again later.')
        }


      } else {
        try {
          for (var case_num = 0; case_num <= this.board.currentKey; case_num++) {
            if (eval(this.challenge.achievement)) {
              return true
            }
          }
        } catch (error) {
          alert('An error occurred while checking the achievement. Make sure you understood the hint.\nOtherwise, try again later or contact us.')
        }
        return false
      }
    },

    async submitAttempt() {
      var body = {
        id: 0,
        player_id: this.auth.user.id,
        challenge_id: this.board.attempt.challenge_id,
        attempt_type: this.board.passed ? 'pass' : 'fail',
        comment: this.board.attempt.comment,
        achievement: this.board.achievement,
        test_cases: this.saveTestCases(),
        score: this.board.passed ? this.challenge.score : 0,
        comment_score_count: this.board.passed ? 0 : null,
        comment_score: this.board.passed ? 0 : null
      }

      var flag = false, score = 0
      await this.$axios.post(this.$api_link + '/create/attempt/', body, this.auth.config).then((response) => {
        this.board.submit(response.data.score)
        this.auth.getUserData(this.auth.user.id) // update user data
      }).catch((error) => {
        this.toast.error('An error occurred while submitting your attempt. Please try again later.')
      })

    },

    saveTestCases() {
      var testCases = {}

      for (var i = 0; i < this.challenge.test_cases_count; i++) {
        var testCase = {
          board: this.board.state[i],
          outOfBounds: this.board.outOfBoundsState[i],
          log: this.board.log[i]
        }


        testCases[i] = testCase
      }

      return testCases
    },

    exit() {
      this.$router.push({ name: 'challenges' })
    },
  },

  components: { PieceStack, OutPieceStack },
}
</script>
