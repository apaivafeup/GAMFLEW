<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
// eslint-disable-next-line vue/multi-word-component-names
<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'

import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { Attempt } from '../store/models/attempt.js'
import { CodeFile } from '../store/models/code_file.js'
import { BoardState } from '../store/models/board_state.js'
import Prism from 'prismjs'
import { authStore } from '../store/authStore.js'

import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import CommentModal from '../components/modals/CommentModal.vue'
</script>

<template style="overflow: hidden">
  <ChallengeHeader :name="challenge.name" :timer="challenge.timer" :id="id" />
  <Board :challenge="challenge" :code_file="code_file" :user="auth.user" :beat_challenge="beat_challenge" />
  <CommentModal :placeholder="submit_placeholder" />
  <FailModal :placeholder="fail_placeholder" />
</template>

<script>
export default {
  components: { ChallengeHeader, Board },

  props: {
    id: Number
  },

  data() {
    return {
      code_file: CodeFile,
      challenge: Object,
      board_state: BoardState,
      beat_challenge: Boolean,
      submit_placeholder:
        "Don't know what to write? Answer these: What was the specific objective to hit, beyond the target line? How did you hit it?",
      fail_placeholder:
        'Writing what you tried shows that it was an honest attempt! Can you identify the objective to hit, beyond the target line?'
    }
  },

  async beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: h(resolveComponent('LoadingIcon'))
      });

    this.auth = authStore()
    this.auth.checkAuth()
    this.board = boardStore()
    this.board.emptyState(true)
    this.board.generateState()

    var user_id

    await this.$axios.get(this.$api_link + '/challenges/' + this.id, this.auth.config).then((response) => {
      user_id = response.data.owner_id

      this.challenge = new Challenge(
        response.data.id,
        response.data.name,
        response.data.difficulty,
        response.data.hint,
        response.data.objective,
        response.data.test_cases_count,
        response.data.score,
        response.data.initial_board,
        response.data.code_file,
        response.data.challenge_type,
        response.data.passing_criteria,
        response.data.achievement,
        response.data.achievement_hint,
        response.data.owner_id
      )
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
      this.$error = true
    })

    await this.$axios.get(this.$api_link + '/code-files/' + this.challenge.code_file, this.auth.config).then((response) => {
      this.code_file = new CodeFile(response.data.id, response.data.name, response.data.content)
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText } })
      this.$error = true
    })

    await this.$axios.get(this.$api_link + '/board-states/' + this.challenge.initial_board, this.auth.config).then((response) => {
      this.board_state = new BoardState(response.data.id, response.data.name, response.data.board_state, response.data.out_of_bounds_state)
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText } })
      return
    })

    await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/passed-challenges/' + this.id, this.auth.config).then((response) => {
      this.beat_challenge = (response.data != null)
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText } })
      return
    })

    if (this.auth.user.student_class == null) {
      this.auth.user.student_class = -1;
    }

    await this.$axios.get(this.$api_link + '/student-class/' + this.auth.user.student_class + '/challenge/' + this.id + '/visible', this.auth.config).then((response) => {
      if (response.data.visible == false) {
        this.$router.push({ name: 'error', params: {afterCode: '_', code: '403', message: 'Forbidden!' } })
        return
      }
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText } })
      return
    })

    if (this.$error) {
      loader.hide()
      return
    }


    this.board.initialState = this.board_state
    this.board.setState()

    this.board.attempt = new Attempt(user_id, this.id, this.challenge.score, 0, 0, null, null)

    loader.hide()
  },

  updated() {
    Prism.highlightAll()
  },

  beforeUnmount() {
    this.challenge = null
    this.code_file = null
  },

  methods: {},

  watch: {
    board: {
      handler: function () {
        this.$forceUpdate()
      },
      deep: true
    },
    auth: {
      handler: function () {
        this.$forceUpdate()
      },
      deep: true
    },
  }
}
</script>
