<script>
import PieceStack from './pieces/PieceStack.vue';
import BluePiece from './pieces/BluePiece.vue';
import RedPiece from './pieces/RedPiece.vue';
import BoardProgressBar from './BoardProgressBar.vue';

// JS
import {Board} from '../assets/js/board.js';
import App from '../App.vue';

export default {
    data() {
        return {
            board: Board,
        };
    },
    mounted() {
        this.generateBoard();
    },
    methods: {
        boxMaker(id) {
            var box = document.createElement("div");
            box.setAttribute("class", "box");
            box.setAttribute("id", "board-box-" + id);
            return box;
        },

        generateBoard() {
            var htmlBoard = document.getElementById("challenge-board");
            this.$data.board = new Board(htmlBoard);

            for (let i = 0; i <= 64; i++) {
                htmlBoard.appendChild(this.boxMaker(i));
            }

            for (let i = 0; i <= 24; i = i + 2) {
                var redChild = <RedPiece/>;
                document.getElementById("board-box-" + i).appendChild(redChild);
            }

            // for (let i = 40; i <= 64; i = i + 2) {
            //     document.getElementById("board-box-" + i).appendChild(BluePiece);
            // }
        }
    }
};
</script>

<template>
    <div style="display: flex">
        <div>
            <div class="game-board-out">
                <div class="box"></div>
            </div>
        </div>
        <div style="justify-content: center;">
            <div class="game-board" id="challenge-board" v-once="generateBoard">
            </div>
            <BoardProgressBar />
        </div>
    </div>
</template>