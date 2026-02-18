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
      state: {},
      outOfBoundsState: {},
      currentKey: 0,

      selectedPiece: null,
      selectedCoords: { x: -1, y: -1 },
      initialState: {},

      // Flags, for game mechanics / button panel.
      add: Boolean
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


      piece.setStack({ red: 1, blue: 0 })
      piece.king = false

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
        const outOfBoundsPiece = this.outOfBoundsState[this.currentKey]

        if (this.selectedPiece == null) {
          if (outOfBoundsPiece.color == Color.EMPTY)
            // EMPTY -> RED (added red piece) 
            this.addPiece(x, y)
          else {
            // RED/BLUE -> SELECTED (selected piece)
            this.selectedPiece = outOfBoundsPiece
            this.selectedCoords = { x: -10, y: -10 }
            this.selectedPiece.select()
          }
        } else if (this.selectedPiece == outOfBoundsPiece) { // If the same piece is selected, cycle through states.
          if (outOfBoundsPiece.color === Color.RED && outOfBoundsPiece.selected) {
            // SELECTED (RED) -> BLUE 
            outOfBoundsPiece.stack = { red: 0, blue: 1 }
            outOfBoundsPiece.updateColor()
            outOfBoundsPiece.selected = false
            this.selectedPiece = null
          } else if (outOfBoundsPiece.color === Color.BLUE && outOfBoundsPiece.selected) {
            // SELECTED (BLUE) -> EMPTY
            outOfBoundsPiece.stack = { red: 0, blue: 0 }
            outOfBoundsPiece.updateColor()
            outOfBoundsPiece.selected = false
            this.selectedPiece = null
            this.infoState[this.currentKey].push('Removed piece from (' + x + ', ' + y + ').')
          }
        } else {
          // Move selected piece to out of bounds location
          this.movePiece(x, y)
        }
      } else {
        // Cycle through states:  EMPTY -> RED -> SELECTED -> BLUE -> SELECTED -> EMPTY
        const piece = this.state[this.currentKey][x][y]
        
        if (this.selectedPiece !== piece) { 
          if (this.selectedPiece === null && piece.color === Color.EMPTY) {
            // EMPTY -> RED (added red piece)
            this.addPiece(x, y)
          } else if (this.selectedPiece === null && piece.color !== Color.EMPTY) {
            // RED/BLUE -> SELECTED (selected piece)
            this.selectedPiece = piece
            this.selectedCoords.x = x
            this.selectedCoords.y = y
            piece.selected = true
          } else if (this.selectedPiece !== null) {
            // Move selected piece to new location
            this.movePiece(x, y)
          }
        } else { // If the same piece is selected, cycle through states.
          if (piece.color === Color.RED && piece.selected) {
            // SELECTED (RED) -> BLUE 
            piece.stack = { red: 0, blue: 1 }
            piece.updateColor()
            piece.selected = false
            this.selectedPiece = null
          } else if (piece.color === Color.BLUE && piece.selected) {
            // SELECTED (BLUE) -> EMPTY
            piece.stack = { red: 0, blue: 0 }
            piece.updateColor()
            piece.selected = false
            this.selectedPiece = null
            this.infoState[this.currentKey].push('Removed piece from (' + x + ', ' + y + ').')
          }
        }
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

      logicalSpot.update(x, y, this.selectedPiece.king)

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
    
    changeState(board) {
      this.emptyState()
      this.generateState()

      this.initialState.board_state = board.board_state
      this.initialState.out_of_bounds_state = new Piece({ x: -1, y: -1 }, board.out_of_bounds_state.color, board.out_of_bounds_state.stack)

      this.setState()
    },

    setState() {
      for (var i = 0; i < this.initialState.board_state.length; i++) {
        for (var j = 0; j < this.initialState.board_state[i].length; j++) {
          this.state[this.currentKey][i][j] =
            new Piece({ x: i, y: j }, this.initialState.board_state[i][j].color, this.initialState.board_state[i][j].content)
        }
      }

      this.outOfBoundsState[this.currentKey] = new Piece({ x: -1, y: -1 }, this.initialState.out_of_bounds_state.color, this.initialState.out_of_bounds_state.stack)
    },

    serializeState() {
      var body = [[], [], [], [], [], [], [], []];

      for (var i = 0; i < this.state[this.currentKey].length; i++) {
        for (var j = 0; j < this.state[this.currentKey][i].length; j++) {
          body[i].push({ 
            color: this.state[this.currentKey][i][j].color,
            content: (this.state[this.currentKey][i][j].color == "stack" ? this.state[this.currentKey][i][j].stack : null),
            king: this.state[this.currentKey][i][j].king
          })
        }
      }

      return body
    },

    addMode() {
      if (this.selectedPiece != null) {
        this.selectedPiece.select()
        this.selectedPiece = null
      }
      this.add = !this.add
      document.body.classList.toggle('add-mode')
    },

    exit() {
      this.$router.back()
    },
  }
})
