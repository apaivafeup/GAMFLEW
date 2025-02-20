export const Color = Object.freeze({
  RED: 'red',
  BLUE: 'blue',
  STACK: 'stack',
  SELECTED: 'selected',
  EMPTY: 'empty'
})

export class Piece {
  constructor(position, color, stack = null) {
    this.color = color

    if (this.color == Color.EMPTY && stack == null) {
      this.stack = { red: 0, blue: 0 }
    } else {
      if (stack != null) this.stack = stack
      else
        this.stack = { red: this.color == Color.RED ? 1 : 0, blue: this.color == Color.RED ? 0 : 1 }
    }
    this.position = position
    this.selected = false
    this.king = false
  }

  setEmpty() {
    this.stack = { red: 0, blue: 0 }
    this.updateColor()
  }

  setStack(stack) {
    this.stack = stack
    this.updateColor()
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
    this.updateColor()
  }

  setColor(color) {
    this.color = color
  }

  updateColor() {
    if ((this.stack.red == 1 && this.stack.blue == 1) || (this.stack.red > 1 || this.stack.blue > 1)) {
      this.color = Color.STACK
      this.king = false
    } else if (this.stack.red > 0) {
      this.color = Color.RED
    } else if (this.stack.blue > 0) {
      this.color = Color.BLUE
    } else {
      this.color = Color.EMPTY
    }
  }

  select() {
    this.selected = !this.selected
  }

  update(x, y, king) {
    this.position = { x: x, y: y }

    this.king = king;

    if (this.color == Color.RED && this.position.x == 7) {
      this.king = true
    } else if (this.color == Color.BLUE && this.position.x == 0) {
      this.king = true
    }
  }
}
