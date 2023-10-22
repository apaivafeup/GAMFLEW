<template>
  <div
    class="col piece-overlap"
    v-if="this.board.state[x][y].pieceCount() > 1"
    @click.stop="select"
  >
    <div class="overlap-box">
      <div class="square square-lg piece small red" v-if="!this.board.state[x][y].selected"></div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue" v-if="!this.board.state[x][y].selected"></div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[x][y].stack.blue }}
      </div>
    </div>
  </div>
  <div
    class="square square-lg piece selected"
    v-else-if="this.board.state[x][y].selected"
    @click.stop="select"
  ></div>
  <div
    class="square square-lg piece red"
    v-else-if="this.board.state[x][y].stack.blue == 0 && this.board.state[x][y].stack.red != 0"
    @click.stop="select"
  ></div>
  <div
    class="square square-lg piece blue"
    v-else-if="this.board.state[x][y].stack.blue != 0 && this.board.state[x][y].stack.red == 0"
    @click.stop="select"
  ></div>
  <div
    class="square square-lg piece empty"
    v-else-if="this.board.state[x][y].stack.blue == 0 && this.board.state[x][y].stack.red == 0"
    @click.stop="select"
  ></div>
</template>

<script>
import { boardStore } from '../../store/boardStore'

export default {
  components: {},
  props: {
    id: String,
    x: String,
    y: String
  },

  beforeMount() {
    this.board = boardStore()
  },

  mounted() {},

  methods: {
    select() {
      var result = this.board.selectPiece(this.$props.x, this.$props.y)

      if (result) {
      }
    }
  },

  watch: {
    board: {
      handler: function () {
        this.$forceUpdate()
      },
      deep: true
    }
  }
}
</script>
