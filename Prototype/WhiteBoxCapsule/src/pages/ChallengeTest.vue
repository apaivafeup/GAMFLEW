<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'
import { testChallenge } from '../assets/challenges/test/testValues';
</script>

<template>
  <ChallengeHeader :challenge="testChallenge" />

  <Board :challenge="testChallenge"/>
</template>

<script>
export default {
  components: {},
  props: {
  },

  beforeMount() {
    this.board = boardStore()
    this.board.timer = testChallenge.timer

    setInterval(() => {
      this.board.timer--
    }, 1000)
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
