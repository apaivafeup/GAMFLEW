<template>
  <button hidden id="timeout-button" data-bs-toggle="modal" data-bs-target="#fail-modal" />
  <div ref="failModal" class="modal fade" id="fail-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">Time is up!</h2>
          <h5 style="text-align: center; font-weight: normal">
            Explain what you tried!
          </h5>

          <textarea
            id="fail-modal-textarea"
            style="width: 100%; resize: none"
            rows="10"
            :placeholder="placeholder"
          />
          <p style="text-align: center; font-size: 10px">
            <em>
              Do know that, without submitting this explanation, this attempt won't count!
            </em>
          </p>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button
            type="button"
            id="close-fail-modal"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="window.location.reload()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            id="fail-modal-button"
            @click="submitAttempt"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import { boardStore } from '../../store/boardStore'

export default defineComponent({
  beforeMount() {
    this.board = boardStore()
  },

  data() {
    return {
      board: null
    }
  },

  props: {
    placeholder: String
  },

  methods: {
    async submitAttempt() {
      var comment = document.getElementById('fail-modal-textarea').value

      if (comment == '') {
        alert('You must write a comment!')
        return
      }

      //this.$refs.close.click()

      this.board.attempt.comment = comment

      var body = {
        id: 0,
        time_elapsed: this.board.attempt.time_elapsed,
        score: this.board.attempt.score,
        player_id: this.board.attempt.player_id,
        challenge_id: this.board.attempt.challenge_id,
        attempt_type: "fail",
        comment: this.board.attempt.comment
      }

      await axios.post('http://localhost:8000/create/attempt/', body)
                 .then((response) => {
              console.log(response)
      })

      /* "id": 0,
    "player_id": 1,
    "challenge_id": 1,
    "time_elapsed": 100,
    "score": 100,
    "attempt_type": "pass",
    "comment": "Testing comments... I did very well!"
    */
    }
  }
})
</script>
