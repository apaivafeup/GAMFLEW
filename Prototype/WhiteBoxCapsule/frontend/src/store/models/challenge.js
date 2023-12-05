export class Challenge {
  constructor(
    id,
    name,
    description,
    difficulty,
    hint,
    objective,
    test_cases_count,
    timer_value,
    initial_board,
    code_file,
    passing_criteria,
    achievement_criteria,
    owner
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.difficulty = difficulty
    this.hint = hint
    this.objective = objective
    this.test_cases_count = test_cases_count
    this.timer_value = timer_value
    this.initial_board = initial_board
    this.code_file = code_file
    this.passing_criteria = passing_criteria
    this.achievement_criteria = achievement_criteria
    this.owner = owner
  }
}
