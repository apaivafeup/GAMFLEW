<template>
    <div
      class="col piece-overlap"
      v-if="this.board.outOfBoundsState[this.board.currentKey].pieceCount() > 1"
      @click.stop="this.board.selectPiece(this.getOutXCoordinate(), this.getOutYCoordinate())"
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
      @click.stop="this.board.selectPiece(this.getOutXCoordinate(), this.getOutYCoordinate())"
    ></div>
    <div
      class="square square-lg piece red"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red != 0
      "
      @click.stop="this.board.selectPiece(this.getOutXCoordinate(), this.getOutYCoordinate())"
    ></div>
    <div
      class="square square-lg piece blue"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue != 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
      "
      @click.stop="this.board.selectPiece(this.getOutXCoordinate(), this.getOutYCoordinate())"
    ></div>
    <div
      class="square square-lg piece empty"
      v-else-if="
        this.board.outOfBoundsState[this.board.currentKey].stack.blue == 0 &&
        this.board.outOfBoundsState[this.board.currentKey].stack.red == 0
      "
      @click.stop="this.board.selectPiece(this.getOutXCoordinate(), this.getOutYCoordinate())"
    ></div>
</template>

<script>
import { boardStore } from '../store/boardStore'

export default {
  components: {},

  data() {
    return {
      board: null,
      x: -1,
      y: -1
    }
  },

  beforeCreate() {
    console.log("I'm in piece stack out.")
  },

  beforeMount() {
    this.board = boardStore()

    console.log("I'm in piece stack out.")
  },

  mounted() {
    console.log("I'm in piece stack out.")
    // document.getElementById('piece-stack-out-x').addEventListener('input', () => {
    //   this.x = this.getOutXCoordinate()
    // })

    // document.getElementById('piece-stack-out-y').addEventListener('input', () => {
    //   this.y = this.getOutYCoordinate()
    // })
  },

  methods: {
    getOutXCoordinate() {
      if (document.getElementById('piece-stack-out-x') == null) return -1
      return document.getElementById('piece-stack-out-x').value == ''
        ? -1
        : document.getElementById('piece-stack-out-x').value
    },

    getOutYCoordinate() {
      if (document.getElementById('piece-stack-out-y') == null) return -1
      return document.getElementById('piece-stack-out-y').value == ''
        ? -1
        : document.getElementById('piece-stack-out-y').value
    }
  }
}
</script>
