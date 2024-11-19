<template>
  <div style="display: flex; justify-content: right;" class="disabled" v-if="challenge == null">
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col">
        <div class="game-board-out-labels">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out">
          <div class="box">
            <OutPieceStack class="disabled" :x="outX" :y="outY" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input id="piece-stack-out-x" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" />
            <input id="piece-stack-out-y" class="col box disabled"
              style="width: 30px; text-align: center; font-size: 12px" type="number" />
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ 'N/A' }}
      </div>
      <button id="view-button" class="button is-primary is-fullwidth disabled" style="cursor: default">
        {{ 'Condition Table' }}
      </button>
      <div class="buttons-grid">
        <button id="previous-button" class="button is-primary is-fullwidth disabled" style="cursor: default">
          Previous
        </button>
        <button id="next-button" class="button is-primary is-fullwidth disabled" style="cursor: default">
          Next
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default">
          {{ 'Add' }}
        </button>
        <button id="go-button" class="button is-primary is-fullwidth disabled" style="cursor: default">
          Go!
        </button>
        <button id="reset-button" class="button is-primary is-fullwidth disabled" style="cursor: default">
          Reset
        </button>
      </div>
    </div>
    <div style="align-content: center" v-if="!board.table">
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
    <div style="justify-self: right" v-if="!board.table">
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
      <EasyDataTable style="width: 525px; height: 465px; margin-left: 10px; margin-right: 2.5px; overflow: scroll;"
        :headers="board.dataTable.headers" :items="board.dataTable.rows" :rows-per-page="10" :fixed-checkbox="true"
        :checkbox-column-width="36" v-model:items-selected="itemsSelected" :maxPaginationNumber="10" v-if="board.table"
        :theme-color="'#A959FF'">
      </EasyDataTable>
    </div>

  </div>
  <div style="display: flex; justify-content: right" v-else>
    <div style="flex-direction: column; justify-content: space-between; display: flex">
      <div class="col">
        <div class="game-board-out-labels" v-if="!board.table">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out">
          <div class="box" style="justify-self: center; width: 64px; height: 64px;">
            <OutPieceStack :x="board.outOfBoundsState[board.currentKey].position.x" :y="board.outOfBoundsState[board.currentKey].position.y" />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center; margin-top: 7.5px;">
            <input id="piece-stack-out-x"
              @change="changeX()" class="col box" name="piece-stack-out-x"
              style="width: 50px; text-align: center; font-size: 12px; width: 32px;" type="number" placeholder="row" />
            <input @change="changeY()"
              id="piece-stack-out-y" class="col box" name="piece-stack-out-y"
              style=" width: 32px; text-align: center; font-size: 12px" type="number" placeholder="column" />
          </div>
          <div class="row" style="display: flex; justify-content: center; text-align: center; font-size: 10px; margin-bottom: 10px; width: 120%; margin-top: 5px;">
            Move a piece here to get it out of bounds.
            You can change coordinates using the input boxes.
          </div>
        </div>
      </div>

      <div class="progress-bar">
        {{ board.currentKey + 1 + '/' + challenge.test_cases_count }}
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
          v-if="board.currentKey + 1 != challenge.test_cases_count && !board.add" @click="board.next()">
          Next
        </button>
        <button id="next-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
          Next
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button" v-if="!board.passed && !board.pause"
          @click="board.addMode()">
          {{ board.add ? 'Add' : 'Move' }}
        </button>
        <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default" v-else>
          {{ board.add ? 'Add' : 'Move' }}
        </button>
        <button id="go-button" class="button is-primary is-fullwidth"
          v-if="board.currentKey + 1 == challenge.test_cases_count && !board.passed && !board.pause"
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
        <button id="retry-button" class="button is-primary is-fullwidth disabled" v-if="!board.passed">
          Retry
        </button>
        <button id="retry-button" class="button is-primary is-fullwidth" v-else @click="retry()">
          Retry
        </button>
      </div>
    </div>
    <div style="align-content: center" v-if="!board.table">
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
    <div style="justify-self: right" v-if="!board.table">
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
          <PieceStack v-if="!board.passed" :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
            <PieceStack v-else class="disabled" :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
    <div style="justify-self: right; justify-content: end;" v-else>
      <EasyDataTable style="width: 525px; height: 465px; margin-left: 10px; margin-right: 2.5px; overflow: scroll;"
        :headers="board.dataTable.headers" :items="board.dataTable.rows" :rows-per-page="10" :fixed-checkbox="true"
        :checkbox-column-width="36" v-model:items-selected="itemsSelected" :maxPaginationNumber="10" v-if="board.table"
        :theme-color="'#A959FF'">
      </EasyDataTable>
    </div>

  </div>
