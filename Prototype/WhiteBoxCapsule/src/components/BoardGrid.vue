<script>
import BoardProgressBar from './BoardProgressBar.vue'

// JS
import PieceStack from './pieces/PieceStack.vue'

const redPos = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23]
const bluePos = [64, 62, 60, 58, 55, 53, 51, 49, 48, 46, 44, 42]

export default {
  data() {
    return {}
  },
  mounted() {
    this.generateBoard()
  },
  methods: {
    select(id) {
      console.log(id)
    },

    generateBoard() {
      var htmlBoard = document.getElementById('challenge-board')
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
