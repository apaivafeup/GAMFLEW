export class Challenge {
  constructor(name, count, timer, board = null, objective, hint, file, submit, owner) {
    this.name = name
    this.count = count
    this.timer = 15
    this.board = board
    this.objective = objective
    this.hint = hint
    this.file = file
    this.submit = submit
    this.owner = owner
  }
}
