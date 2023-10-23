export class Challenge {
  constructor(name, count, timer, board = null, file) {
    this.name = name
    this.count = count
    this.timer = timer
    this.board = board
    this.file = file
  }
}
