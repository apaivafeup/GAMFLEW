<template>
  <div class="col piece-overlap" v-if="this.board.state[x][y].stack.red != 0 && this.board.state[x][y].stack.blue != 0" @click.stop="select">
    <div class="overlap-box">
      <div class="square square-lg piece small red"></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[x][y].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue"></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.state[x][y].stack.blue }}
      </div>
    </div>
  </div>
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
    this.board.generateState()
  },

  mounted() {
  },

  methods: {
    select() {
      this.board.selectPiece(this.$props.x, this.$props.y)
    }
  },

  watch: {
    board: {
      handler: function() {
        this.board = boardStore()
      },
      deep: true
    }
  }
}
</script>
