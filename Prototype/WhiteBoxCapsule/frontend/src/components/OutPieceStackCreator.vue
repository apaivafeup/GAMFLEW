<template>
  <div class="col creator-overlap" v-if="board.outOfBoundsState[board.currentKey].pieceCount() > 1"
    @click="board.selectPiece(x, y)">
    <div class="overlap-box creator">
      <div class="square square-lg piece-creator small-creator red" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece-creator small-creator selected" v-else></div>
    </div>
    <div class="overlap-box creator">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box creator">
      <div class="square square-lg piece-creator small-creator blue" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece-creator small-creator selected" v-else></div>
    </div>
    <div class="overlap-box creator">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece-creator selected" v-else-if="board.outOfBoundsState[board.currentKey].selected"
    @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-creator red" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
    board.outOfBoundsState[board.currentKey].stack.red != 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-creator blue" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue != 0 &&
    board.outOfBoundsState[board.currentKey].stack.red == 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-creator empty" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
    board.outOfBoundsState[board.currentKey].stack.red == 0
    " @click.stop="board.selectPiece(x, y)"></div>
</template>

<script>
import { boardStore } from '../store/boardStore.js'
import { boardCreatorStore } from '../store/boardCreator.js'

export default {
  components: {},

  props: {
    creator: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      board: null,
      x: -1,
      y: -1
    }
  },

  beforeMount() {
      this.board = boardCreatorStore()
  },

  mounted() {
    document.getElementById('piece-stack-out-x').onchange = () => {
      this.x = document.getElementById('piece-stack-out-x').value
      this.board.outCoords.x = this.x
    }

    document.getElementById('piece-stack-out-y').onchange = () => {
      this.y = document.getElementById('piece-stack-out-y').value
      this.board.outCoords.y = this.y
    }
  },

  methods: {

  }
}
</script>
