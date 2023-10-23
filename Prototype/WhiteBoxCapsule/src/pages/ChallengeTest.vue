<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'
</script>

<template>
  <ChallengeHeader :timer="this.board.timer" />

  <Board :code="code" />
</template>

<script>
export default {
  components: {},
  props: {
    timer: Number,
    code: String
  },

  beforeMount() {
    this.board = boardStore()
    this.board.timer = this.timer
  },
  mounted() { },

  methods: {},

  watch: {
    board: {
      handler: function () {
        this.$forceUpdate()
      },
      deep: true
    }
  }
}
</script>
