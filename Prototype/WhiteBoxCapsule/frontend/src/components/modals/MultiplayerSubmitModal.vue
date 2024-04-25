<template>
  <div ref="submitModal" class="modal fade" id="submit-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">That was great!</h2>
          <h5 style="text-align: center; font-weight: normal">
            Explain what you did and why you think it worked.
          </h5>

          <textarea id="submit-modal-textarea" style="width: 100%; resize: none" rows="10" :placeholder="placeholder" />
          <p style="text-align: center; font-size: 10px">
            <em>
              Do know that, without submitting this explanation, your submission doesn't count!
            </em>
          </p>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button type="button" id="close-submit-modal" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="submit-modal-button" @click="submitAttempt">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { defineComponent } from 'vue'
import { boardStore } from '../../store/boardStore'
import { useToast } from "vue-toastification";
import { authStore } from '../../store/authStore'
import { Challenge } from '../../store/models/challenge';

export default defineComponent({

  beforeMount() {
    this.board = boardStore()
    this.toast = useToast()
    this.auth = authStore()
  },

  data() {
    return {
      board: null,
      toast: null
    }
  },

  props: {
    placeholder: String,
    round_id: Number,
    challenge: Challenge
  },

  methods: {
    async submitAttempt() {
      var comment = document.getElementById('submit-modal-textarea').value

      if (comment == '') {
        alert('You must write a comment!')
        return
      }

      this.board.attempt.comment = comment

      var body = {
        id: 0,
        score: this.board.attempt.score,
        player_id: this.board.attempt.player_id,
        challenge_id: this.board.attempt.challenge_id,
        attempt_type: this.board.passed ? 'pass' : 'fail',
        comment: this.board.attempt.comment,
        game_round_id: this.round_id,
        test_cases: this.saveTestCases(),
        comment_score_count: this.board.passed ? 0 : null,
        comment_score: this.board.passed ? 0 : null
      }

      var flag = false, score = 0
      await this.$axios.post(this.$api_link + '/create/attempt/', body, this.auth.config).then((response) => {
        this.$refs.close.click()
        this.board.submit(response.data.score)
      }).catch((error) => {
        this.toast.error('An error occurred while submitting your attempt. Please try again later.')
      })

      await this.$axios.post(this.$api_link + '/round/' + this.round_id + '/finish/', {}, this.auth.config).then((response) => {
      }).catch((error) => {
        this.toast.error('An error occurred while finishing the round. Please try again later.')
      })
    },

    saveTestCases() {
      var testCases = {}

      for (var i = 0; i < this.challenge.test_cases_count; i++) {
        var testCase = {
          board: this.board.state[i],
          outOfBounds: this.board.outOfBoundsState[i],
          log: this.board.log[i]
        }

        testCases[i] = testCase
      }

      return testCases
    },
  }
})
</script>
