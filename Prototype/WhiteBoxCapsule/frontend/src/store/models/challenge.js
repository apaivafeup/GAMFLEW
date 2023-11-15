export class Challenge {
  constructor(name, count, timer, board = null, objective, hint, file, submit) {
    this.name = name
    this.count = count
    this.timer = timer
    this.board = board
    this.objective = objective
    this.hint = hint
    this.file = file
    this.submit = submit
  }
}
