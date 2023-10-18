export const Color = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  STACK: 'stack',
  EMPTY: 'empty'
})

export class Piece {
  constructor(position, color) {
    this.color = color

    if (this.color == Color.EMPTY) {
      this.stack = { red: 0, blue: 0 }
    } else {
      this.stack = { red: (this.color == Color.RED ? 1 : 0), blue: (this.color == Color.RED ? 0 : 1) }
    }
    this.position = position
  }

  setEmpty() {
    this.stack = { red: 0, blue: 0 }
  }

  setStack(redCount, blueCount) {
    this.stack.red = redCount
    this.stack.blue = blueCount
  }

  getStack() {
    return this.stack
  }

  setColor(color) {
    this.color = color
  }
}
