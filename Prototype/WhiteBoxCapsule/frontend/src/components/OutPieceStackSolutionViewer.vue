<template>
  <div class="col piece-overlap" v-if="this.solution.outOfBoundsState[this.solution.currentKey].pieceCount() > 1">
    <div class="overlap-box">
      <div class="square square-lg piece small red" v-if="!this.solution.outOfBoundsState[this.solution.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.solution.outOfBoundsState[this.solution.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue" v-if="!this.solution.outOfBoundsState[this.solution.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ this.solution.outOfBoundsState[this.solution.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece selected" v-else-if="this.solution.outOfBoundsState[this.solution.currentKey].selected"
    ></div>
  <div class="square square-lg piece red" v-else-if="this.solution.outOfBoundsState[this.solution.currentKey].stack.blue == 0 &&
    this.solution.outOfBoundsState[this.solution.currentKey].stack.red != 0
    " ></div>
  <div class="square square-lg piece blue" v-else-if="this.solution.outOfBoundsState[this.solution.currentKey].stack.blue != 0 &&
    this.solution.outOfBoundsState[this.solution.currentKey].stack.red == 0
    " ></div>
  <div class="square square-lg piece empty" v-else-if="this.solution.outOfBoundsState[this.solution.currentKey].stack.blue == 0 &&
    this.solution.outOfBoundsState[this.solution.currentKey].stack.red == 0
    " ></div>
</template>

<script>
import { solutionViewer } from '../store/solutionViewer.js'

export default {
  components: {},

  props: {
    creator: {
      type: Boolean,
      default: false,
    },
    x: Number,
    y: Number
  },

  data() {
    return {
      solution: null
    }
  },

  beforeCreate() { },

  beforeMount() {
    this.solution = solutionViewer()
  },

  mounted() {
  },

  methods: {

  }
}
</script>
