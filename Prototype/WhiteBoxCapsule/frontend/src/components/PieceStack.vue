<template>
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
    style="display: flex; justify-content: center; align-items: center; font-size: 20px;"
    v-else-if="this.board.state[this.board.currentKey][x][y].selected"
    @click.stop="this.board.selectPiece(x, y)"
  >
  <font-awesome-icon
  v-if="this.board.state[this.board.currentKey][x][y].king"
  icon="crown"
  fixed-width
  style="color: white;"
/>
</div>
  <div
    class="square square-lg piece red"
    style="display: flex; justify-content: center; align-items: center; font-size: 20px;"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red != 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  >
  <font-awesome-icon
  v-if="this.board.state[this.board.currentKey][x][y].king"
  icon="crown"
  fixed-width
  style="color: white;"
/>
</div>
  <div
    class="square square-lg piece blue"
    style="display: flex; justify-content: center; align-items: center; font-size: 20px;"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue != 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  >
  <font-awesome-icon
  v-if="this.board.state[this.board.currentKey][x][y].king"
  icon="crown"
  fixed-width
  style="color: white;"
/>
</div>
  <div
    class="square square-lg piece empty"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
    @click.stop="this.board.selectPiece(x, y)"
  ></div>
</template>

<script>
import { boardStore } from '../store/boardStore.js'

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

  methods: {},

  watch: {}
}
</script>
