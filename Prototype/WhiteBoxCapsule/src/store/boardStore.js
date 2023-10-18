import { defineStore } from 'pinia'
import { Piece, Color } from 'models/piece.js'

export const boardStore = defineStore('counter', {
  state: () => {
    return { board: [] }
  },
  actions: {
    emptyBoard() {
      board = []
    },

    generateBoard() {
      for (let i = 1; i <= 8; i++) {
        this.board.push([])
        for (let j = 1; j <= 8; j++) {
          this.board[i - 1].push(new Piece(i * j, Color.STACK))
        }
      }
    }
  }
})
