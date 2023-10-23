<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">{{ challenge.name }}</div>
      <div class="col" v-if="this.board.timer > 100" id="challenge-timer">{{ this.board.timer }}</div>
      <div class="col" v-else id="challenge-timer-hurry">{{ this.board.timer }}</div>
    </div>
  </header>
</template>

<script>
import { bluePos, redPos, boardStore } from '../store/boardStore'
import { Challenge } from '../store/models/challenge';

export default {
  props: {
    challenge: Challenge
  },

  beforeMount() {
    this.board = boardStore()
  },

  methods: {},
}
</script>

<style scoped></style>
