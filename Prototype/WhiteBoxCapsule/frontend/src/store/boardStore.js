import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'
import { Attempt } from './models/attempt.js'
import { combinations } from './utils.js'
import { useToast } from "vue-toastification";
import { BoardState } from './models/board_state.js';



export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

const toast = useToast()

export const boardStore = defineStore('boardStore', {
  state: () => {
    return {
      // Actual game state.
      log: {},
      state: {},
      outOfBoundsState: {},
      currentKey: 0,
      infoState: {
        0: []
      }, // Displayables for the user

      // Auxiliary state, for game mechanics (movement, selection, adding, etc).
      selectedPiece: null,
      selectedCoords: { x: -1, y: -1 },
      lastAdd: { x: -1, y: -1 },
      dataTable: {
        headers: [],
        rows: []
      },

      // Flags, for game mechanics / button panel.
      passed: Boolean,
      go: Boolean,
      failed: Boolean,
      hint: Boolean,
      add: Boolean,
      pause: Boolean,
      timeout: Boolean,
      submitted: Boolean,
      started: Boolean,
      table: Boolean,
      achievement: Boolean,
      error: false,

      // Attempt state, for future submission.
      attempt: Attempt,
      initialState: BoardState
    }
  },
  actions: {
    addPiece(x, y) {
      var piece
      if (this.isOutOfBounds(x, y)) {
        piece = this.outOfBoundsState[this.currentKey]
      } else {
        piece = this.state[this.currentKey][x][y]
      }

      if (piece.color == Color.EMPTY) {
        piece.setStack({ red: 1, blue: 0 })
      } else if (piece.color == Color.RED) {
        piece.setStack({ red: 0, blue: 1 })
      } else {
        piece.setEmpty()
        
        if (piece.king) {
          piece.king = false
        }
      }

      piece.updateColor()

      if (this.lastAdd.x != x && this.lastAdd.y != y) {
        this.log[this.currentKey].push({
          type: 'add',
          destination: { x: parseInt(x), y: parseInt(y) },
          color: piece.color
        })
      } else {
        this.log[this.currentKey].pop()

        this.log[this.currentKey].push({
          type: 'add',
          destination: { x: parseInt(x), y: parseInt(y) },
          color: piece.color
        })
      }

      this.updateInfoState()

      this.lastAdd = { x: parseInt(x), y: parseInt(y) }
    },

    selectPiece(x, y) {
      if (this.failed) {
        this.failed = false
      }

      if (this.add) {
        this.addPiece(x, y)
        return
      }

      if (this.pause) {
        return
      }

      if (this.isOutOfBounds(x, y)) {
        if (this.selectedPiece == null) {
          if (this.outOfBoundsState[this.currentKey].color == Color.EMPTY)
            return
          else {
            this.selectedPiece = this.outOfBoundsState[this.currentKey]
            this.selectedCoords = { x: -10, y: -10 }
            this.selectedPiece.select()
          }
        } else {
          this.movePiece(x, y)
        }
      } else if (
        this.selectedPiece == null &&
        this.state[this.currentKey][x][y].color != Color.EMPTY
      ) {
        this.selectedCoords.x = x
        this.selectedCoords.y = y
        this.selectedPiece = this.state[this.currentKey][x][y]
        this.selectedPiece.select()
      } else if (this.selectedPiece == this.state[this.currentKey][x][y]) {
        this.selectedPiece.select()
        this.selectedPiece = null
      } else if (this.selectedPiece != null) {
        this.movePiece(x, y)
      }
    },

    isOutOfBounds(x, y) {
      return x < 0 || x > 7 || y < 0 || y > 7
    },

    movePiece(x, y) {
      var logicalSpot

      if (this.isOutOfBounds(x, y)) {
        logicalSpot = this.outOfBoundsState[this.currentKey]
      } else {
        logicalSpot = this.state[this.currentKey][x][y]
      }

      if (!this.isOutOfBounds(this.selectedPiece.position.x, this.selectedPiece.position.y)) {
        logicalSpot.addStack(this.selectedPiece.stack, this.selectedColor)
        this.selectedPiece.select()
        this.selectedPiece.setEmpty()
      } else {
        if (this.isOutOfBounds(x, y)) {
          this.selectedPiece.select()
        } else {
          logicalSpot.addStack(this.selectedPiece.stack, this.selectedColor)
          this.selectedPiece.select()
          this.selectedPiece.setEmpty()
        }
      }

      this.log[this.currentKey].push({
        type: 'move',
        start: { x: this.selectedPiece.position.x, y: this.selectedPiece.position.y },
        destination: { x: parseInt(x), y: parseInt(y) }
      })

      logicalSpot.update(x, y, this.selectedPiece.king)

      this.updateInfoState()

      if (this.isOutOfBounds(this.selectedPiece.position.x, this.selectedPiece.position.y) && this.outOfBoundsState.color == 'empty') {
        this.outOfBoundsState[this.currentKey].position.x = -1
        this.outOfBoundsState[this.currentKey].position.y = -1
      }

      this.selectedPiece = null
      this.selectedCoords = { x: null, y: null }
    },

    emptyState(new_state = false) {
      if (new_state) {
        this.currentKey = 0
        this.state = {}
        this.outOfBoundsState = {}
        this.log = {}
        this.infoState = { 0: [] };
      }
      
      this.state[this.currentKey] = []
      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)
      this.log[this.currentKey] = []
      this.passed = false
      this.failed = false
      this.hint = false
      this.add = false
      this.pause = false
      this.timeout = false
      this.submitted = false
      this.started = false
      this.table = false
      this.go = false
    },

    generateState(reset = false) {
      if (!reset) {
        this.emptyState(false)
      } else {
        this.emptyState(true)
      }

      for (let i = 1; i <= 8; i++) {
        this.state[this.currentKey].push([])
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)

      if (reset) {
        this.setState()
      }
    },

    setState() {
      for (var i = 0; i < this.initialState.board_state.length; i++) {
        for (var j = 0; j < this.initialState.board_state[i].length; j++) {
          this.state[this.currentKey][i][j] = 
            new Piece({x: i, y: j}, this.initialState.board_state[i][j].color, this.initialState.board_state[i][j].content)
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({x: -1, y: -1}, this.initialState.out_of_bounds_state.color, this.initialState.out_of_bounds_state.stack)
    },

    previous() {
      this.currentKey--
      this.selectedPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    next() {
      this.currentKey = this.currentKey + 1

      if (this.state[this.currentKey] == undefined) {
        this.generateState(false)
        this.setState()
      }

      if (this.infoState[this.currentKey] == undefined) {
        this.infoState[this.currentKey] = []
      }
      
      this.selectedPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    gameOver() {
      this.pause = true
      document.getElementById('timeout-button').click()
    },

    updateInfoState() {
      this.failed = false

      var lastLog = this.log[this.currentKey][this.log[this.currentKey].length - 1]

      if (lastLog.type == 'move') {
        this.infoState[this.currentKey].push('Moved (' + lastLog.start.x + ', ' + lastLog.start.y + ') to (' + lastLog.destination.x + ', ' + lastLog.destination.y + ').')
      } else {
        if (lastLog.color != 'empty')
          this.infoState[this.currentKey].push('Added ' + lastLog.color + ' piece to (' + lastLog.destination.x + ', ' + lastLog.destination.y + ').')
        else
          this.infoState[this.currentKey].push('Removed piece from (' + lastLog.destination.x + ', ' + lastLog.destination.y + ').')
      }
    },

    addMode() {
      this.add = !this.add
      document.body.classList.toggle('add-mode')
    },

    tableMode(challenge) {
      this.table = !this.table

      if (this.table && challenge != undefined) {
        var headers = [],
          rows = []

        var charCode = 'A'.charCodeAt(0)
        for (var i = 0; i < challenge.passing_criteria.expression_count; i++) {
          headers.push({
            text: String.fromCharCode(charCode),
            value: String.fromCharCode(charCode++)
          })
        }

        headers.push({
          text: 'Outcome',
          value: 'outcome'
        })

        var possible_values = [true, false]

        var combs = combinations(possible_values, challenge.passing_criteria.expression_count)

        var row = {},
          rows = []
        for (var i = 0; i < combs.length; i++) {
          row = {}
          for (var j = 0; j < headers.length - 1; j++) {
            row[headers[j].value] = combs[i][j]
          }

          row['outcome'] = '?'

          rows.push(row)
        }

        this.dataTable.headers = headers
        this.dataTable.rows = rows
      }
    },

    pass(score) {
      this.passed = !this.passed
      this.failed = false
      this.paused = true
      this.hint = false

      this.attempt.score = score
    },

    fail() {
      this.failed = true
      this.hint = true
      this.attempt.score = 0
    },

    retry() {
      window.location.reload()
    },

    submit(score = null) {
      this.submitted = true


      if (this.passed && score != null) {
        toast.success("You just earned " + score + " points and unlocked this challenge's individual achievement hint!")
      } else if (!this.passed) {
        toast.success("Your attempt was submitted. Keep trying!")
      } else {
        this.failed = false;
        this.submitted = false;
      }

      //toast.warning("You just won an achievement!", onclick="this.achievements()")
    },

    achievements() {
      window.location.reload()
    },
  }
})
