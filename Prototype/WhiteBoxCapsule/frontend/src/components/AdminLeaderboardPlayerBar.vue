<template>
  <div class="row" style="padding: 0px 15px; justify-content: center; ">
    <div class="player-bar-box" style="width: 75%; display: flex; flex-direction: column; border-radius: 30px;">
      <div style="display: flex; flex-direction: row; justify-content: space-between; padding: 3px 5px;">
        <div style="display: flex; align-content: center; align-items: start; flex-direction: column; justify-content: center;">
          <div class="row" style="--bs-gutter-x: 0; --bs-gutter-y: 0;">
            <img :src="this.$api_link + user.picture" class="player-bar-avatar" />
            <div class="col" style="justify-content: center; display: flex; flex-direction: column;">
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
        </div>
        <div id="player-points-achievements" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <span style="padding: 5px; margin: 0px; display: flex; justify-content: center; align-items: center; font-weight: bold;">
            <font-awesome-icon icon="coins" fixed-width style="color: #00c8ff !important; margin-right: 5px" />
            <p style="color: #00c8ff !important; margin: 0px;">Score: {{ user.score }}</p>
          </span>
          <span style="padding: 5px; margin: 0px; display: flex; justify-content: center; align-items: center; font-weight: bold;">
            <font-awesome-icon icon="award" fixed-width style="color: rgb(169, 89, 255) !important; margin-right: 5px" />
            <p style="color: rgb(169, 89, 255) !important; margin: 0px;">Achievements: {{ user.achievements }}</p>
          </span>
        </div>
        <div id="player-stats">
          <span class="badge badge-warning" style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            ">
            <font-awesome-icon icon="trophy" fixed-width style="color: #ffc107; margin-right: 5px" />
            <p style="margin: 0px 7.5px 0px 0px">Passed Attempts: </p>
            {{ user.successful_attempts }}
          </span>
          <span class="badge badge-warning" style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            ">
            <font-awesome-icon icon="fa-xmark" fixed-width style="color: var(--bs-red); margin-right: 5px" />
            <p style="margin: 0px 7.5px 0px 0px">Failed Attempts:</p>
            {{ user.failed_attempts }}
          </span>
          <span class="badge badge-warning" style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            ">
            <font-awesome-icon icon="list-check" fixed-width style="color: #8adc6d; margin-right: 5px" />
            <p style="margin: 0px 7.5px 0px 0px">Total Attempts:</p>
            {{ user.successful_attempts + user.failed_attempts }}
          </span>
          <!-- <span class="badge badge-warning" style="
              display: flex;
              flex-direction: row;
              justify-content: end;
              font-weight: normal;
              color: var(--text-color);
              font-size: 14px;
            ">
            <font-awesome-icon icon="award" fixed-width style="color: rgb(169, 89, 255); margin-right: 5px" />
            <p style="margin: 0px 7.5px 0px 0px">Achievements:</p>
            {{ user.achievements }}
          </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { boardStore } from '../store/boardStore.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: { FontAwesomeIcon },
  props: {
    key: String,
    user: {
      type: Object,
      required: true
    }
  },

  beforeMount() {
    this.board = boardStore()
  }
}
</script>
