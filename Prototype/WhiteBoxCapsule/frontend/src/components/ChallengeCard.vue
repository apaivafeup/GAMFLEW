<template>
  <div class="card challenge-card">
    <div class="card-body" style="">
      <div class="row" style="display: flex; justify-content: space-between">
        <div style="width: 100%">
          <div class="row" style="align-items: center; display: flex; flex-direction: row; align-content: center; margin-bottom: 5px;">
            <h5 class="card-title" style="width: auto; margin-bottom: 2.5px;">{{ challenge.name.split(':')[0] }}</h5>
            <div
              v-if="passed"
              class="passed-badge"
              style="
                align-self: start;
                text-align: right;
                font-size: 12px;
                font-weight: bold;
                width: auto;
                display: flex;
                margin-top: 0px;
                flex-direction: row;
                padding: 2.5px 10px;
                margin-bottom: 2.5px;
              "
            >
              Passed ✅
            </div>
            <button class="passed-badge comments-badge"
            style="
              align-self: start;
              text-align: right;
              font-size: 12px;
              margin-right: 2.5px;
              font-weight: bold;
              width: auto;
              display: flex;
              margin-top: 0px;
              flex-direction: row;
              padding: 2.5px 10px;
              margin-bottom: 2.5px;
            " @click="goToChallengeComments(challenge.id)" v-else>
              Comments 💬
            </button>
            <div class="col" v-if="this.unlocked" style="display: flex; flex-direction: row; font-size: 16px; align-items: center; justify-content: end;">
              <font-awesome-icon class="icon" icon="award" fixed-width />
            </div>
            <div class="col" v-else style="opacity: 45%; display: flex; flex-direction: row; font-size: 16px; align-items: center; justify-content: end;">
              <font-awesome-icon class="icon" icon="award" fixed-width />
            </div>
          </div>
          <div class="row">
            <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">{{ challenge.name.split(':')[1] }}</h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div :style="challenge.id > 99 ? 'display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;' : 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;' ">
          <div class="badge bg-primary" style="margin: 0px; font-size: 12px !important; background-color: #ffc107 !important; text-align: center; display: flex; justify-content: center;"><strong>{{ challenge.score }} pts.</strong></div>
          <div class="badge bg-primary" v-if="challenge.challenge_type != 'mcdc'" style="margin: 0px; font-size: 12px !important; background-color: rgb(25, 135, 84)!important; text-align: center; font-style: italic; display: flex; justify-content: center;">
            {{ challenge.challenge_type.charAt(0).toUpperCase() + challenge.challenge_type.slice(1) }}
          </div>
          <div class="badge bg-primary" v-else style="margin: 0px; font-size: 12px !important; background-color: rgb(25, 135, 84)!important; text-align: center; font-style: italic; display: flex; justify-content: center;">
            {{ challenge.challenge_type.toUpperCase() }}
          </div>
          <div class="badge bg-primary" style="margin: 0px; font-size: 12px !important; background-color: rgb(13, 202, 240)!important; text-align: center; display: flex; justify-content: center;">
            {{ challenge.difficulty }}
          </div>
          <button v-if="!this.editor" :id="'challenge-' + challenge.id + '-play'" class="badge menu-button comments-badge play-badge" style="margin: 0px; justify-content: center;" @click="goToChallenge(challenge.id)">
            Play ▶️
          </button>
          <button v-else class="badge menu-button comments-badge play-badge" style="margin: 0px; justify-content: center;" @click="goToChallenge(challenge.id)">
            Edit 📝
          </button>
          <button class="badge menu-button delete-badge"
            style="
              align-self: start;
              text-align: right;
              font-size: 12px;
              font-weight: bold;
              width: auto;
              display: flex;
              margin-top: 0px;
              flex-direction: row;
              padding: 2.5px 10px;
              margin-bottom: 2.5px;
            " @click="deleteChallenge(challenge.id)" v-if="window.location.href.includes('challenge-manager') && challenge.id > 99">
              Delete 🗑️
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.icon:nth-of-type(n) {
  color: rgb(169, 89, 255) !important;
}

.icon:nth-of-type(2n) {
  color: rgb(89, 111, 255) !important;
}
</style>

<script>
import { defineComponent } from 'vue'
import { Challenge } from '../store/models/challenge.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { authStore } from '../store/authStore.js'

export default defineComponent({
  props: {
    challenge: Object,
    passed: Boolean,
    editor: Boolean,
    unlocked: Boolean
  },

  data() {
    return {}
  },


  beforeMount() {
    this.auth = authStore()
  },

  methods: {
    async deleteChallenge() {
      await this.$axios.delete(this.$api_link + '/challenge/' + this.challenge.id, this.auth.config)
        .then((response) => {
          if (response.status == 200) {
            alert('Challenge deleted successfully!')
            this.$router.go()
          } else {
            alert('There was an error deleting the challenge. Please try again.')
          }
        })
    },

    goToChallenge(id) {
      if (this.editor)
        this.$router.push({name: 'challenge-editor', params: {id: id}})
      else
        this.$router.push({name: 'challenge', params: {id: id}})
    },

    goToChallengeComments(id) {
      this.$router.push({name: 'challenge-comments', params: {id: id}})
    }
  }
})
</script>
