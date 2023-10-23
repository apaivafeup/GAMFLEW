<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  },
  timer: Number,
  title: String
})
</script>

<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">Challenge 1</div>
      <div class="col" v-if="this.board.timer > 100" id="challenge-timer">{{ this.board.timer }}</div>
      <div class="col" v-else id="challenge-timer-hurry">{{ this.board.timer }}</div>
    </div>
  </header>
</template>

<script>
import { bluePos, redPos, boardStore } from '../store/boardStore'

export default {
  data() {
    return {}
  },

  beforeMount() {
    this.board = boardStore()

    setInterval(() => {
      this.board.timer--;
    }, 1000)
  },

  methods: {},
}
</script>

<style scoped></style>
