<template>
  <div class="row" style="padding: 15px; justify-content: right">
    <div class="player-bar-box" style="display: flex; flex-direction: column">
      <div
        style="display: flex; align-items: top; margin-top: 10px; justify-content: space-between"
      >
        <div
          class="col-md-8"
          style="display: flex; align-content: center; align-items: start; flex-direction: column"
        >
          <div class="row" style="--bs-gutter-x: 0; --bs-gutter-y: 0; margin-bottom: 20px">
            <img :src="this.$api_link + user.picture" class="player-bar-avatar" />
            <div class="col">
              <div class="row">
                <b style="font-size: 22px">{{ user.name }}</b>
              </div>
              <div class="row">
                <em style="font-size: 10px">
                  {{ user.username }}
                </em>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center">...</div>
        </div>
        <div class="col-md-2" id="player-stats">
          <span
            class="badge badge-warning"
            style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            "
          >
            <font-awesome-icon
              icon="trophy"
              fixed-width
              style="color: #ffc107; margin-right: 5px"
            />
            <p style="margin: 0px 7.5px 0px 0px">Wins:</p>
            {{ user.successfulAttempts }}
          </span>
          <span
            class="badge badge-warning"
            style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            "
          >
            <font-awesome-icon
              icon="list-check"
              fixed-width
              style="color: #8adc6d; margin-right: 5px"
            />
            <p style="margin: 0px 7.5px 0px 0px">Attempts:</p>
            {{ user.successfulAttempts + user.failedAttempts }}
          </span>
          <span
            class="badge badge-warning"
            style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            "
          >
            <font-awesome-icon
              icon="award"
              fixed-width
              style="color: rgb(169, 89, 255); margin-right: 5px"
            />
            <p style="margin: 0px 7.5px 0px 0px">Achievements:</p>
            {{ user.achievements }}
          </span>
        </div>
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
