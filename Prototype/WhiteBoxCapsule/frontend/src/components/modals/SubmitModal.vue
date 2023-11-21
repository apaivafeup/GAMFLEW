<template>
    <div class="modal" id="submit-modal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-body">
              <h2 style="text-align: center;">That was great!</h2>
              <h5 style="text-align: center; font-weight: normal;">Explain what you did and why you think it worked.</h5>
              
              <textarea style="width: 100%; resize: none;" rows="10"/>
              <p style="text-align: center; font-size: 10px;"><em>Do know that, without submitting this explanation, your submission doesn't count!</em></p>
            </div>
            <div class="modal-footer">
              <button type="button" id="close-submit-modal" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary">Submit</button>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {

    },

    methods: {

    }
})
</script>
