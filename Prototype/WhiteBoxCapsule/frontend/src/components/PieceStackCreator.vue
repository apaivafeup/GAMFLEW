<template>
  <div
    class="col piece-overlap"
    v-if="this.board.state[this.board.currentKey][x][y].pieceCount() > 1"
    @click.stop="this.board.selectPiece(x, y)"
  >
    <div class="overlap-box">
      <div
        class="square square-lg piece-creator small red"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-creator small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div
        class="square square-lg piece-creator small blue"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-creator small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.blue }}
      </div>
    </div>
  </div>
  <div
    class="square square-lg piece-creator selected"
    v-else-if="this.board.state[this.board.currentKey][x][y].selected"
    @click.stop="this.board.selectPiece(x, y)"
  ></div>
  <div
    class="square square-lg piece-creator red"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red != 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  ></div>
  <div
    class="square square-lg piece-creator blue"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue != 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  ></div>
  <div
    class="square square-lg piece-creator empty"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  ></div>
</template>

<script>
import { boardCreatorStore } from '../store/boardCreator'

export default {
  components: {},
  props: {
    id: String,
    x: String,
    y: String
  },

  beforeMount() {
    this.board = boardCreatorStore()

    this.posString = '(' + this.x + ', ' + this.y + ')'
  },

  mounted() {},

  methods: {},

  watch: {}
}
</script>
