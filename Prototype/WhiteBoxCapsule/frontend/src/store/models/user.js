export class User {
  constructor(name, username, avatar, score, failedAttempts, successfulAttempts, achievements) {
    this.name = name
    this.username = username
    this.avatar = avatar
    this.score = score
    this.failedAttempts = failedAttempts
    this.successfulAttempts = successfulAttempts
    this.achievements = achievements
  }
}
