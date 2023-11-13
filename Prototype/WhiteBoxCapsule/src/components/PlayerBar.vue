<template>
  <div class="row" style="padding: 15px;justify-content: right;">
    <div class="player-bar-box">
      <em>oh wow</em>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../store/models/challenge'
import { boardStore } from '../store/boardStore'

export default {
  components: {},
  props: {
    challenge: Challenge
  },

  beforeMount() {
    this.board = boardStore()
  }
}
</script>
