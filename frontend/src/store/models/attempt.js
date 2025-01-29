export class Attempt {
  constructor(player_id, challenge_id, time, score, attempt_type, comment) {
    this.player_id = player_id
    this.challenge_id = challenge_id
    this.time = time
    this.score = score
    this.attempt_type = attempt_type
    this.comment = comment
  }

  setScore(score) {
    this.score = score
  }
}
