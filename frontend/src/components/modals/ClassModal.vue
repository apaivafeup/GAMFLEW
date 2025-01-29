<template>
  <div ref="classModal" class="modal fade" id="class-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">Create Class</h2>
          <p style="text-align: center; font-size: 10px">
            <em>
              Classes group students together.
            </em>
          </p>

          <div class="form-group" style="margin-bottom: 10px;">
            <label for="class-name">Class Name</label>
            <input type="text" class="form-control" id="class-name" placeholder="Enter room name" />
          </div>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button type="button" id="close-submit-modal" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="submit-modal-button" @click="createClass()">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { defineComponent } from 'vue'
import { boardStore } from '../../store/boardStore.js'
import { useToast } from "vue-toastification";
import { authStore } from '../../store/authStore.js'

export default defineComponent({

  beforeMount() {
    this.board = boardStore()
    this.toast = useToast()
    this.auth = authStore()
    this.auth.checkAuth()
  },

  data() {
    return {
      board: null,
      toast: null
    }
  },

  props: {
    placeholder: String
  },

  methods: {
    async createClass() {
      const className = document.getElementById('class-name').value


      if (className === '') {
        this.toast.error('Please enter a class name')
        return
      }

      var studentClass = {
        id: 0,
        name: className,
        teacher: this.auth.user.id
      }

      await this.$axios.post(this.$api_link + '/student-class/create', studentClass, this.auth.config
      ).then((response) => {
        this.toast.success('Class created successfully!')
        this.$refs.close.click()
        window.location.reload()

      }).catch((error) => {
        this.toast.error('An error occurred while creating the class.')
      })



    }
  }
})
</script>
