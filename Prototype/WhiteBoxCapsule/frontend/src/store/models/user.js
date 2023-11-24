export class User {
  constructor(name, email, avatar, score, failedAttempts, successfulAttempts, achievements) {
    this.name = name
    this.email = email
    this.avatar = avatar
    this.score = score
    this.failedAttempts = failedAttempts
    this.successfulAttempts = successfulAttempts
    this.achievements = achievements
  }
}
