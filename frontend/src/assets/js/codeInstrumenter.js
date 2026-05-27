export function createCoverageTracker(coverageMap) {
    return {
        hitStatement(id, value) {
            if (coverageMap[id]) {
                coverageMap[id].hit = true;
            }
            return value;
        },
        hitDecision(id, value) {
            if (coverageMap[id]) {
                if (typeof value === 'boolean') {
                    if (value) {
                        coverageMap[id].trueHit = true;
                    }
                    else {
                        coverageMap[id].falseHit = true;
                    }
                }
            }
            return value;
        },
        hitCondition(id, conditionIndex, value) {
            if (coverageMap[id]) {
                if (typeof value === 'boolean') {
                    if (value) {
                        coverageMap[id].trueHits[conditionIndex] = true;
                    }
                    else {
                        coverageMap[id].falseHits[conditionIndex] = true;
                    }
                }
            }
        },
        hitMCDC(id, conditionValues, conditionOutput) {
            if (coverageMap[id]) {
                if (typeof conditionOutput === 'boolean') {
                    // Find the matching condition key. .find callback must return a boolean.
                    const conditionKey = Object.keys(coverageMap[id].conditionsValues).find(key =>
                        coverageMap[id].conditionsValues[key].every((value, index) => value === conditionValues[index])
                    );

                    const conditionId = conditionKey !== undefined ? parseInt(conditionKey, 10) : -1;

                    if (conditionId !== -1 && coverageMap[id].decisionOutput[conditionId] === conditionOutput) {
                        coverageMap[id].casesHit[conditionId] = true;
                    }
                }
            }
        }
    };
}

export function instrumentCode(sourceCode, challengeType, lineRange) {
    if (challengeType === 'statement') {
        return instrumentStatementChallenge(sourceCode, lineRange);
    } else if (challengeType === 'decision') {
        return instrumentDecisionChallenge(sourceCode, lineRange);
    } else if (challengeType === 'condition') {
        return instrumentConditionChallenge(sourceCode, lineRange);
    } else if (challengeType === 'mcdc') {
        return instrumentMCDCChallenge(sourceCode, lineRange);
    } else {
        throw new Error(`Instrumenter loaded with unsupported challenge type: ${challengeType}`);
    }
}

export function evaluateCoverage(coverageMap, challengeType) {
    if (challengeType === 'statement') {
        return Object.values(coverageMap).every(statement => statement.hit);
    } else if (challengeType === 'decision') {
        return Object.values(coverageMap).every(decision => decision.trueHit && decision.falseHit);
    } else if (challengeType === 'condition') {
        return Object.values(coverageMap).every(condition => Object.values(condition.trueHits).every(hit => hit === true) && Object.values(condition.falseHits).every(hit => hit === true));
    } else if (challengeType === 'mcdc') {
        return Object.values(coverageMap).every(mcdc => Object.values(mcdc.casesHit).every(hit => hit === true));
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

function instrumentDecisionChallenge(sourceCode, lineRange) {
    const coverageMap = {};

    let statementId = 0;

    let instrumentedCode = sourceCode.replace(
        /if\s*\(([^()]*(?:\([^()]*(?:\([^()]*\)[^()]*)*\)[^()]*)*)\)/g,
        (match, condition, offset) => {
            const line = sourceCode.substring(0, offset).split('\n').length;

            if (Number(line) < lineRange[0] || Number(line) > lineRange[1]) {
                return match;
            }
            else {
                const id = statementId++;

                coverageMap[id] = { line, trueHit: false, falseHit: false, value: condition.trim() };

                return `__coverage__.hitDecision('` + id + `', eval('` + condition.trim() + `'));\n${match}`;
            }
        }
    );

    console.log('Final Instrumented code:', instrumentedCode);

    return { instrumentedCode, coverageMap };
}

function instrumentConditionChallenge(sourceCode, lineRange) {
    const coverageMap = {};

    let statementId = 0;

    let instrumentedCode = sourceCode.replace(
        /if\s*\(([^()]*(?:\([^()]*(?:\([^()]*\)[^()]*)*\)[^()]*)*)\)/g,
        (match, condition, offset) => {
            const line = sourceCode.substring(0, offset).split('\n').length;
            
            if (Number(line) < lineRange[0] || Number(line) > lineRange[1]) {
                return match;
            }
            else {
                const id = statementId++;

                let trueHits = {};
                let falseHits = {};

                let coverageCallString = ``;

                condition = condition.split(/(&&|\|\|)/).map(part => part.trim()).filter(part => part && part !== '&&' && part !== '||');

                condition.forEach((part, index) => {
                    trueHits[index] = false;
                    falseHits[index] = false;

                    coverageCallString += `__coverage__.hitCondition('` + id + `', ` + index + `, eval('` + part + `'));\n`;
                });

                coverageMap[id] = { line, trueHits, falseHits, value: condition };

                return coverageCallString + match;
            }
        }
    );

    console.log('Final Instrumented code:', instrumentedCode);

    return { instrumentedCode, coverageMap };
}

function instrumentMCDCChallenge(sourceCode, lineRange) {
    const coverageMap = {};

    let statementId = 0;

    let instrumentedCode = sourceCode.replace(
        /if\s*\(([^()]*(?:\([^()]*(?:\([^()]*\)[^()]*)*\)[^()]*)*)\)/g,
        (match, condition, offset) => {
            const line = sourceCode.substring(0, offset).split('\n').length;
            if (Number(line) < lineRange[0] || Number(line) > lineRange[1]) {
                return match;
            }
            else {
                const id = statementId++;

                let conditionsValues = {0 : []};
                let decisionOutput = {0: false};
                let casesHit = {0: false};
                let tempArray = [];
                
                let tempCallString = ``;
                let coverageCallString = ``;

                if (condition.includes('&&')) {
                    const parts = condition.split('&&').map(part => part.trim());

                    conditionsValues[0] = new Array(parts.length).fill(true);
                    decisionOutput[0] = true;
                    casesHit[0] = false;

                    parts.forEach((part, index) => {
                        tempArray = new Array(parts.length).fill(true);

                        tempArray[index] = false;

                        conditionsValues[index + 1] = tempArray;
                        decisionOutput[index + 1] = false;

                        casesHit[index + 1] = false;

                        tempCallString += `eval('` + part + `')` + (index < parts.length - 1 ? ', ' : ']');
                    });

                    coverageCallString += `__coverage__.hitMCDC('` + id + `', [` + tempCallString + `, eval('` + condition + `'));\n`;
                } else if (condition.includes('||')) {
                    const parts = condition.split('||').map(part => part.trim());

                    conditionsValues[0] = new Array(parts.length).fill(false);
                    decisionOutput[0] = false;
                    casesHit[0] = false;

                    parts.forEach((part, index) => {
                        tempArray = new Array(parts.length).fill(false);

                        tempArray[index] = true;

                        conditionsValues[index + 1] = tempArray;
                        decisionOutput[index + 1] = true;

                        casesHit[index + 1] = false;

                        tempCallString += `eval('` + part + `')` + (index < parts.length - 1 ? ', ' : ']');
                    });

                     coverageCallString += `__coverage__.hitMCDC('` + id + `', [` + tempCallString + `, eval('` + condition + `'));\n`;
                }

                coverageMap[id] = { line, conditionsValues, decisionOutput, casesHit, value: condition.trim() };

                return coverageCallString + match;
            }
        }
    );

    console.log('Final Instrumented code:', instrumentedCode);

    return { instrumentedCode, coverageMap };
}


