<template>
  <div class="col checker-overlap" v-if="board.outOfBoundsState[board.currentKey].pieceCount() > 1"
    @click="board.selectPiece(x, y)">
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker red" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker blue" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece-checker selected" v-else-if="board.outOfBoundsState[board.currentKey].selected"
    @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-checker red" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
    board.outOfBoundsState[board.currentKey].stack.red != 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-checker blue" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue != 0 &&
    board.outOfBoundsState[board.currentKey].stack.red == 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece-checker empty" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
    board.outOfBoundsState[board.currentKey].stack.red == 0
    " @click.stop="board.selectPiece(x, y)"></div>
</template>

<script>
import { boardStore } from '../store/boardStore.js'
import { boardCreatorStore } from '../store/boardCreator.js'

export default {
  components: {},

  props: {
    checker: {
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
  },

  methods: {

  }
}
</script>
