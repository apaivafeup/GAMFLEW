<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'
import axios from 'axios'
import { Challenge } from '../store/models/challenge'
import Prism from 'prismjs'
import { User } from '../store/models/user.js'
import { Attempt } from '../store/models/attempt.js'
import SubmitModal from '../components/modals/SubmitModal.vue'
import FailModal from '../components/modals/FailModal.vue'
</script>

<template>
  <ChallengeHeader :name="challenge.name" :timer="challenge.timer" />

  <Board :challenge="challenge" :user="user" />

  <SubmitModal :placeholder="submit_placeholder" />
  <FailModal :placeholder="fail_placeholder" />
</template>

<script>
export default {
  components: { ChallengeHeader, Board, SubmitModal, FailModal },

  props: {
    id: Number
  },

  data() {
    return {
      challenge: Challenge,
      user: User,
      submit_placeholder:
        "Don't know what to write? Answer these: What was the specific objective to hit, beyond the target line? How did you hit it?",
      fail_placeholder:
        'Writing what you tried shows that it was an honest attempt! Can you identify the objective to hit, beyond the target line?'
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
        response.data.passing_criteria,
        response.data.owner_id
      )
    })

    axios.get('http://localhost:8000/users/' + user_id).then((response) => {
      this.user = new User(
        response.data.name,
        response.data.email,
        '../assets/pictures/avatar.png',
        response.data.score,
        response.data.failed_attempts,
        response.data.successful_attempts,
        response.data.achievements
      )
    })

    this.board = boardStore()
    this.board.boardState = this.challenge.board
    this.board.setState()

    this.board.attempt = new Attempt(user_id, this.id, this.challenge.timer, 0, 0, null, null)

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
