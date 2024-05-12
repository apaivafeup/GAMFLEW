<template>
  <div class="alert alert-info player-info" v-if="this.board.infoState[this.board.currentKey] != undefined && this.board.infoState[this.board.currentKey].length != 0" style="min-height: 100%; max-height: 100%; overflow-y: scroll; display: flex; flex-direction: column;">
    <em style="font-size: 10px;" v-for="interaction in this.board.infoState[this.board.currentKey]">{{ interaction }}</em>
  </div>
</template>

<script setup>
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
</script>

<script>
import { Challenge } from '../store/models/challenge.js'
import { boardStore } from '../store/boardStore.js'

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
