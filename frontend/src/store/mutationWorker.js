import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine';

const Color = {
    RED: 'red',
    BLUE: 'blue'
};

self.onmessage = function (e) {
    const { mutantCode, inputData } = e.data;

    try {
        const failed = runJasmineTests(mutantCode, inputData);
    } catch (error) {
        self.postMessage({ type: "ERROR", error: error.message });
    }
};

function get_pieces(inputData) {
    let pieces = [];

    for (const key of inputData.state[inputData.currentKey]) {
        for (const piece of key) {
            if (piece.color !== "empty") {
                pieces.push(piece);
            }
        }
    }
    return pieces;
}

function createJasmineEnv() {
    const jasmine = jasmineRequire.core(jasmineRequire);
    const env = jasmine.getEnv();
    env.clearReporters();
    return { jasmine, env };
}

function runJasmineTests(mutantCode, inputData) {
    const { jasmine, env } = createJasmineEnv();
    const jasmineInterface = jasmineRequire.interface(jasmine, env);
    const { describe, it, expect } = jasmineInterface;
    
    let failed = false;

    env.addReporter({
        specDone: function(result) {
            console.log(`Test ${result.fullName}: ${result.status}`);
            if (result.status === 'failed') {
                failed = true;
            }
        },
        jasmineDone: function() {
            self.postMessage({ type: "TEST_RESULTS", mutantKilled: failed });
        }
    });

    // Compile mutated source into a callable function.
    // Supports code that declares `has_game_ended` and uses `this.get_pieces`/`Color`.
    const compileMutant = new Function(
        'get_pieces',
        'Color',
        `
        ${mutantCode}

        if (typeof has_game_ended === 'function') {
            return function (board) {
                return has_game_ended.call({ get_pieces }, board);
            };
        }

        throw new Error('Mutant code must define a has_game_ended(board) function');
        `
    );

    const fn = compileMutant(get_pieces, Color);

    // predefined test
    describe("Game Ended", () => {
        it("computes correctly", () => {
            let pieces = get_pieces(inputData);
            const result = fn(inputData);

            console.log("Result of mutant function:", result);

            expect(typeof result).toBe("boolean");

            if (pieces.length === 0) {
                expect(result).toBe(false);
            } 
            else if (pieces.length === 1) {
                expect(result).toBe(true);
            } 
            else if (pieces.every(p => p.color === "red") || pieces.every(p => p.color === "blue")) {
                expect(result).toBe(true);
            }
            else {
                expect(result).toBe(false);
            }
        });
    });

    env.execute();
}
