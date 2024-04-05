<template>
  <div ref="commentModal" class="modal fade" id="comment-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">Comment your answer to validate it!</h2>
          <h5 style="text-align: center; font-weight: normal">
            Explain your attempt, and why you think it's the answer.
          </h5>

          <textarea id="comment-modal-textarea" style="width: 100%; resize: none" rows="10" :placeholder="placeholder" />
          <p style="text-align: center; font-size: 10px">
            <em>
              Do know that, without submitting this explanation, your submission doesn't count!
            </em>
          </p>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button type="button" id="close-comment-modal" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="comment-modal-button" @click="validate">
            Validate
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

export default defineComponent({

  beforeMount() {
    this.board = boardStore()
    this.toast = useToast()
    this.auth = authStore()
  },

  data() {
    return {
      toast: null
    }
  },

  props: {
    placeholder: String
  },

  methods: {
    async validate() {
      if (document.getElementById('comment-modal-textarea').value == '') {
        alert('You must write a comment!')
        return
      }

      this.board.attempt.comment = document.getElementById('comment-modal-textarea').value
      this.$refs.close.click()
      this.board.go = true
      
      document.getElementById('comment-modal-textarea').value = ''
      document.getElementById('go-click-element').click()
    }
  }
})
</script>
