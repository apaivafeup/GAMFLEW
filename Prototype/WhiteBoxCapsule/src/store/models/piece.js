export const Color = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  STACK: 'stack',
  SELECTED: 'selected',
  EMPTY: 'empty'
})

export class Piece {
  constructor(position, color) {
    this.color = color

    if (this.color == Color.EMPTY) {
      this.stack = { red: 0, blue: 0 }
    } else {
      this.stack = { red: this.color == Color.RED ? 1 : 0, blue: this.color == Color.RED ? 0 : 1 }
    }
    this.position = position
    this.selected = false;
  }

  setEmpty() {
    this.stack = { red: 0, blue: 0 }
    this.color = Color.EMPTY
  }

  setStack(redCount, blueCount) {
    this.stack.red = redCount
    this.stack.blue = blueCount
  }

  pieceCount() {
    return this.stack.red + this.stack.blue
  }

  getStack() {
    return this.stack
  }

  addStack(stack) {
    this.stack.red += stack.red
    this.stack.blue += stack.blue
  }

  setColor(color) {
    this.color = color
  }

  select() {
    this.selected = !this.selected
  }
}
