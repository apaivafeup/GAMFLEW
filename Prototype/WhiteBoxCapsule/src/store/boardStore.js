import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

export const boardStore = defineStore('boardStore', {
  state: () => {
    return {
      timer: Number,
      log: {},
      state: {},
      outOfBoundsState: {},
      selectedPiece: null,
      selectedCoords: { x: -1, y: -1 },
      currentKey: 0,
      infoState: String
    }
  },
  actions: {
    selectPiece(x, y) {
      if (x == -1 && y == -1) {
        if (this.selectedPiece == null) {
          if (this.outOfBoundsState[this.currentKey].color == Color.EMPTY) return
          else {
            this.selectedPiece = this.outOfBoundsState[this.currentKey]
            this.selectedCoords = { x: -1, y: -1 }
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

    movePiece(x, y, undo = false) {
      var logicalSpot
      if (x == -1 && y == -1) {
        logicalSpot = this.outOfBoundsState[this.currentKey]
      } else {
        logicalSpot = this.state[this.currentKey][x][y]
      }

      logicalSpot.addStack(this.selectedPiece.stack, this.selectedColor)

      this.selectedPiece.select()
      this.selectedPiece.setEmpty()

      this.log[this.currentKey].push({
        from: { x: this.selectedPiece.position.x, y: this.selectedPiece.position.y },
        to: { x: parseInt(x), y: parseInt(y) }
      })
      this.updateInfoState()

      this.selectedPiece = null
      this.selectedCoords = { x: -1, y: -1 }
    },

    emptyState() {
      this.state[this.currentKey] = []
      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, Color.EMPTY)
      this.log[this.currentKey] = []
      this.infoState = ''
    },

    generateState() {
      console.log('generating state')

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

    previous() {
      this.currentKey--
      this.selectedPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    next() {
      this.currentKey++

      if (this.state[this.currentKey] == undefined) {
        this.generateState()
      }

      this.selectedPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    timeout() {
      if (confirm('Time is up! Try again?')) {
        window.location.reload()
      } else {
        window.location.href = '/'
      }
    },

    updateInfoState() {
      var lastLog = this.log[this.currentKey][this.log[this.currentKey].length - 1]
      this.infoState =
        '  Moved (' +
        lastLog.from.x +
        ', ' +
        lastLog.from.y +
        ') to (' +
        lastLog.to.x +
        ', ' +
        lastLog.to.y +
        ').'
    }
  }
})
