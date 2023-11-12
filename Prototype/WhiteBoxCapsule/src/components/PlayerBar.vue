<template>
  <div class="alert alert-info player-info">
    <em>Fuck!</em>
  </div>
</template>

<script setup>
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
</script>

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
