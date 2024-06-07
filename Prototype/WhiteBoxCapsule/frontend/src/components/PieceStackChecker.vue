<template>
  <div class="col checker-overlap" v-if="board.state[board.currentKey][x][y].pieceCount() > 1">
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker red"
        v-if="!board.state[board.currentKey][x][y].selected"></div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ board.state[board.currentKey][x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box checker">
      <div class="square square-lg piece-checker small-checker blue"
        v-if="!board.state[board.currentKey][x][y].selected"></div>
      <div class="square square-lg piece-checker small-checker selected" v-else></div>
    </div>
    <div class="overlap-box checker">
      <div>
        {{ board.state[board.currentKey][x][y].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece-checker red" v-else-if="board.state[board.currentKey][x][y].stack.blue == 0 &&
    board.state[board.currentKey][x][y].stack.red != 0
    "><font-awesome-icon v-if="board.state[board.currentKey][x][y].king" icon="crown" fixed-width
      style="color: white;" /></div>
  <div class="square square-lg piece-checker blue" v-else-if="board.state[board.currentKey][x][y].stack.blue != 0 &&
    board.state[board.currentKey][x][y].stack.red == 0
    "><font-awesome-icon v-if="board.state[board.currentKey][x][y].king" icon="crown" fixed-width
      style="color: white;" /></div>
  <div class="square square-lg piece-checker empty" v-else-if="board.state[board.currentKey][x][y].stack.blue == 0 &&
    board.state[board.currentKey][x][y].stack.red == 0
    "></div>
</template>

<script>
import { boardCreatorStore } from '../store/boardCreator.js'

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

  mounted() { },

  methods: {},

  watch: {}
}
</script>
