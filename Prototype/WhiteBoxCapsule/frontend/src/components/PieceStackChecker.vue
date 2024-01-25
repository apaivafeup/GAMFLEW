<template>
  <div
    class="col checker-overlap"
    v-if="this.board.state[this.board.currentKey][x][y].pieceCount() > 1"
  >
    <div class="overlap-box checker">
      <div
        class="square square-lg piece-checker small-checker red"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box checker">
      <div
        class="square square-lg piece-checker small-checker blue"
        v-if="!this.board.state[this.board.currentKey][x][y].selected"
      ></div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ this.board.state[this.board.currentKey][x][y].stack.blue }}
      </div>
    </div>
  </div>
  <div
    class="square square-lg piece-checker selected"
    v-else-if="this.board.state[this.board.currentKey][x][y].selected"
  ></div>
  <div
    class="square square-lg piece-checker red"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red != 0
    "
  ></div>
  <div
    class="square square-lg piece-checker blue"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue != 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
  ></div>
  <div
    class="square square-lg piece-checker empty"
    v-else-if="
      this.board.state[this.board.currentKey][x][y].stack.blue == 0 &&
      this.board.state[this.board.currentKey][x][y].stack.red == 0
    "
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
