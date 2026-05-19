export function createCoverageTracker(coverageMap) {
    return {
        hitStatement(id, value) {
            if (coverageMap[id]) {
                coverageMap[id].hit = true;
            }
            return value;
        },
    };
}

export function instrumentCode(sourceCode, challengeType, lineRange) {
    if (challengeType === 'statement') {
        return instrumentStatementChallenge(sourceCode, lineRange);
    } else if (challengeType === 'decision') {
        return instrumentDecisionChallenge(sourceCode, lineRange);
    } else if (challengeType === 'condition') {
        return instrumentConditionChallenge(sourceCode, lineRange);
    }
    else {
        throw new Error(`Instrumenter loaded with unsupported challenge type: ${challengeType}`);
    }
}

export function evaluateCoverage(coverageMap, challengeType) {
    if (challengeType === 'statement') {
        return Object.values(coverageMap).every(statement => statement.hit);
    }

    return false;
}
    

function instrumentStatementChallenge(sourceCode, lineRange)
{
    const coverageMap = {};

    let statementId = 0;

    let instrumentedCode = sourceCode.replace(
        /return\s+([^;]+);|if\s*\(|else\s*{/g,
        (match, value, offset) => {
            const line = sourceCode.substring(0, offset).split('\n').length;

            if (Number(line) < lineRange[0] || Number(line) > lineRange[1]) {
                return match;
            }
            else {
                const id = statementId++;

                if (value !== undefined) { // Return Statements
                    coverageMap[id] = { line, hit: false, value: value.trim() };

                    return `__coverage__.hitStatement('` + id + `', '` + value + `');\n return ${value};`;
                }
                else if (match.includes('if')) { // If Statements
                    coverageMap[id] = { line, hit: false, value: 'if statement' };

                    return `__coverage__.hitStatement('` + id + `', 'if statement');\n${match}`;
                }
                else { // Else Statements
                    coverageMap[id] = { line, hit: false, value: 'else statement' };

                    return `${match}\n__coverage__.hitStatement('` + id + `', 'else statement');`;
                }
            }
        }
    );

    console.log('Final Instrumented code:', instrumentedCode);

    return { instrumentedCode, coverageMap };
}