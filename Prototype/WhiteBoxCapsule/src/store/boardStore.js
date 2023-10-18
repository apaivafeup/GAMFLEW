import { defineStore } from 'pinia'
import { Piece, Color } from './models/piece.js'

export const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23];
export const bluePos = [42, 44, 46, 48, 49, 51, 53, 55, 58, 60, 62, 64];

export const boardStore = defineStore('boardStore', {
  state: () => {
    return {
      state: [],
      selectedPiece: null,
      selectedCoords: { x: 0, y: 0 }
    };
  },
  actions: {
    selectPiece(x, y) {
      if (this.selectedPiece == null) {
        this.selectedCoords.x = x;
        this.selectedCoords.y = y;
        this.selectedPiece = this.state[x][y];
        console.log(this.selectedPiece);
      } else if (this.selectedPiece == this.state[x][y]) {
        this.selectedPiece = null;
      } else {
        this.movePiece(x, y);
      }
    },

    movePiece(x, y) {
      console.log(document);
      var logicalSpot = this.state[x][y],
          spot = document.getElementById("board-box-" + x + "-" + y);

      var selectedSpot = document.getElementById("board-box-" + this.selectedCoords.x + "-" + this.selectedCoords.y);

      if (logicalSpot.color == Color.EMPTY) {
        logicalSpot.setColor(this.selectedPiece.color);
        spot.children[0].classList.remove("empty");
        spot.children[0].classList.add(this.selectedPiece.color);

        this.selectedPiece.setColor(Color.EMPTY);
        selectedSpot.children[0].classList.remove(this.selectedPiece.color);
        selectedSpot.children[0].classList.add("empty");

        this.selectedPiece = null;
      }
    },

    emptyState() {
      state = []
    },

    generateState() {
      for (let i = 1; i <= 8; i++) {
        this.state.push([])
      }

      var edge = true;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (i == 3 || i == 4) {
            this.state[i].push(new Piece({ "x": i, "y": j }, Color.EMPTY))
            continue;
          }

          var color;
          if (i < 3) {
            color = Color.RED;
          } else {
            color = Color.BLUE;
          }

          if (edge) {
            if (j % 2 == 0)
              this.state[i].push(new Piece({ "x": i, "y": j }, color))
            else
              this.state[i].push(new Piece({ "x": i, "y": j }, Color.EMPTY))
          } else {
            if (j % 2 == 0)
              this.state[i].push(new Piece({ "x": i, "y": j }, Color.EMPTY))
            else
              this.state[i].push(new Piece({ "x": i, "y": j }, color))
          }
        }
        edge = !edge;
      }
    }
  }
})
