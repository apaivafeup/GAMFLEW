import {auxiliaryFunctions} from '../../src/assets/js/auxiliary_functions.js'; 
import { createCoverageTracker } from '../assets/js/codeInstrumenter.js';
import { Color, Piece } from './models/piece.js';

self.onmessage = function (e) {
    const { originalCode, inputData, coverageMap, testCaseCount } = e.data;

    try {
        const result = runCoverageTests(originalCode, inputData, coverageMap, testCaseCount)
        self.postMessage({ type: "COVERAGE_RESULTS", result })
    } catch (error) {
        self.postMessage({ type: "ERROR", error: error.message })
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

function runCoverageTests(originalCode, inputData, coverageMap, testCaseCount) {
    const helperFunctions = compileAuxiliaryFunctions();
    const helperContext = { ...helperFunctions };
    const __coverage__ = createCoverageTracker(coverageMap);
    const entryFunctionName = getFunctionName(originalCode);

    //console.log('Running coverage tests with input data:', inputData.state);

    const fn_original = new Function(
        ...Object.keys(helperContext),
        'helperContext',
        '__coverage__',
        'Color',
        'Piece',

        `${originalCode}
        
        if (typeof ${entryFunctionName} !== 'function') {
            throw new Error('Original code must define a ${entryFunctionName} function');
        }

        return function(...args) {
            return ${entryFunctionName}.apply(helperContext, args);
        };`
        
    )(...Object.values(helperContext), helperContext, __coverage__, Color, Piece);

    for (let i = 0; i < testCaseCount; i++) {
        const board = {
            state: inputData.state[i],
            log: inputData.log[i],
            currentKey: inputData.currentKey,
            outOfBoundsState: inputData.outOfBoundsState[i]
        };

        console.log(`Executing test case ${i} with board state:`, board.state[2][0]);

        try {
            fn_original(board);
        }
        catch (error) {
            console.error(`Error executing test case ${i}:`, error);
        }
        finally {
            // console.log(`Coverage after test case ${i}:`, coverageMap);
        }
    }

    return coverageMap;
};