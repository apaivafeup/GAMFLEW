export class Challenge {
  constructor(name, count, timer, board, objective, hint, code_file, submit, owner) {
    this.name = name
    this.count = count
    this.timer = timer
    this.board = board
    this.objective = objective
    this.hint = hint
    this.code_file = code_file
    this.submit = submit
    this.owner = owner
  }
}
