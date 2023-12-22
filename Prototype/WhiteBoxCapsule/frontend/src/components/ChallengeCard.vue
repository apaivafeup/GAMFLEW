<template>
  <div class="card challenge-card" @click="goToChallenge(challenge.id)">
    <div class="card-body" style="">
      <div class="row" style="display: flex; justify-content: space-between">
        <div style="width: 90%">
          <div class="row" style="align-items: center">
            <h5 class="card-title" style="width: auto">{{ challenge.name.split(':')[0] }}</h5>
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
                margin-bottom: var(--bs-card-title-spacer-y);
              "
            >
              Passed ✅
            </div>
          </div>
          <div class="row">
            <h6 class="card-subtitle mb-2 text-muted">{{ challenge.name.split(':')[1] }}</h6>
          </div>
        </div>
        <div style="width: 10%; display: flex; flex-direction: column; padding-right: 25px">
          <div class="row" style="align-items: center; font-size: 15px; justify-content: end">
            <font-awesome-icon icon="fa-clock" style="width: auto" />
            {{ challenge.timer_value + 's' }}
          </div>
          <div
            class="row"
            style="
              align-items: center;
              text-align: right;
              font-size: 12px;
              font-style: italic;
              justify-content: end;
            "
          >
            {{ challenge.challenge_type }}
          </div>
          <div
            class="row"
            style="
              align-items: center;
              text-align: right;
              font-size: 10px;
              font-weight: bold;
              justify-content: end;
            "
          >
            {{ challenge.difficulty }}
          </div>
        </div>
      </div>
      <p class="card-text">{{ challenge.description }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Challenge } from '../store/models/challenge.js'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  props: {
    challenge: Challenge,
    passed: Boolean
  },

  data() {
    return {}
  },

  methods: {
    goToChallenge(id) {
      this.$router.push(this.$api_link + '/challenge/' + id)
    }
  }
})
</script>
