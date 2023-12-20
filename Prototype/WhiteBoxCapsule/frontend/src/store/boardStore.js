import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'
import { Attempt } from './models/attempt.js'
import { combinations } from './utils.js'
import { useToast } from "vue-toastification";

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

const toast = useToast()

export const boardStore = defineStore('boardStore', {
  state: () => {
    return {
      // Actual game state.
      timer: Number,
      interval: null,
      log: {},
      state: {},
      outOfBoundsState: {},
      currentKey: 0,
      infoState: String, // Displayables for the user

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
      failed: Boolean,
      add: Boolean,
      pause: Boolean,
      timeout: Boolean,
      submitted: Boolean,
      started: Boolean,
      table: Boolean,

      // Attempt state, for future submission.
      attempt: Attempt,
      boardState: String
    }
  },
  actions: {
    addPiece(x, y) {
      var piece = this.state[this.currentKey][x][y]

      if (piece.color == Color.EMPTY) {
        piece.setStack({ red: 1, blue: 0 })
      } else if (piece.color == Color.RED) {
        piece.setStack({ red: 0, blue: 1 })
      } else {
        piece.setEmpty()
      }

      piece.updateColor()

      if (this.lastAdd.x != x && this.lastAdd.y != y) {
        this.log[this.currentKey].push({
          type: 'add',
          to: { x: parseInt(x), y: parseInt(y) },
          color: piece.color
        })
      } else {
        this.log[this.currentKey].pop()

        this.log[this.currentKey].push({
          type: 'add',
          to: { x: parseInt(x), y: parseInt(y) },
          color: piece.color
        })
      }

      this.updateInfoState()

      this.lastAdd = { x: parseInt(x), y: parseInt(y) }
    },

    selectPiece(x, y) {
      if (this.add) {
        this.addPiece(x, y)
        return
      }

      if (this.pause) {
        return
      }

      if (this.isOutOfBounds(x, y)) {
        if (this.selectedPiece == null) {
          if (this.outOfBoundsState[this.currentKey].color == Color.EMPTY) return
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
        from: { x: this.selectedPiece.position.x, y: this.selectedPiece.position.y },
        to: { x: parseInt(x), y: parseInt(y) }
      })

      logicalSpot.update(x, y)

      this.updateInfoState()

      this.selectedPiece = null
      this.selectedCoords = { x: null, y: null }
    },

    emptyState() {
      this.state[this.currentKey] = []
      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)
      this.log[this.currentKey] = []
      this.infoState = ''
      this.passed = false
      this.failed = false
      this.add = false
      this.pause = false
      this.timeout = false
      this.submitted = false
      this.started = false
      this.table = false
    },

    generateState(reset = false) {
      console.log('generating state')

      this.emptyState()

      for (let i = 1; i <= 8; i++) {
        this.state[this.currentKey].push([])
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)

      this.log[this.currentKey] = []

      if (reset) {
        this.setState()
      }
    },

    setState() {
      switch (this.boardState) {
        case 'default':
          this.defaultState()
          break
        case 'full':
          this.fullState()
          break
        case 'thirds':
          this.thirdsState()
          break
        default:
          break
      }
    },

    defaultState() {
      this.emptyState()

      for (let i = 1; i <= 8; i++) {
        this.state[this.currentKey].push([])
      }

      var edge = true
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (i == 3 || i == 4) {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
            continue
          }

          var color
          if (i < 3) {
            color = Color.RED
          } else {
            color = Color.BLUE
          }

          if (edge) {
            if (j % 2 == 0) this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, color))
            else this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
          } else {
            if (j % 2 == 0)
              this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
            else this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, color))
          }
        }
        edge = !edge
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)

      this.log[this.currentKey] = []
    },

    thirdsState() {
      this.emptyState()

      for (let i = 1; i <= 8; i++) {
        this.state[this.currentKey].push([])
      }

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (i < 3) {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.RED))
          } else if (i < 5) {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
          } else {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.BLUE))
          }
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)

      this.log[this.currentKey] = []
    },

    fullState() {
      this.emptyState()

      for (let i = 1; i <= 8; i++) {
        this.state[this.currentKey].push([])
      }

      var count = 0
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (count < 32) {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.RED))
          } else {
            this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.BLUE))
          }

          count++
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)

      this.log[this.currentKey] = []
    },

    previous() {
      this.currentKey--
      this.selectedPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    next() {
      this.currentKey++

      if (this.state[this.currentKey] == undefined) {
        this.generateState()
        this.setState()
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
      //console.log(lastLog)

      if (lastLog.type == 'move') {
        this.infoState =
          'Moved (' +
          lastLog.from.x +
          ', ' +
          lastLog.from.y +
          ') to (' +
          lastLog.to.x +
          ', ' +
          lastLog.to.y +
          ').'
      } else {
        if (lastLog.color != 'empty')
          this.infoState =
            'Added ' + lastLog.color + ' piece to (' + lastLog.to.x + ', ' + lastLog.to.y + ').'
        else this.infoState = 'Removed piece from (' + lastLog.to.x + ', ' + lastLog.to.y + ').'
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
        for (var i = 0; i < challenge.passing_criteria.condition_count; i++) {
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

        var combs = combinations(possible_values, challenge.passing_criteria.condition_count)

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

    pass() {
      this.passed = !this.passed
      this.attempt.setTimeElapsed(this.timer)
      this.failed = false
      this.paused = true
    },

    fail() {
      this.failed = true
    },

    retry() {
      window.location.reload()
    },

    exit() {
      window.location.href = '/'
    },

    submit(score = null) {
      this.submitted = true

      if (score != null) {
        toast.success("You just earned " + score + " points!")
      }
    },

    achievements() {
      toast.warning("You just won an achievement!", onclick="this.achievements()")
      window.location.href = '/'
      window.location.href = "/challenge/1"
      window.location.reload()
    },

    startTimer(pause = false) {
      if (!this.started || pause) {
        this.interval = setInterval(() => {
          this.timer--

          if (this.timer == 0) {
            clearInterval(this.interval)
            this.gameOver()
          }

          if (this.passed) {
            clearInterval(this.interval)
          }
        }, 1000)

        this.started = true
      }
    },

    pauseMode() {
      this.pause = !this.pause

      if (!this.pause) {
        this.startTimer(true)
      } else {
        clearInterval(this.interval)
      }
    }
  }
})
