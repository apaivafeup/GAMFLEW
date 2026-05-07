import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine';
import {auxiliaryFunctions} from '../../src/assets/js/auxiliary_functions.js'; 
import { Color, Piece } from './models/piece.js';

self.onmessage = function (e) {
    const { originalCode, mutantCode, inputData, mutantId } = e.data;

    try {
        const failed = runJasmineTests(originalCode, mutantCode, inputData, mutantId);
    } catch (error) {
        self.postMessage({ type: "ERROR", error: error.message });
    }
};

function compileAuxiliaryFunctions() {
    const compiledFunctions = {};

    for (const [name, code] of Object.entries(auxiliaryFunctions)) {
        compiledFunctions[name] = new Function('Color', 'Piece', `${code}; return ${name};`)(Color, Piece);
    }

    return compiledFunctions;
}

function getFunctionName(sourceCode) {
    const match = sourceCode.match(/function\s+([A-Za-z_$][\w$]*)\s*\(/);

    if (!match) {
        throw new Error('Could not determine the target function name from the provided source');
    }

    return match[1];
}

function compileCallableSource(sourceCode, helperContext) {
    const helperNames = Object.keys(helperContext);
    const targetName = getFunctionName(sourceCode);

    const factory = new Function(
        ...helperNames,
        'Color',
        'Piece',
        'helperContext',
        `
        ${sourceCode}

        if (typeof ${targetName} !== 'function') {
            throw new Error('Source code must define a ${targetName} function');
        }

        return function (...args) {
            return ${targetName}.apply(helperContext, args);
        };
        `
    );

    return factory(...helperNames.map(name => helperContext[name]), Color, Piece, helperContext);
}

function createJasmineEnv() {
    const jasmine = jasmineRequire.core(jasmineRequire);
    const env = jasmine.getEnv();
    env.clearReporters();
    return { jasmine, env };
}

function runJasmineTests(originalCode, mutantCode, inputData, mutantId) {
    const { jasmine, env } = createJasmineEnv();
    const jasmineInterface = jasmineRequire.interface(jasmine, env);
    const { describe, it, expect } = jasmineInterface;
    
    let failed = false;

    const helperFunctions = compileAuxiliaryFunctions();
    const helperContext = { ...helperFunctions };

    env.addReporter({
        specDone: function(result) {
            console.log(`Test ${result.fullName}: ${result.status}`);
            if (result.status === 'failed') {
                failed = true;
            }
        },
        jasmineDone: function() {
            self.postMessage({ type: "TEST_RESULTS", mutantKilled: failed, mutantId: mutantId });
        }
    });

    const fn_original = compileCallableSource(originalCode, helperContext);
    const fn_mutant = compileCallableSource(mutantCode, helperContext);

    // Convert inputData to the expected format for the test
    const board = {
        state: inputData.state[mutantId],
        currentKey: inputData.currentKey,
        log: inputData.log,
        outOfBoundsState: inputData.outOfBoundsState[mutantId]   
    }

    // Test suite for the mutant
    describe("Comparing Mutant with Original", () => {
        it("produces the same result", () => {
            const result_original = fn_original(board);
            const result_mutant = fn_mutant(board);

            expect(result_mutant).toEqual(result_original);
        });
    });

    env.execute();
}
