<template>
  <div class="col checker-overlap" v-if="this.board.outOfBoundsState[this.board.currentKey].pieceCount() > 1"
    @click="this.board.selectPiece(this.x, this.y)">
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker red" v-if="!this.board.outOfBoundsState[this.board.currentKey].selected">
      </div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ this.board.outOfBoundsState[this.board.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker blue" v-if="!this.board.outOfBoundsState[this.board.currentKey].selected">
      </div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ this.board.outOfBoundsState[this.board.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece-checker selected" v-else-if="this.board.outOfBoundsState[this.board.currentKey].selected"
    @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece-checker red" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red != 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece-checker blue" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue != 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece-checker empty" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
</template>

<script>
import { boardStore } from '../store/boardStore'
import { boardCreatorStore } from '../store/boardCreator'

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
