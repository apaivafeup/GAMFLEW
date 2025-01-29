<template>
  <div ref="createRoomModal" class="modal fade" id="create-room-modal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <h2 style="text-align: center">Create a Room</h2>          
          <p style="text-align: center; font-size: 10px">
            <em>
              You can create a room to play with others.
            </em>
          </p>

          <div class="form-group" style="margin-bottom: 10px;">
            <label for="room-name">Room Name</label>
            <input type="text" class="form-control" id="room-name" placeholder="Enter room name" />
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label for="room-name">Number of Rounds</label>
            <input type="number" class="form-control" id="room-rounds" placeholder="Enter round number" min="1" max="5" value="1" />
            <small id="roundsHelp" class="form-text text-muted">The number of rounds you want to play. A maximum of 5 rounds is possible.</small>
          </div>
          <div class="form-group" style="margin-bottom: 10px;">
            <label for="room-name">Number of Players</label>
            <input type="number" class="form-control" id="room-players" placeholder="Enter player number" min="2" max="3" value="2" />
            <small id="playersHelp" class="form-text text-muted">You need at least 2 players, and can have, at max, 3.</small>
          </div>
        </div>
        <div class="modal-footer">
          <button ref="close" type="button" data-bs-dismiss="modal" hidden />
          <button type="button" id="close-submit-modal" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="submit-modal-button" @click="createRoom">
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
    async createRoom() {
      var roomName = document.getElementById('room-name').value,
        rounds = document.getElementById('room-rounds').value,
        players = document.getElementById('room-players').value

      if (roomName === '' || rounds === '' || players === '') {
        alert('Please fill all the fields.')
        return
      }

      var body = {
        id: 0,
        name: roomName,
        rounds: rounds,
        player_number: players,
        room_owner: this.auth.user.id
      }

      await this.$axios.post(this.$api_link + '/create/game-room/', body, this.auth.config)
        .then(response => {
          this.$refs.close.click()
          this.$router.go()
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
          return
        })
    }
  }
})
</script>
