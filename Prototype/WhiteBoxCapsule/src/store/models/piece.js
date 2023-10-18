export const Color = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  STACK: 'stack',
  EMPTY: "empty"
})

export class Piece {
  constructor(position, color = Color.STACK) {
    this.color = color
    this.stack = { red: 0, blue: 0 }
    this.position = position
  }

  setEmpty() {
    this.stack = { red: 0, blue: 0 }
  }

  setStack(redCount, blueCount) {
    this.stack.red = redCount
    this.stack.blue = blueCount
  }

  setColor(color) {
    this.color = color
  }
}
