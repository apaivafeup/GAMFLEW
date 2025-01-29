<template>
        <div class="col">
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Board Log (<strong><em>board.log</em></strong>)</h6>
                <p style="margin: 2px; text-align: justify;">The <strong>board</strong> has a <strong>log</strong> of
                    interactions.</p>
                <p style="margin: 2px; text-align: justify;">For the most recent movement, use <strong>last_log</strong>
                    (<strong>last_</strong> followed by a variable name can be used for shortcuts).
                <ul style="margin-bottom: -15px;">
                    <li style="text-align: justify;"><strong>type</strong>: it's either "add" (a piece) or "move" (a
                        piece).
                    </li>
                    <ul>
                        <li style="text-align: justify;">For each <em>"add"</em>:</li>
                        <ul>
                            <li style="text-align: justify;"><strong>color</strong>: the color of the piece.</li>
                            <li style="text-align: justify;"><strong>destination</strong>: where the piece was added.
                            </li>
                        </ul>
                        <li>For each <em>"move"</em>:</li>
                        <ul style="margin-bottom: 0px;">
                            <li style="text-align: justify;"><strong>start</strong>: the initial position.</li>
                            <li style="text-align: justify;"><strong>destination</strong>: the final position.</li>
                        </ul>
                    </ul>
                </ul>
                </p>
            </div>
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Assertions vs. Tests</h6>
                <p style="margin: 0px; text-align: justify;">
                    Assertions are simple tests used for better performance. As such, they are tested <strong>before
                        each and every test</strong>.
                    <strong>If an assertion fails, the test fails</strong>, but <strong>if an assertion passes, the test
                        can still fail</strong>.
                </p>
            </div>
        </div>
        <div class="col">
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Board Pieces (<strong><em>board[I][J]</em></strong>)</h6>
                <p style="margin: 2px; text-align: justify;">Any piece of the 8x8 board can be accessed.</p>
                <p style="margin: 2px; text-align: justify;">
                    Each spot has:
                <ul style="margin-bottom: -15px;">
                    <li style="text-align: justify;"><strong>color</strong>: the color of the piece (string "empty",
                        "red",
                        "blue" or "stack").</li>
                    <li style="text-align: justify;"><strong>position</strong>: separated into <strong>x</strong> and
                        <strong>y</strong> (integers).
                    </li>
                    <li style="text-align: justify;"><strong>stack</strong>: separated into <strong>red</strong> and
                        <strong>blue</strong> (integers).
                    </li>
                    <li style="text-align: justify;"><strong>king</strong>: the piece is a King if true (boolean).</li>
                </ul>
                </p>
            </div>
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">JavaScript</h6>
                <ul>
                    <li>
                        <p style="margin: 2px; text-align: justify;"><em>&&</em> indicates the logical AND, <em>||</em>
                            the logical OR, and <em>!</em> the logical NOT.</p>
                    </li>
                    <li>
                        <p style="margin: 2px; text-align: justify;">You can use all matter of functions and methods
                            allowed by JavaScript (i.e.: .length, for example)</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col" style="display: grid; grid-template-rows: 29% 42% 29%; grid-template-column: 100%;">
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Out of Bounds Spot (<strong><em>board.out</em></strong>)
                </h6>
                <p style="margin: 2px; text-align: justify;">Treat it like any other piece, but <em>position is
                        unbounded</em>.</p>
            </div>
            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Special Functions</h6>
                <p style="margin: 2px; text-align: justify;">Check how to play if needed:
                    <strong>count_empty_spaces</strong>,
                    <strong>count_red_pieces</strong>, <strong>count_blue_pieces</strong>, <strong>get_pieces</strong>,
                    <strong>find_stacks</strong>, <strong>find_red_pieces</strong>, <strong>find_blue_pieces</strong>,
                    <strong>find_first_blue_piece</strong>, <strong>find_first_red_piece</strong>,
                    <strong>find_first_stack</strong>, <strong>distance(pos1, pos2)</strong>. <br />
                    Beware what each function returns!
                </p>
            </div>

            <div class="alert alert-special" style="display: flex; flex-direction: column; font-size: 12px;">
                <h6 style="margin: 2px; text-align: justify;">Submitting A New Challenge
                </h6>
                <p style="margin: 2px; text-align: justify;">One needs to pass the challenge before submitting it. It is recommended that assertions be included, but not mandatory.</p>
            </div>
            
        </div>
</template>

<script>
export default {
    name: 'ChallengeCreatorInfo',
}
</script>