</template>

<script>
import PieceStack from './PieceStack.vue'

// JS
import { Challenge } from '../store/models/challenge'
import { boardCheckerStore } from '../store/boardChecker'

import * as utils from '../store/utils.js'
import OutPieceStack from './OutPieceStack.vue'
import 'vue3-easy-data-table'


export default {
  components: { PieceStack, OutPieceStack },
  props: {
    challenge: Object
  },

  data() {
    return {
      headers: [],
      items: [],
      itemsSelected: [],
      outcomeInput: ''
    }
  },

  async beforeMount() {
    this.board = boardCheckerStore()
    this.board.generateState()
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

    get_middle_piece(board, boardKey, a, b) {
      var a_x = a.x, a_y = a.y,
          b_x = b.x, b_y = b.y,
          m_x = Math.round((parseInt(a_x) + parseInt(b_x))/2),
          m_y = Math.round((parseInt(a_y) + parseInt(b_y))/2)

      return board.state[boardKey][m_x][m_y]
    },

    distance(a, b) {
      if (!a || !b) {
        return 0
      }

      return Math.round(
        Math.sqrt(Math.pow(a.position.x - b.position.x, 2) + Math.pow(a.position.y - b.position.y, 2))
      )
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
      if (!isNaN(document.getElementById('piece-stack-out-x').value)) {
        this.moveOutOfBounds()
        this.outX = document.getElementById('piece-stack-out-x').value
      }
    },

    changeY() {
      if (!isNaN(document.getElementById('piece-stack-out-x').value)) {
        this.moveOutOfBounds()
        this.outY = document.getElementById('piece-stack-out-y').value
      }
    },

    needsTable() {
      return this.challenge.challenge_type == 'condition' || this.challenge.challenge_type == 'mcdc' || this.challenge.challenge_type == 'condition/decision'
    },

    // Submit functions
    go(input) {
      try {
        var type = this.challenge.challenge_type

        if (this.challenge.passing_criteria.tests.length == 0) {
          console.error('No tests found! You need more than preconditions.')
          return
        }

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
        console.error(error)
        Array.from(document.getElementsByClassName('alert player-info')).forEach((element) => {
          element.classList = ['alert alert-info player-info']
        })
        alert("An invalid expression caused an error. Try again.")
      }
    },

    preconditionAlerts(i, precondition, input) {
      document.getElementById('precondition-info-alert-' + i).classList = ['alert alert-info player-info']
      document.getElementById('precondition-info-alert-' + i).classList.remove('alert-info')
      document.getElementById('precondition-info-alert-' + i).classList.add(eval(precondition) ? 'alert-success' : 'alert-danger')
    },

    testAlerts(i, test, input) {
      document.getElementById('test-info-alert-' + i).classList = ['alert alert-info player-info']
      document.getElementById('test-info-alert-' + i).classList.remove('alert-info')
      document.getElementById('test-info-alert-' + i).classList.add(eval(test) ? 'alert-success' : 'alert-danger')
    },

    retry() {
      this.board.generateState(true)
      document.querySelectorAll('.alert-success').forEach((element) => {
        element.classList = ['alert alert-info player-info']
      })
    },

    goUnique(input) {
      var preconditions = this.challenge.passing_criteria.preconditions,
        tests = this.challenge.passing_criteria.tests

      for (var i = 0; i < preconditions.length; i++) {
        var precondition = preconditions[i]
        this.preconditionAlerts(i, precondition, input)
        if (!eval(precondition)) {
          this.board.fail()
          return
        }
      }

      var count = 0
      for (var i = 0; i < tests.length; i++) {
        var test = tests[i]

        this.testAlerts(i, test, input)

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
          this.preconditionAlerts(i, precondition, input)

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

          this.testAlerts(i, test, input)

          if (!eval(test)) {
            continue
          } else {
            passed[i] = true
            break
          }
        }
      }

      if (!passed.includes(false)) {
        this.board.add = false
        this.board.pass(null)
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
          this.preconditionAlerts(i, precondition, input)

          if (!eval(precondition)) {
            this.board.fail()
            return
          }
        }

        for (var i = 0; i < tests.length; i++) {
          var test = tests[i]
          this.testAlerts(i, test, input)

          if (!eval(test)) {
            continue
          } else {
            passed[i] = true
          }
        }
      }

      if (!passed.includes(false)) {
        this.board.add = false
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
