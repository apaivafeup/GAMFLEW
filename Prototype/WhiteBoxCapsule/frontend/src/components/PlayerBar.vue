<template>
  <div class="row" style="padding: 15px; justify-content: right">
    <div class="player-bar-box">
      <div style="display: flex; align-items: center; margin-top: 10px; justify-content: space-between;">
        <div style="display: flex; align-content: center; align-items: center;">
          <img src="../assets/pictures/avatar.png" class="player-bar-avatar" />
          <div class="col">
            <div class="row">
              <b style="font-size: 22px">{{ user.name }}</b>
            </div>
            <div class="row">
              <em style="font-size: 10px">
                {{ user.email }}
              </em>
            </div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column;">
          <div style="align-items: center;">
            <font-awesome-icon icon="trophy" fixed-width style="color: #ffc107; margin-right: 5px;" />
            <em style="font-size: 15px;">{{ user.points }}</em>
          </div>
          <div style="align-items: center;">
            <font-awesome-icon icon="list-alt" fixed-width style="color: #8ADC6D; margin-right: 5px;" />
            <em style="font-size: 15px;">{{ user.attempts }}</em>
          </div>
          <div style="align-items: center;">
            <font-awesome-icon icon="list-check" fixed-width style="color: rgb(169, 89, 255); margin-right: 5px;"  />
            <em style="font-size: 15px;">{{ user.achievements }}</em>
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-top: 20px;">
        ...
      </div>
    </div>
  </div>
</template>

<script>
import { Challenge } from '../store/models/challenge'
import { boardStore } from '../store/boardStore'
import { User } from '../store/models/user.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: { FontAwesomeIcon },
  props: {
    challenge: Challenge,
    user: User
  },

  beforeMount() {
    this.board = boardStore()
  }
}
</script>
