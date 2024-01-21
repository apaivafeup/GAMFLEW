import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'
import { Attempt } from './models/attempt.js'
import { combinations } from './utils.js'
import { useToast } from "vue-toastification";
import { BoardState } from './models/board_state.js';

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

const toast = useToast()

export const boardCreatorStore = defineStore('boardCreatorStore', {
  state: () => {
    return {
      // Actual game state.
      timer: Number,
      state: {},
      outOfBoundsState: {},
      currentKey: 0,

      selectedPiece: null,
      selectedCoords: { x: -1, y: -1 },

      // Flags, for game mechanics / button panel.
      add: Boolean
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
          this.outCoords = { x: x, y: y }
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

        if (this.outCoords != {}) {
          x = this.outCoords.x
          y = this.outCoords.y
        }
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

      logicalSpot.update(x, y)

      this.selectedPiece = null
      this.selectedCoords = { x: null, y: null }
    },

    emptyState() {
      this.state[this.currentKey] = []
      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)
      this.add = false
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

    addMode() {
      this.add = !this.add
      document.body.classList.toggle('add-mode')
    },

    exit() {
      this.$router.push({ name: 'home' })
    },
  }
})
