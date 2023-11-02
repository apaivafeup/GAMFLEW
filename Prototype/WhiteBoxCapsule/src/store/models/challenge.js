export class Challenge {
  constructor(name, count, timer, board = null, file, f) {
    this.name = name
    this.count = count
    this.timer = timer
    this.board = board
    this.file = file
    this.f = f
  }
}
