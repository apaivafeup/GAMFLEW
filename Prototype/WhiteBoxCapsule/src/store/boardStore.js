import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64]

export const boardStore = defineStore('boardStore', {
  state: () => {
    return {
      timer: Number,
      log: [],
      state: [],
      selectedPiece: null,
      selectedCoords: { x: 0, y: 0 },
      currentKey: 0
    }
  },
  actions: {
    selectPiece(x, y) {
      if (this.selectedPiece == null && this.state[this.currentKey][x][y].color != Color.EMPTY) {
        this.selectedCoords.x = x
        this.selectedCoords.y = y
        this.selectedPiece = this.state[this.currentKey][x][y]
        this.selectedPiece.select()
      } else if (this.selectedPiece == this.state[this.currentKey][x][y]) {
        this.selectedPiece = null
      } else if (this.selectedPiece != null) {
        this.movePiece(x, y)
      }
    },

    movePiece(x, y, undo = false) {
      var logicalSpot = this.state[this.currentKey][x][y]

      logicalSpot.addStack(this.selectedPiece.stack, this.selectedColor)

      this.selectedPiece.select()
      this.selectedPiece.setEmpty()

      if (!undo) {
        this.log.push({
          from: { x: this.selectedPiece.position.x, y: this.selectedPiece.position.y },
          to: { x: parseInt(x), y: parseInt(y) }
        })
      }

      this.selectedPiece = null
      this.selectedColor = null
    },

    emptyState() {
      this.state[this.currentKey] = []
    },

    generateState() {
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
            if (j % 2 == 0) this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, Color.EMPTY))
            else this.state[this.currentKey][i].push(new Piece({ x: i, y: j }, color))
          }
        }
        edge = !edge
      }
    },

    previous() {
      this.currentKey--
      this.selectPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    next() {
      this.currentKey++

      if (this.state[this.currentKey] == undefined) {
        this.generateState()
      }

      this.selectPiece = null
      this.selectedCoords = { x: 0, y: 0 }
    },

    undo() {
      if (this.log.length <= 1) {
        this.log = []
        this.generateState()
        return
      }

      if (this.selectedPiece != null) {
        this.selectedPiece.select()
      }

      this.selectedPiece =
        this.state[this.currentKey][this.log[this.log.length - 1].to.x][this.log[this.log.length - 1].to.y]
      this.selectedPiece.select()
      this.movePiece(
        this.log[this.log.length - 1].from.x,
        this.log[this.log.length - 1].from.y,
        true
      )
      this.log.pop()
    }
  }
})
