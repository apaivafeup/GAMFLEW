<template>
  <div
    class="col creator-overlap"
    v-if="this.board.state[this.board.currentKey][x][y].pieceCount() > 1"
    @click.stop="this.board.selectPiece(x, y)"
  >
    <div class="overlap-box creator">
      <div
        class="square square-lg piece-creator small-creator red"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-creator small-creator selected" v-else></div>
    </div>
    <div class="overlap-box creator">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box creator">
      <div
        class="square square-lg piece-creator small-creator blue"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-creator small-creator selected" v-else></div>
    </div>
    <div class="overlap-box creator">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.blue }}
      </div>
    </div>
  </div>
  <div
    class="square square-lg piece-creator selected"
    style="display: flex; justify-content: center; align-items: center; font-size: 20px;"
    v-else-if="this.board.state[this.board.currentKey][x][y].selected"
    @click.stop="this.board.selectPiece(x, y)"
  >
  <font-awesome-icon
  v-if="this.board.state[this.board.currentKey][x][y].king"
  icon="crown"
  fixed-width
  style="color: white; font-size: 28px;"
/>
</div>
  <div
    class="square square-lg piece-creator red"
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
  style="color: white; font-size: 28px;"
/>
</div>
  <div
    class="square square-lg piece-creator blue"
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
  style="color: white; font-size: 28px;"
/>
</div>
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
