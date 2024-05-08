export class User {
  constructor(id, name, username, picture, score, failedAttempts, successfulAttempts, achievements, user_type) {
    this.id = id
    this.name = name
    this.username = username
    this.picture = picture
    this.score = score
    this.failedAttempts = failedAttempts
    this.successfulAttempts = successfulAttempts
    this.achievements = achievements
    this.user_type = user_type
  }
}