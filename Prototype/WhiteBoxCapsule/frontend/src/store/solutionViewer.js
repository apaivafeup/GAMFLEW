import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'
import { Attempt } from './models/attempt.js'
import { combinations } from './utils.js'
import { useToast } from "vue-toastification";
import { BoardState } from './models/board_state.js';

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

export const solutionViewer = defineStore('solutionViewer', {
  state: () => {
    return {
      // Actual game state.
      log: {},
      state: {},
      outOfBoundsState: {},
      currentKey: 0,
      dataTable: {
        headers: [],
        rows: []
      },

      // Flags, for game mechanics / button panel.
      table: Boolean,
    }
  },
  actions: {
    emptyState() {
      this.currentKey = 0
      this.state[this.currentKey] = []
      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)
      this.log[this.currentKey] = []
      this.infoState = ''
      this.table = false
    },

    generateState(reset = false) {
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
        this.changeState(this.initialState)
      }
    },

    changeState(initialState) {
      this.initialState = initialState

      for (var currentKey = 0; currentKey < Object.keys(this.initialState).length; currentKey++) {
        for (var i = 0; i < this.initialState[currentKey].board.length; i++) {
          for (var j = 0; j < this.initialState[currentKey].board[i].length; j++) {
            this.state[this.currentKey][i][j] = new Piece({x: i, y: j}, this.initialState[currentKey].board[i][j].color, this.initialState[currentKey].board[i][j].content)
          }
        }
        this.outOfBoundsState[currentKey] = new Piece({x: -1, y: -1}, this.initialState[currentKey].outOfBounds.color, this.initialState[currentKey].outOfBounds.stack)
      
        this.log[currentKey] = this.initialState[currentKey].log
      }

      
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
        this.changeState(this.initialState)
      }
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
    }
  }
})
