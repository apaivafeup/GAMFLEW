export class Attempt {
  constructor(player_id, challenge_id, time, time_elapsed, score, attempt_type, comment) {
    this.player_id = player_id
    this.challenge_id = challenge_id
    this.time = time
    this.time_elapsed = time_elapsed
    this.score = score
    this.attempt_type = attempt_type
    this.comment = comment
  }

  setTimeElapsed(final_time) {
    this.time_elapsed = this.time - final_time
    this.setScore()
  }

  setScore() {
    //TODO: implement score calculation
    this.score = 0
  }
}
