<template>
  <div v-if="solution.state[solution.currentKey] != undefined">
    <div class="col piece-overlap"
      v-if="(solution.state[solution.currentKey] == undefined ? [].length :
      solution.state[solution.currentKey][x][y].pieceCount()) > 1"
      >
      <div class="overlap-box">
        <div class="square square-lg piece small red"
          v-if="!solution.state[solution.currentKey][x][y].selected"></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ solution.state[solution.currentKey][x][y].stack.red }}
        </div>
      </div>
      <div class="overlap-box">
        <div class="square square-lg piece small blue"
          v-if="!solution.state[solution.currentKey][x][y].selected"></div>
        <div class="square square-lg piece small selected" v-else></div>
      </div>
      <div class="overlap-box">
        <div>
          {{ solution.state[solution.currentKey][x][y].stack.blue }}
        </div>
      </div>
    </div>
    <div class="square square-lg piece selected"
      style="display: flex; justify-content: center; align-items: center; font-size: 20px;"
      v-else-if="solution.state[solution.currentKey][x][y].selected">
      <font-awesome-icon v-if="solution.state[solution.currentKey][x][y].king" icon="crown" fixed-width
        style="color: white;" />
    </div>
    <div class="square square-lg piece red"
      style="display: flex; justify-content: center; align-items: center; font-size: 20px;" v-else-if="
      solution.state[solution.currentKey][x][y].stack.blue == 0 &&
      solution.state[solution.currentKey][x][y].stack.red != 0
    ">
      <font-awesome-icon v-if="solution.state[solution.currentKey][x][y].king" icon="crown" fixed-width
        style="color: white;" />
    </div>
    <div class="square square-lg piece blue"
      style="display: flex; justify-content: center; align-items: center; font-size: 20px;" v-else-if="
      solution.state[solution.currentKey][x][y].stack.blue != 0 &&
      solution.state[solution.currentKey][x][y].stack.red == 0
    ">
      <font-awesome-icon v-if="solution.state[solution.currentKey][x][y].king" icon="crown" fixed-width
        style="color: white;" />
    </div>
  </div>
  <div class="square square-lg piece empty" v-else></div>
</template>

<script>
import { solutionViewer } from '../store/solutionViewer.js'

export default {
  components: {},
  props: {
    id: String,
    x: String,
    y: String
  },

  beforeMount() {
    this.solution = solutionViewer()

    this.posString = '(' + this.x + ', ' + this.y + ')'
  },

  mounted() { },

  methods: {},

  watch: {}
}
</script>
