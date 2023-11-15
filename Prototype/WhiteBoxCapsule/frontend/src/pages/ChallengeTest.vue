<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'
import axios from 'axios'
import { Challenge } from '../store/models/challenge'
import Prism from 'prismjs'
</script>

<template>
  <ChallengeHeader :name="challenge.name" :timer="challenge.timer" />

  <Board :challenge="challenge" />
</template>

<script>
export default {
  components: { ChallengeHeader, Board },

  props: {
    id: Number
  },

  data() {
    return {
      challenge: Challenge
    }
  },

  async beforeMount() {
    await axios.get('http://localhost:8000/challenges/' + this.id).then((response) => {
      console.log(response.data)

      this.challenge = new Challenge(
        response.data.name,
        response.data.count,
        response.data.timer,
        response.data.board,
        response.data.objective,
        response.data.hint,
        response.data.code_file,
        response.data.submit_function
      )
    })

    this.board = boardStore()
    this.board.timer = this.challenge.timer
    this.board.startTimer()
  },
  mounted() { },

  updated() {
    Prism.highlightAll()
  },

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
