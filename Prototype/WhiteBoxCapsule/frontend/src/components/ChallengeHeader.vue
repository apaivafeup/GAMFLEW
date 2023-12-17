<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">
        <strong>{{ name.split(':')[0] + ':' }}</strong
        ><em>{{ name.split(':')[1] }}</em>
      </div>
      <div class="col timer" v-if="this.board.timer > 100 && !this.board.pause">
        {{ this.board.timer }}
      </div>
      <div class="col timer timer-paused" v-else-if="this.board.pause">
        {{ this.board.timer }}
      </div>
      <div class="col timer timer-hurry" v-else-if="this.board.timer <= 100 && !this.board.pause">
        {{ this.board.timer }}
      </div>
    </div>
  </header>
</template>

<script>
import { boardStore } from '../store/boardStore'

export default {
  props: {
    name: String,
    timer: Number
  },

  beforeMount() {
    this.board = boardStore()
  },

  methods: {}
}
</script>

<style scoped></style>
