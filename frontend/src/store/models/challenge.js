import { instrumentCode, evaluateCoverage } from "../../assets/js/codeInstrumenter.js";

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
    achievement,
    achievement_hint,
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
    this.achievement = achievement
    this.achievement_hint = achievement_hint
    this.owner = owner
  }
}

export function runCoverage(originalCode, input, challengeType, testCaseCount, lineRange) {
  const { instrumentedCode, coverageMap } = instrumentCode(originalCode, challengeType, lineRange);

  const serializedInput = {
    state: JSON.parse(JSON.stringify(input.state)),
    log: JSON.parse(JSON.stringify(input.log)),
    currentKey: input.currentKey,
    outOfBoundsState: JSON.parse(JSON.stringify(input.outOfBoundsState))
  };

  return new Promise(resolve => {
    const worker = new Worker(
      new URL("../coverageWorker.js", import.meta.url), { type: "module" }
    );

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ success: false, timeout: true });
    }, 5000);

    worker.onmessage = e => {
      clearTimeout(timer);
      worker.terminate();

      if (e.data.type === "COVERAGE_RESULTS") {
        console.log('Received coverage results from worker:', e.data.result);
        resolve({ coverageMap: e.data.result });
      } else if (e.data.type === "ERROR") {
        console.error('Error in coverage worker:', e.data.error);
        resolve({ error: e.data.error });
      }
    };

    worker.postMessage({
      originalCode: instrumentedCode,
      inputData: serializedInput,
      coverageMap,
      testCaseCount
    });
  });
}