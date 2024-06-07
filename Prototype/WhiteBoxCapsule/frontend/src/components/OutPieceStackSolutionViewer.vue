<template>
  <div class="col piece-overlap" v-if="solution.outOfBoundsState[solution.currentKey].pieceCount() > 1">
    <div class="overlap-box">
      <div class="square square-lg piece small red" v-if="!solution.outOfBoundsState[solution.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ solution.outOfBoundsState[solution.currentKey].stack.red }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue" v-if="!solution.outOfBoundsState[solution.currentKey].selected">
      </div>
      <div class="square square-lg piece small selected" v-else></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ solution.outOfBoundsState[solution.currentKey].stack.blue }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece selected" v-else-if="solution.outOfBoundsState[solution.currentKey].selected"
    ></div>
  <div class="square square-lg piece red" v-else-if="solution.outOfBoundsState[solution.currentKey].stack.blue == 0 &&
    solution.outOfBoundsState[solution.currentKey].stack.red != 0
    " ></div>
  <div class="square square-lg piece blue" v-else-if="solution.outOfBoundsState[solution.currentKey].stack.blue != 0 &&
    solution.outOfBoundsState[solution.currentKey].stack.red == 0
    " ></div>
  <div class="square square-lg piece empty" v-else-if="solution.outOfBoundsState[solution.currentKey].stack.blue == 0 &&
    solution.outOfBoundsState[solution.currentKey].stack.red == 0
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
