import { Challenge } from "./challenge.js";

export class MutationChallenge extends Challenge {
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
        passing_criteria, //Might be removed in the future
        achievement,
        achievement_hint,
        owner,
        mutants
    ) {
        super(
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
        );
        this.mutants = mutants;
    }
}

export function runMutant(fn, input, timeout = 2000) {
    return new Promise(resolve => {
        const serializedInput = {
            state: JSON.parse(JSON.stringify(input.state)),
            log: JSON.parse(JSON.stringify(input.log)),
            currentKey: input.currentKey,
            outOfBoundsState: JSON.parse(JSON.stringify(input.outOfBoundsState))
        }
        
        const worker = new Worker(
            new URL("../mutationWorker.js", import.meta.url), { type: "module" }
        );

        const timer = setTimeout(() => {
            worker.terminate();
            resolve({ killed: false, timeout: true });
        }, timeout);

        worker.onmessage = e => {
            clearTimeout(timer);
            worker.terminate();
            resolve(e.data);
        };

        worker.postMessage({ mutantCode: fn.toString(), inputData: serializedInput });
    });
}