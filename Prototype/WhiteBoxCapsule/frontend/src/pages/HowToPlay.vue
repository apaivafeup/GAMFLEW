<script setup>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
</script>

<template>
    <h2 class="modal-title" style="text-align: center; margin-bottom: 7.5px;">How To Play</h2>
    <div class="container" style="display: flex; align-items: center; flex-direction: column;">
        <div class="row"
            style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; align-items: center; flex-direction: row; width: 100%; ">
            <button id="guide-button-1" class="col button is-primary is-fullwidth guide-button guide-button-selected"
                style="margin: 0px;" @click="changeTab('board', '1')">
                Board
            </button>
            <button id="guide-button-2" class="col button is-primary is-fullwidth guide-button" style="margin: 0px;"
                @click="changeTab('auxiliary_functions', '2')">
                Auxiliary Functions
            </button>
            <button id="guide-button-3" class="col button is-primary is-fullwidth guide-button" style="margin: 0px;"
                @click="changeTab('code_coverage', '3')">
                Code Coverage Measures
            </button>
            <button id="guide-button-4" class="col button is-primary is-fullwidth guide-button" v-if="auth.user.type != 'student'" style="margin: 0px;"
                @click="changeTab('teacher_view', '4')">
                Teacher View
            </button>
            <button id="guide-button-4" class="col button is-primary is-fullwidth guide-button disabled" v-else style="margin: 0px;">
                Teacher View
            </button>
            <button id="guide-button-5" class="col button is-primary is-fullwidth guide-button" style="margin: 0px;"
                @click="changeTab('multiplayer', '5')">
                Multiplayer
            </button>
        </div>
        <div v-if="tab == 'board'" class="display: grid; grid-template-rows: 50% 50%; grid-template-columns: 100%;"
            style="font-size: 12px !important">
            <div class="row" style="justify-content: center;
            width: 100%;
            display: flex;
            align-content: center;
            flex-direction: row;
            margin: 0px;">
                <div class="col" style="
                        margin-bottom: 10px;
                        margin-right: 7.5px;
                        border: #ccc 1px solid;
                        padding: 10px;
                      ">
                    <h6>Test Cases</h6>
                    <p style="text-align: justify; margin: 0px">
                        When you click the
                        <button class="button is-primary is-fullwidth">Previous</button> and
                        <button class="button is-primary is-fullwidth">Next</button> buttons, you cycle
                        through different boards - for each challenge, you get as many as you need.
                        <br style="margin-bottom: 5px" />
                        When all your test cases are done, click the
                        <button class="button is-primary is-fullwidth">Go!</button> button to check
                        your answer. <br style="margin-bottom: 5px" />
                        After this, you have to click the
                        <button class="button is-primary is-fullwidth">Comment</button> button and explain
                        your solution - it's required for your attempt to be submitted! And anonymous to
                        other players. <br />
                    </p>
                </div>
                <div class="col" style="
                        margin-bottom: 10px;
                        margin-left: 7.5px;
                        margin-right: 7.5px;
                        border: #ccc 1px solid;
                        padding: 10px;
                      ">
                    <h6>Interacting with the Board</h6>
                    <p style="text-align: justify; margin: 0px">
                        The boards have boxes where pieces can be placed. See below the possible states.
                    </p>
                    <div class="row" style="display: flex; justify-content: center; margin: 5px 0px 5px 0px">
                        <div class="box" id="board-box-example-red" style="width: 55px; height: 55px"></div>

                        <div class="box" id="board-box-example-red" style="width: 55px; height: 55px; padding: 0px">
                            <div class="square square-lg small red" style="
                              height: 45px;
                              width: 45px;
                              border-radius: 100px;
                              border: 1px solid var(--border-color);
                            "></div>
                        </div>

                        <div class="box" id="board-box-example-blue" style="width: 55px; height: 55px; padding: 0px">
                            <div class="square square-lg piece blue" style="
                              height: 45px;
                              width: 45px;
                              border-radius: 100px;
                              border: 1px solid var(--border-color);
                            "></div>
                        </div>
                        <div class="box" id="board-box-example-stack" style="width: 55px; height: 55px">
                            <div class="col piece-overlap">
                                <div class="overlap-box">
                                    <div class="square square-lg piece small red"></div>
                                </div>
                                <div class="overlap-box">
                                    <div>2</div>
                                </div>
                                <div class="overlap-box">
                                    <div class="square square-lg piece small blue"></div>
                                </div>
                                <div class="overlap-box">
                                    <div>3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p style="text-align: justify; margin: 0px">
                        To move a piece, click it and it'll turn purple, like so.
                    </p>
                    <div class="row" style="display: flex; justify-content: center; margin: 5px 0px 5px 0px">
                        <div class="box" id="board-box-example-selected"
                            style="width: 55px; height: 55px; padding: 0px">
                            <div class="square square-lg piece selected" style="
                              height: 45px;
                              width: 45px;
                              border-radius: 100px;
                              border: 1px solid var(--border-color);
                            "></div>
                        </div>
                        <div class="box" id="board-box-example-selected-stack" style="width: 55px; height: 55px">
                            <div class="col piece-overlap">
                                <div class="overlap-box">
                                    <div class="square square-lg piece small selected"></div>
                                </div>
                                <div class="overlap-box">
                                    <div>2</div>
                                </div>
                                <div class="overlap-box">
                                    <div class="square square-lg piece small selected"></div>
                                </div>
                                <div class="overlap-box">
                                    <div>3</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p style="text-align: justify; margin: 0px">
                        Then, click the spot you want to move it to. Stacks can also be moved, but only as
                        a whole. Coordinates follow an <em>(x, y)</em> pattern - <em>x</em> is the row and
                        <em>y</em> is the column.
                    </p>
                </div>
                <div class="col" style="
                        margin-bottom: 10px;
                        margin-left: 7.5px;
                        border: #ccc 1px solid;
                        padding: 10px;
                      ">
                    <h6>Kings</h6>
                    <p style="text-align: justify; margin: 0px">
                        Kings work just like in a Checkers game.
                        If you move a red piece to row 7 or a blue piece to row 0, the piece turns into a King.
                        Movement isn't affected, but its appearance changes.
                        See below how it looks.
                    </p>
                    <div class="row" style="justify-content: center; margin-top: 5px;">
                        <div class="box" style="width: 50px; height: 50px; padding: 0px;">
                            <div class="square square-lg piece selected"
                                style="display: flex; justify-content: center; align-items: center; font-size: 20px; width: 45px; height: 45px;">
                                <font-awesome-icon icon="crown" fixed-width style="color: white;" />
                            </div>
                        </div>
                        <div class="box" style="width: 50px; height: 50px; padding: 0px;">
                            <div class="square square-lg piece red"
                                style="display: flex; justify-content: center; align-items: center; font-size: 20px; width: 45px; height: 45px;">
                                <font-awesome-icon icon="crown" fixed-width style="color: white;" />
                            </div>
                        </div>
                        <div class="box" style="width: 50px; height: 50px; padding: 0px;">
                            <div class="square square-lg piece blue"
                                style="display: flex; justify-content: center; align-items: center; font-size: 20px; width: 45px; height: 45px;">
                                <font-awesome-icon icon="crown" fixed-width style="color: white;" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="display: flex;
                justify-content: space-between;
                width: 100%;
                margin: 0px;
                align-content: center;">
                <div class="col" style="
                        margin-bottom: 10px;
                        border: #ccc 1px solid;
                        padding: 10px;
                        margin-right: 7.5px;
                      ">
                    <h6>Adding and Removing Pieces</h6>
                    <p style="text-align: justify; margin: 0px; margin-bottom: -10px">
                        To add a piece, click the
                        <button class="button is-primary is-fullwidth">Add</button> button and then click
                        the spot you want to add it to. Each click gives you one of three states: red, blue,
                        empty (in that order). <br />
                    </p>
                    <div class="row" style="display: flex; justify-content: center">
                        <img src="https://i.ibb.co/nnQYcq2/add-piece.gif" alt="add-piece"
                            style="width: 80px; margin: 5px 0px 5px 0px" />
                    </div>
                    <p style="text-align: justify; margin: 0px">
                        You can add as many pieces as you want, but you can't add pieces to a stack with
                        this feature. You can, however, remove the stack altogether (turn it into an empty
                        spot) and then add individual pieces. Click the
                        <button class="button is-primary is-fullwidth">Add</button> button again to stop
                        adding pieces.
                    </p>
                </div>
                <div class="col"
                    style="margin-bottom: 10px; margin-left: 7.5px; border: #ccc 1px solid; padding: 10px;">
                    <h6>Moving Out of Bounds</h6>
                    <p style="text-align: justify; margin: 0px; margin-bottom: -10px">
                        You can move a piece out of bounds by moving it to the following spot.
                    </p>
                    <div class="row"
                        style="display: flex; justify-content: center; width: 100%; margin-top: 10px; margin-bottom: 10px;">
                        <div class="game-board-out-labels">
                            <div class="game-board-label col"
                                style="display: flex; justify-content: center; font-size: 16px;">Out of Bounds</div>
                        </div>
                        <div class="game-board-out">
                            <div class="box">
                                <OutPieceStack />
                            </div>
                            <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
                                <input id="piece-stack-out-x" class="col box disabled"
                                    style="width: 50px; text-align: center; font-size: 12px" type="number"
                                    placeholder="row" />
                                <input id="piece-stack-out-y" class="col box disabled"
                                    style="width: 50px; text-align: center; font-size: 12px" type="number"
                                    placeholder="column" />
                            </div>
                        </div>
                    </div>
                    <p style="text-align: justify; margin: 0px">
                        You can use the two input boxes below to provide <em>(x, y)</em> coordinates of where to move.
                        The piece will be moved to the spot with the given coordinates. If you don't write anything, the
                        coordinates default to <em>(-1, -1)</em>.
                        <strong>When the spot is occupied,</strong> the input boxes are disabled (see above). Clear the
                        spot to write in them again.
                    </p>
                </div>
            </div>
        </div>
        <div v-if="tab == 'auxiliary_functions'" style="font-size: 16px !important; justify-content: center;">
            <p style="text-align: center;">
                There are a bunch of auxiliary functions that may be used in challenges. <br />
                Their code is superfluous to all challenge objectives, but what the functions do
                is not.
            </p>

            <div class="row" style="padding: 10px; justify-content: center;">
                <select class="col button is-primary guide-button" style="max-width: 750px;" @change="selectFunction(selectedFunction)" v-model="selectedFunction">
                    <option v-for="name in auxiliaryFunctionsNames" :value="name" :key="name" >
                        {{ name }}
                    </option>
                </select>
            </div>
            <div class="row" style="justify-content: center;">
                <CodeBlock id="code-block-example" class="line-numbers" theme="default" height="315px" data-line="1"
                    :prismjs="true" :name="name" :code="auxiliaryFunctions[selectedFunction]" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 750px;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
            </div>
        </div>
        <div v-if="tab == 'code_coverage'" style="font-size: 13px !important; justify-content: center;">
            <div class="row" style="display: grid; grid-template-columns: 0.75fr 2fr;">
                <div class="col" style="width: 1/3%; font-size: 16px;">
                    <button id="code-coverage-button-1" @click="changeCodeCoverage('statement', 1)" class="button is-primary is-fullwidth guide-button-selected" style="width: 100%;">Statement Coverage</button>
                    <button id="code-coverage-button-2" @click="changeCodeCoverage('decision', 2)" class="button is-primary is-fullwidth" style="width: 100%;">Decision Coverage</button>
                    <button id="code-coverage-button-3" @click="changeCodeCoverage('condition', 3)" class="button is-primary is-fullwidth" style="width: 100%;">Condition Coverage</button>
                    <button id="code-coverage-button-4" @click="changeCodeCoverage('condition/decision', 4)" class="button is-primary is-fullwidth" style="width: 100%;">Condition/Decision Coverage</button>
                    <button id="code-coverage-button-5" @click="changeCodeCoverage('mcdc', 5)" class="button is-primary is-fullwidth" style="width: 100%;">Modified Condition/Decision Coverage (MCDC)</button>
                </div>
                <div class="col" style="width: 2/3%; font-size: 16px;">
                    <div v-if="code_coverage == 'statement'">
                        <h6>Statement Coverage</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        This is simplest coverage measure.
                        It checks if each statement in the code has been executed. <br style="margin-bottom: 5px;" />
                        This means that if you have a function with 10 statements and only 9 of them are executed,
                        you have 90% statement coverage. <br style="margin-bottom: 5px;" /> To hit statement coverage of a given line, you just need
                        to ensure its execution.
                    </p>
                    <CodeBlock id="code-block-example" class="line-numbers" theme="default" data-line="1"
                    :prismjs="true" :name="name" :code="statement_code" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 100%;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        If you notice, the <code>var greeting</code> is never skipped if the function is called.
                        However, in each function run, either the <code>greeting = "Good day"</code> or <code>greeting = "Good evening"</code>
                        line will be executed - to execute one, you can't execute another one. <br style="margin-bottom: 5px;"/>
                        This to say that with conditional structures such as an If, statement coverage may not be as simple as it appears.
                    </p>
                    </div>
                    <div v-if="code_coverage == 'decision'">
                        <h6>Decision Coverage</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Decision coverage is about covering all possible outcomes of a decision.
                        It is mostly applied to condition code structures, such as <code>If-Then-Else</code> or <code>Switch Case</code>. <br />
                    </p>
                    <CodeBlock id="code-block-example" class="line-numbers" theme="default" data-line="1"
                    :prismjs="true" :name="name" :code="statement_code" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 100%;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        The <code>if (hour < 18) {</code> line is a decision point - according to its condition yielding True or False,
                        the code will execute one of the two branches. These are: executing the <code>greeting = "Good day";</code> line, or not.<br style="margin-bottom: 5px;"/>
                        To achieve decision coverage, you need to ensure that both branches are executed at least once. Considering the example,
                        you'd need to provide a test case where <code>hour</code> is less than 18, and a test case where <code>hour</code> is NOT less than 18. <br style="margin-bottom: 5px;"/>
                        Regarding the <code>else</code> line: the only way to avoid an <code>else</code> branch is to have the the <code>hour < 18</code> be True. However,
                        if you had, say <code>else if (hour > 18) {</code>, you could avoid this branch with a test case where <code>hour = 18</code>.
                    </p>
                    </div>
                    <div v-if="code_coverage == 'condition'">
                        <h6>Condition Coverage</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Condition coverage is about covering all possible outcomes of a condition.
                        This means that for a given condition in the code, you need to ensure that it evaluates to both True and False. <br style="margin-bottom: 5px;" />
                        <em><q>But isn't that just decision coverage, again?</q></em> <strong>Not really, let's see the difference.</strong>
                    </p>
                    <CodeBlock id="code-block-example" class="line-numbers" theme="default" data-line="1"
                    :prismjs="true" :name="name" :code="condition_code" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 100%;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        If you have a condition like <code>(hour > 6 && hour < 12)</code>, you have two Boolean expressions.
                        For each expression, you need to provide a test case for it being True, and and another where it is False.
                        This is possible with only 2 tests: one where <code>hour = 5</code> (less than 6, less than 12 - False + True) and another where <code>hour = 13</code> (greater than 6, greater than 12 - True + False). <br style="margin-bottom: 5px;"/> With these two cases, both expressions pass True and False, thus achieving 100% condition coverage.
                    </p>
                    </div>
                    <div v-if="code_coverage == 'condition/decision'">
                        <h6>Condition/Decision Coverage</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Condition/decision coverage joins condition and decision coverage.
                        In other words, all expressions from conditions are covered for True and False, and all decision points have both branches executed.
                    </p>
                    <CodeBlock id="code-block-example" class="line-numbers" theme="default" data-line="1"
                    :prismjs="true" :name="name" :code="condition_code" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 100%;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        If you have a condition like <code>(hour > 6 && hour < 12)</code>, you have two Boolean expressions.
                        For each expression, you need to provide a test case for it being True, and and another where it is False. You also must ensure the condition yields True and False (two branches).
                        You can do this with three tests (two is impossible): one where <code>hour = 7</code> (greater than 6, less than 12 - True + True, Branch 1), one where <code>hour = 5</code> (less than 6, less than 12 - False + True, Branch 2) and another where <code>hour = 13</code> (greater than 6, greater than 12 - True + False). These achieve both 100% condition coverage and 100% decision coverage.
                    </p>
                    </div>
                    <div v-if="code_coverage == 'mcdc'">
                        <h6>Modified Condition/Decision Coverage</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Modified condition/decision coverage adapts condition/decision coverage.
                    </p>
                    <CodeBlock id="code-block-example" class="line-numbers" theme="default" data-line="1"
                    :prismjs="true" :name="name" :code="condition_code" lang="javascript" prism-js
                    style="font-size: 16px; overflow: scroll; width: 100%;" :copy-icon="false" :copy-button="false"
                    :copy-tab="false" :tabs="false" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        If you have a condition like <code>(hour > 6 && hour < 12)</code>, you have two Boolean expressions.
                        The possible combinations with True and False: True + True, True + False, False + True, False + False, where only the first is True.
                        We need test cases where each expression is <em>determinant</em> - it changes the outcome. <br style="margin-bottom: 5px;"/>
                        As only one combination yields True (True + True), it must be included.
                        Then, for False + True, <code>hour > 6</code> is determinant, because it being False makes the outcome False.
                        Similar reasons for True + False and the <code>hour < 12</code> expression.
                        So, you need the 3 discriminated test cases to achieve 100% MCDC.
                    </p>
                    </div>
                </div>
            </div>


        </div>
        <div v-if="tab == 'teacher_view'" style="font-size: 13px !important; justify-content: center;">
            <div class="row" style="display: grid; grid-template-columns: 0.5fr 2fr;">
                <div class="col" style="width: 1/3%; font-size: 16px;">
                    <button id="teacher-view-button-1" @click="changeTeacherView('challenge_content_creator', 1)" class="button is-primary is-fullwidth guide-button-selected" style="width: 100%;">Challenge Content Creator</button>
                    <button id="teacher-view-button-2" @click="changeTeacherView('challenge_manager', 2)" class="button is-primary is-fullwidth" style="width: 100%;">Challenge Manager</button>
                    <button id="teacher-view-button-3" @click="changeTeacherView('leaderboard', 3)" class="button is-primary is-fullwidth" style="width: 100%;">Leaderboard</button>
                    <button id="teacher-view-button-4" @click="changeTeacherView('validating_admins', 4)" class="button is-primary is-fullwidth" style="width: 100%;">Validating Administrators</button>
                </div>
                <div class="col" style="width: calc(2/3% + 10px); font-size: 16px;">
                    <div v-if="teacher_view == 'challenge_content_creator'" style="overflow: scroll; scrollbar-width: none;">
                        <h6>Challenge Content Creator</h6>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        To make a challenge, you need both an initial state and a code file to associate to it. These, of course, affect how the challenge is played and what must be done to pass it.
                    </p>
                    <img src="../assets/pictures/challenge_content_creator_1.png" style="width: 50%;" />
                    <img src="../assets/pictures/challenge_content_creator_2.png" style="width: 50%;" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        The left tab allows to create new initial board states - these define how a board is initialized when a player starts a challenge. <br style="margin-bottom: 5px;"/>
                        The board functions like it does in the challenge. Check the <strong>Board</strong> tab for a refresher! 
                        Know you can also select an existing board state to adapt to your needs, if you so wish.
                    </p>
                    <p style="text-align: justify; margin-bottom: 10px;">
                        The right tab allows one to create a new Code File to associate to challenges.
                        Just input your code on the right and give it a name - it really is that simple. <br style="margin-bottom: 5px;"/>
                        Make sure it looks good with the left code block, though!
                    </p>
                    </div>
                    <div v-if="teacher_view == 'challenge_manager'" style="height: 550px; overflow: overlay; scrollbar-width: none;">
                        <h6>Challenge Manager <span class="badge badge-primary" style="background-color: rgb(169, 89, 255); margin-bottom: 0px;">SCROLLABLE!</span></h6> 
                    <p style="text-align: justify; margin-bottom: 10px;">
                        You can edit or create new challenges with this page.
                    </p>
                    <img src="../assets/pictures/challenge_manager.png" style="width: 50%;" />
                    <img src="../assets/pictures/challenge_manager_2.png" style="width: 50%;" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                        The first thing to do is select the initial board state and code file to associate to the challenge (left picture). <br style="margin-bottom: 5px;"/>
                        Then, you can set the challenge's name, hint, objective, score, code coverage, and difficulty (right picture). Beware of the <em>Condition Count</em> attribute, which is used to generate the condition table in condition, condition/decision, and MCDC challenges.
                    </p>
                    <img src="../assets/pictures/challenge_manager_3.png" style="width: 50%;" />
                    <img src="../assets/pictures/challenge_manager_4.png" style="width: 50%;" />
                    <p style="text-align: justify; margin-bottom: 10px; margin-top: 10px;">
                        Then, you are greeted to a few purple callouts (left picture). These explain how to write expressions for a challenge. These expressions are what determines if a submitted attempt passes a challenge or not. <br style="margin-bottom: 5px;"/>
                        Two expression types exist: assertions and tests. Assertions are not required in any challenge, but they lend themselves to stronger restrictions <em>and</em> may be used as shortcuts in evaluation.
                        Simply put: <strong>if an assertion fails, it's guaranteed that the test(s) will fail</strong>. So write assertions that pass for all tests! <br style="margin-bottom: 5px;"/>
                        <strong>An example (right picture):</strong> in Challenge 1.1, at least one move is required to pass the challenge. So checking the number of moves is a good idea.

                    </p>
                    <img src="../assets/pictures/challenge_manager_5.png" style="width: 50%;" />
                    <img src="../assets/pictures/challenge_manager_6.png" style="width: 50%;" />
                    <p style="text-align: justify; margin-bottom: 10px; margin-top: 10px;">
                        To submit a new challenge, you must pass it first. <br style="margin-bottom: 5px;"/>
                        As a Teacher, however, it's possible to see exactly what expressions are failing (red) or passing (green), as seen above.
                    </p>
                    </div>
                    <div v-if="teacher_view == 'leaderboard'" style="height: 550px; overflow: overlay; scrollbar-width: none; display: flex; flex-direction: column; justify-content: center; align-content: center;">
                        <h6>Leaderboard</h6> 
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Here, you can check how players are doing.
                    </p>
                    <img src="../assets/pictures/leaderboard.png" style="width: 75%;" />
                    <p style="text-align: justify; margin-bottom: 10px;">
                       This version of the leaderboard does not hide any statistic stored on the database. <br style="margin-bottom: 5px;"/>
                       Teacher users are also included in the Leaderboard, because you guys deserve fun too! <br style="margin-bottom: 5px;"/>
                       That is it!
                    </p>
                    </div>
                    <div v-if="teacher_view == 'validating_admins'" style="height: 550px; overflow: overlay; scrollbar-width: none; display: flex; flex-direction: column; justify-content: center; align-content: center;">
                        <h6>Validating Administrators</h6> 
                    <p style="text-align: justify; margin-bottom: 10px;">
                        Here, you can validate new administrators.
                    </p>
                    <div class="row" style="display: flex; justify-content: center; align-content: center;">

                        <img src="../assets/pictures/validate_admins.png" style="width: 75%;" />
                    </div>
                    <p style="text-align: justify; margin-bottom: 10px;">
                       Just click the <strong>Validate</strong> button and the user will be able to log in as an Administrator from then on. <br style="margin-bottom: 5px;"/>
                       That is it!
                    </p>
                    </div>
                </div>
            </div>


        </div>
        <div v-if="tab == 'multiplayer'" style="font-size: 13px !important; justify-content: center;">
            <div class="row" style="display: grid; grid-template-columns: 1fr 0.75fr; font-size: 16px;">
                <div class="col">

               
                <p style="text-align: justify; margin-bottom: 10px;">
                    The Multiplayer mode is very similar to the single player mode. It just adds a few rules.
                </p>

                <strong>Multiplayer Rooms</strong>
                <p style="text-align: justify; margin-bottom: 10px;">
                    A multiplayer game can only happen in a multiplayer room. They are pretty easy to create.
                    You can have up to 5 rounds, with 2 or 3 players.
                </p>

                <p style="text-align: justify; margin-bottom: 10px;">
                    Note that, if you create a room, you can't "leave" it, only delete it!
                </p>


                <strong style="margin-bottom: 2.5px;">The Rules</strong>
                <ul style="margin-left: 2.5px; margin-top: 0px; text-align: justify;">
                        <li>After all players are in the room, the game starts.</li>
                        <li>The first player is chosen randomly - after this, players are cycled through!</li>
                        <li>Each turn has a randomly chosen challenge - any challenge the players have not passed can show up!</li>
                        <li>You must beat your challenge within the provided time.</li>
                        <li>You can pass your turn once per challenge. If it reaches you again, you will be able to skip the challenge.</li>
                        <li>Unlike single player mode, you first validate your solution and then submit it with a comment!</li>
                        <li>You are able to see the challenge another player is given, but you cannot submit an attempt!</li>
                        <li>After a player successfully submits an attempt, you will be shown their submitted solution.</li>
                        <li>The player who scores the most points in the room wins (ties with 3 players are possible)!</li>
                </ul>
                

                <strong>Rewards</strong>
                <p style="text-align: justify; margin-bottom: 10px;">
                To encourage playing in this mode with other users, there are rewards given per multiplayer game.
                </p>
                <p style="text-align: justify; margin-bottom: 10px;">
                    Both the winner(s) AND participants are rewarded.
                </p>
                <p style="text-align: justify; margin-bottom: 10px;">
                    There are also a few special rewards out in the wild... Strive to ACHIEVE them.
                </p>
                </div>
                <div class="col">
                    <img src="../assets/pictures/multiplayer_rooms_1.png" style="width: 100%;" />
                    <img src="../assets/pictures/multiplayer_rooms_2.png" style="width: 100%;" />
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { boardStore } from '../store/boardStore.js'
import { auxiliaryFunctions, auxiliaryFunctionsNames } from '../assets/js/auxiliary_functions.js'
import { authStore } from '../store/authStore.js'
import Prism from 'prismjs'

export default defineComponent({
    beforeMount() {
        this.tab = 'board'
        this.code_coverage = 'statement'
        this.teacher_view = 'challenge_content_creator'
        this.board = boardStore()
        this.auth = authStore()
    },

    mounted() {
        this.selectedFunction = this.auxiliaryFunctionsNames[0]
    },

    data() {
        return {
            tab: String,
            code_coverage: String,
            teacher_view: String,
            selectedFunction: String,
            board: null,
            auxiliaryFunctions: auxiliaryFunctions,
            auxiliaryFunctionsNames: auxiliaryFunctionsNames,
            statement_code: "function statement() {\n\tvar greeting;\n\n\tif (hour < 18) {\n\t\tgreeting = \"Good day\";\n\t} else {\n\t\tgreeting = \"Good evening\";\n\t}\n\n\treturn greeting\n}",
            condition_code: "function condition() {\n\tvar greeting;\n\n\tif (hour > 6 && hour < 12) {\n\t\tgreeting = \"Good morning\";\n\t} else if (hour > 12 && hour < 19) {\n\t\tgreeting = \"Good afternoon\";\n\t} else {\n\t\tgreeting = \"Good day\";\n\t}\n\n\treturn greeting\n}",
        }
    },

    props: {
        placeholder: String
    },

    methods: {
        changeTab(value, button) {
            var button_1 = document.getElementById('guide-button-1'),
                button_2 = document.getElementById('guide-button-2'),
                button_3 = document.getElementById('guide-button-3'),
                button_4 = document.getElementById('guide-button-4'),
                button_5 = document.getElementById('guide-button-5')

            if (value == 'code_coverage')
                button_3.classList.toggle('guide-button-selected')
            else if (value == 'board')
                button_1.classList.toggle('guide-button-selected')
            else if (value == 'auxiliary_functions')
                button_2.classList.toggle('guide-button-selected')
            else if (value == 'teacher_view')
                button_4.classList.toggle('guide-button-selected')
            else if (value == 'multiplayer')
                button_5.classList.toggle('guide-button-selected')

            if (this.tab == 'code_coverage') {
                button_3.classList.toggle('guide-button-selected')
            } else if (this.tab == 'board') {
                button_1.classList.toggle('guide-button-selected')
            } else if (this.tab == 'auxiliary_functions') {
                button_2.classList.toggle('guide-button-selected')
            } else if (this.tab == 'teacher_view') {
                button_4.classList.toggle('guide-button-selected')
            } else if (this.tab == 'multiplayer') {
                button_5.classList.toggle('guide-button-selected')
            }

            this.tab = value
            Prism.highlightAll()
        },

        changeCodeCoverage(value, button) {
            if (this.code_coverage == 'statement') {
                document.getElementById('code-coverage-button-1').classList.toggle('guide-button-selected')
            } else if (this.code_coverage == 'decision') {
                document.getElementById('code-coverage-button-2').classList.toggle('guide-button-selected')
            } else if (this.code_coverage == 'condition') {
                document.getElementById('code-coverage-button-3').classList.toggle('guide-button-selected')
            } else if (this.code_coverage == 'condition/decision') {
                document.getElementById('code-coverage-button-4').classList.toggle('guide-button-selected')
            } else if (this.code_coverage == 'mcdc') {
                document.getElementById('code-coverage-button-5').classList.toggle('guide-button-selected')
            }

            if (value == 'statement') {
                document.getElementById('code-coverage-button-1').classList.toggle('guide-button-selected')
            } else if (value == 'decision') {
                document.getElementById('code-coverage-button-2').classList.toggle('guide-button-selected')
            } else if (value == 'condition') {
                document.getElementById('code-coverage-button-3').classList.toggle('guide-button-selected')
            } else if (value == 'condition/decision') {
                document.getElementById('code-coverage-button-4').classList.toggle('guide-button-selected')
            } else if (value == 'mcdc') {
                document.getElementById('code-coverage-button-5').classList.toggle('guide-button-selected')
            }

            this.code_coverage = value
            Prism.highlightAll()
        },

        changeTeacherView(value, button) {
            if (this.teacher_view == 'challenge_content_creator') {
                document.getElementById('teacher-view-button-1').classList.toggle('guide-button-selected')
            } else if (this.teacher_view == 'challenge_manager') {
                document.getElementById('teacher-view-button-2').classList.toggle('guide-button-selected')
            } else if (this.teacher_view == 'leaderboard') {
                document.getElementById('teacher-view-button-3').classList.toggle('guide-button-selected')
            } else if (this.teacher_view == 'validating_admins') {
                document.getElementById('teacher-view-button-4').classList.toggle('guide-button-selected')
            }

            if (value == 'challenge_content_creator') {
                document.getElementById('teacher-view-button-1').classList.toggle('guide-button-selected')
            } else if (value == 'challenge_manager') {
                document.getElementById('teacher-view-button-2').classList.toggle('guide-button-selected')
            } else if (value == 'leaderboard') {
                document.getElementById('teacher-view-button-3').classList.toggle('guide-button-selected')
            } else if (value == 'validating_admins') {
                document.getElementById('teacher-view-button-4').classList.toggle('guide-button-selected')
            }

            this.teacher_view = value
            Prism.highlightAll()
        },

        selectFunction(name) {
            this.selectedFunction = name
            Prism.highlightAll()
        },

        archive() {
            //this.$refs.close.click()
        }
    }
})
</script>