import { Piece, Color } from "./piece.js"

export class Board {
  constructor(htmlBoard) {
    this.board = []
    this.htmlBoard = htmlBoard
    this.boardSide = 8
    this.snippetFilename = '../example.txt'
    this.generateBoard()
  }

  generateBoard() {
    for (let i = 0; i < this.boardSide; i++) {
      this.board.push([]);
      for (let j = 0; j < this.boardSide; j++) {
        this.board[i].push([]);
      }
    }

    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= this.boardSide; j++) {
        this.board[i - 1][j - 1] = new Piece(i*j, Color.RED);
      }
    }

    for (let i = 5; i <= 7; i++) {
      for (let j = 1; j <= this.boardSide; j++) {
        this.board[i - 1][j - 1] = new Piece(i*j, Color.BLUE);
      }
    }

    
  }
}