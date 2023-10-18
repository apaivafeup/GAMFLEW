<script>
import BoardProgressBar from './BoardProgressBar.vue'

// JS
import PieceStack from './pieces/PieceStack.vue'
import { bluePos, redPos, boardStore } from '../store/boardStore'


export default {
  data() {
    return {}
  },
  mounted() {
    this.board = boardStore();
    console.log(this.board);
    this.board.generateState();
    console.log(this.board.state);
  },
  methods: {
    select(id) {
      console.log(id)
    },

    getRedCount(index) {
      if (redPos.includes(index)) {
        return 1
      }
      return 0
    },

    getBlueCount(index) {
      if (bluePos.includes(index)) {
        return 1
      }
      return 0
    }
  },
  components: { PieceStack }
}
</script>

<template>
  <div style="display: flex">
    <div>
      <div class="game-board-out">
        <div class="box">
          <PieceStack :id="piece - stack - out" :redCount="0" :blueCount="0" />
        </div>
      </div>
    </div>
    <div style="justify-content: center">
      <div class="game-board" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + index">
          <PieceStack
            :id="'piece-stack-' + index"
            :redCount="getRedCount(index)"
            :blueCount="getBlueCount(index)"
          />
        </div>
      </div>
      <BoardProgressBar />
    </div>
  </div>
</template>
