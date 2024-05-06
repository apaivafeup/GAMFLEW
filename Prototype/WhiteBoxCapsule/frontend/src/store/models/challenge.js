export class Challenge {
  constructor(
    id,
    name,
    difficulty,
    hint,
    objective,
    test_cases_count,
    score,
    initial_board,
    code_file,
    challenge_type,
    passing_criteria,
    achievement_criteria,
    owner
  ) {
    this.id = id
    this.name = name
    this.difficulty = difficulty
    this.hint = hint
    this.objective = objective
    this.test_cases_count = test_cases_count
    this.score = score
    this.initial_board = initial_board
    this.code_file = code_file
    this.challenge_type = challenge_type
    this.passing_criteria = passing_criteria
    this.achievement_criteria = achievement_criteria
    this.owner = owner
  }
}
