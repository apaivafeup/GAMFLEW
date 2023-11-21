<template>
  <div ref="submitModal" class="modal fade" id="submit-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">That was great!</h2>
          <h5 style="text-align: center; font-weight: normal">
            Explain what you did and why you think it worked.
          </h5>

          <textarea
            id="submit-modal-textarea"
            style="width: 100%; resize: none"
            rows="10"
            :placeholder="placeholder"
          />
          <p style="text-align: center; font-size: 10px">
            <em>
              Do know that, without submitting this explanation, your submission doesn't count!
            </em>
          </p>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button
            type="button"
            id="close-submit-modal"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            id="submit-modal-button"
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
import { defineComponent } from 'vue'
import { boardStore } from '../../store/boardStore'
import { Modal } from 'bootstrap';
import { ref } from 'vue'

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
    submitAttempt() {
      var comment = document.getElementById('submit-modal-textarea').value

      if (comment == '') {
        alert('You must write a comment!')
        return
      }

      this.$refs.close.click()

      console.log(this.board.attempt)
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
