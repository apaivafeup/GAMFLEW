<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import SubmitModal from '../components/modals/SubmitModal.vue'
import FailModal from '../components/modals/FailModal.vue'
import { boardStore } from '../store/boardStore'
import axios from 'axios'
import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { Attempt } from '../store/models/attempt.js'
import { CodeFile } from '../store/models/code_file.js'
import Prism from 'prismjs'
</script>

<template style="overflow: hidden">
  <ChallengeHeader :name="challenge.name" :timer="challenge.timer" />

  <Board :challenge="challenge" :code_file="code_file" :user="user" />

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
      code_file: CodeFile,
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
        response.data.id,
        response.data.name,
        response.data.description,
        response.data.difficulty,
        response.data.hint,
        response.data.objective,
        response.data.test_cases_count,
        response.data.timer_value,
        response.data.initial_board,
        response.data.code_file,
        response.data.challenge_type,
        response.data.passing_criteria,
        response.data.achievement_criteria,
        response.data.owner_id
      )
    })

    await axios.get('http://localhost:8000/users/' + user_id).then((response) => {
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

    await axios
      .get('http://localhost:8000/code-files/' + this.challenge.code_file)
      .then((response) => {
        this.code_file = new CodeFile(response.data.id, response.data.name, response.data.content)
      })

    this.board = boardStore()
    this.board.boardState = this.challenge.initial_board
    this.board.setState()

    this.board.attempt = new Attempt(user_id, this.id, this.challenge.timer_value, 0, 0, null, null)

    this.board.timer = this.challenge.timer_value

    document.getElementById('guide-button').click()
  },

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
