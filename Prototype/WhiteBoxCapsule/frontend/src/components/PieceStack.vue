<template>
  <div v-if="x == -1 && y == -1">
    <div
      class="col piece-overlap"
      v-if="this.board.outOfBoundsState[this.board.currentKey].pieceCount() > 1"
      @click.stop="this.board.selectPiece(x, y)"
    >
      <div class="overlap-box">
        <div
          class="square square-lg piece small red"
          v-if="!this.board.outOfBoundsState[this.board.currentKey].selected"
        ></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ this.board.outOfBoundsState[this.board.currentKey].stack.red }}
        </div>
      </div>
      <div class="overlap-box">
        <div
          class="square square-lg piece small blue"
          v-if="!this.board.outOfBoundsState[this.board.currentKey].selected"
        ></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ this.board.outOfBoundsState[this.board.currentKey].stack.blue }}
        </div>
      </div>
    </div>
    <div
      class="square square-lg piece selected"
      v-else-if="this.board.outOfBoundsState[this.board.currentKey].selected"
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece red"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red != 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece blue"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue != 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece empty"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
  </div>
  <div v-else>
    <div
      class="col piece-overlap"
      v-if="this.board.state[this.board.currentKey][x][y].pieceCount() > 1"
      @click.stop="this.board.selectPiece(x, y)"
    >
      <div class="overlap-box">
        <div
          class="square square-lg piece small red"
          v-if="!this.board.state[this.board.currentKey][x][y].selected"
        ></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ this.board.state[this.board.currentKey][x][y].stack.red }}
        </div>
      </div>
      <div class="overlap-box">
        <div
          class="square square-lg piece small blue"
          v-if="!this.board.state[this.board.currentKey][x][y].selected"
        ></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ this.board.state[this.board.currentKey][x][y].stack.blue }}
        </div>
      </div>
    </div>
    <div
      class="square square-lg piece selected"
      v-else-if="this.board.state[this.board.currentKey][x][y].selected"
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece red"
      v-else-if="
        this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
        this.board.state[this.board.currentKey][x][y].stack.red != 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece blue"
      v-else-if="
        this.board.state[this.board.currentKey][x][y].stack.blue != 0 &&
        this.board.state[this.board.currentKey][x][y].stack.red == 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
    <div
      class="square square-lg piece empty"
      v-else-if="
        this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
        this.board.state[this.board.currentKey][x][y].stack.red == 0
      "
      @click.stop="this.board.selectPiece(x, y)"
    ></div>
  </div>
</template>

<script>
import { boardStore } from '../store/boardStore'

export default {
  components: {},
  props: {
    id: String,
    x: String,
    y: String
  },

  beforeMount() {
    this.board = boardStore()
    this.posString = '(' + this.x + ', ' + this.y + ')'
  },

  mounted() {},

  methods: {
    select() {}
  }

  // watch: {
  //   board: {
  //     handler: function () {
  //       this.$forceUpdate()
  //     },
  //     deep: true
  //   }
  // }
}
</script>
