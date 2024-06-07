<template>
  <div class="col piece-overlap" v-if="board.outOfBoundsState[board.currentKey].pieceCount() > 1"
    @click.stop="board.selectPiece(x, y)">
    <div class="overlap-box">
      <div class="square square-lg piece small red" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue" v-if="!board.outOfBoundsState[board.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ board.outOfBoundsState[board.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece selected" v-else-if="board.outOfBoundsState[board.currentKey].selected"
    @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece red" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
    board.outOfBoundsState[board.currentKey].stack.red != 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece blue" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue != 0 &&
    board.outOfBoundsState[board.currentKey].stack.red == 0
    " @click.stop="board.selectPiece(x, y)"></div>
  <div class="square square-lg piece empty" v-else-if="board.outOfBoundsState[board.currentKey].stack.blue == 0 &&
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
      default: false,
    },
    x: Number,
    y: Number
  },

  data() {
    return {
      board: null
    }
  },

  beforeCreate() { },

  beforeMount() {
    this.board = boardStore()
  },

  mounted() {
  },

  methods: {

  }
}
</script>
