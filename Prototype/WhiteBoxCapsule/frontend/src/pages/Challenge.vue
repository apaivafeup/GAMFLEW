<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'
import axios from 'axios'
import { Challenge } from '../store/models/challenge'
import Prism from 'prismjs'
import { User } from '../store/models/user.js'
</script>

<template>
  <ChallengeHeader :name="challenge.name" :timer="challenge.timer" />

  <Board :challenge="challenge" :user="user" />


  <button type="button" data-bs-toggle="modal" data-bs-target="#submit-modal">Launch modal</button>

  <SubmitModal />
</template>

<script>
import SubmitModal from '../components/modals/SubmitModal.vue'

export default {
  components: { ChallengeHeader, Board, SubmitModal },

  props: {
    id: Number
  },

  data() {
    return {
      challenge: Challenge,
      user: User
    }
  },

  async beforeMount() {
    var user_id

    await axios.get('http://localhost:8000/challenges/' + this.id).then((response) => {
      user_id = response.data.owner_id

      this.challenge = new Challenge(
        response.data.name,
        response.data.count,
        response.data.timer,
        response.data.board,
        response.data.objective,
        response.data.hint,
        response.data.code_file,
        response.data.submit_function,
        response.data.owner_id
      )
    })

    axios.get('http://localhost:8000/users/' + user_id).then((response) => {
      this.user = new User(response.data.name, response.data.email, '../assets/pictures/avatar.png')
    })

    this.board = boardStore()
    this.board.timer = this.challenge.timer
    this.board.startTimer()
  },
  mounted() {},

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
