import { Challenge } from '../../../store/models/challenge'

export class TestChallenge extends Challenge {
  submit(board) {
    var truePassed = false,
        falsePassed = false

    for (var i = 0; i < this.count; i++) {
        if (board.log.length - i < 0)
            break

        var log = board.log[board.currentKey - i],
            from = log[log.length - 1].from,
            to = log[log.length - 1].to
        
        if (!this.f(from, to)) {
            falsePassed = true
        }

        if (this.f(from, to)) {
            truePassed = true
        }
    }

    if (truePassed && falsePassed) {
        alert("YOU PASSED!")
    } else {
        alert("YOU FAILED, TRY AGAIN!")
    }
  }
}
