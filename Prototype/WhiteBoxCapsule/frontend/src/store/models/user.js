export class User {
  constructor(id, name, username, picture, score, failedAttempts, successfulAttempts, achievements, user_type, student_class) {
    this.id = id
    this.name = name
    this.username = username
    this.picture = picture
    this.score = score
    this.failedAttempts = failedAttempts
    this.successfulAttempts = successfulAttempts
    this.achievements = achievements
    this.user_type = user_type
    this.student_class = student_class
  }
}