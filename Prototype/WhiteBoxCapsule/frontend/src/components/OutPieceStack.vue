<template>
  <div class="col piece-overlap" v-if="this.board.outOfBoundsState[this.board.currentKey].pieceCount() > 1"
    @click.stop="this.board.selectPiece(this.x, this.y)">
    <div class="overlap-box">
      <div class="square square-lg piece small red" v-if="!this.board.outOfBoundsState[this.board.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.outOfBoundsState[this.board.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue" v-if="!this.board.outOfBoundsState[this.board.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.board.outOfBoundsState[this.board.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece selected" v-else-if="this.board.outOfBoundsState[this.board.currentKey].selected"
    @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece red" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red != 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece blue" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue != 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
  <div class="square square-lg piece empty" v-else-if="this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
    this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
    " @click.stop="this.board.selectPiece(this.x, this.y)"></div>
</template>

<script>
import { boardStore } from '../store/boardStore'
import { boardCreatorStore } from '../store/boardCreator'

export default {
  components: {},

  props: {
    creator: {
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

  beforeCreate() { },

  beforeMount() {
    if (this.creator) {
      this.board = boardCreatorStore()
    } else {
      this.board = boardStore()
    }
  },

  mounted() {
    document.getElementById('piece-stack-out-x').onchange = () => {
      this.x = document.getElementById('piece-stack-out-x').value
      this.board.outCoords.x = this.x
    }

    document.getElementById('piece-stack-out-y').onchange = () => {
      this.y = document.getElementById('piece-stack-out-y').value
      this.board.outCoords.y = this.y
    }
  },

  methods: {

  }
}
</script>
