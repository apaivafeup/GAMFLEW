import { Challenge } from '../../../store/models/challenge'

export class TestChallenge extends Challenge {
  constructor(name, count, timer, board, testCode, f) {
    super(name, count, timer, board, testCode, f)
    this.hint =
      'You must cover both branches of the if statement - it may be true or false, as you can see.'
    this.objective = 'You need to cover the if (b < 2) line.'
  }

  submit(board) {
    var truePassed = false,
        falsePassed = false

    for (var i = 0; i < this.count; i++) {
      if (board.log.length - i < 0) {
        break
      }

      var log = board.log[board.currentKey - i];

      if (log.length <= 1){
        break
      }

      var from = log[log.length - 1].from,
          to = log[log.length - 1].to

      if (!this.f(from, to)) {
        falsePassed = true
      }

      if (this.f(from, to)) {
        truePassed = true
      }
    }

    if (truePassed && falsePassed) {
      board.pass()
    } else {
      board.fail()
    }
  }
}
