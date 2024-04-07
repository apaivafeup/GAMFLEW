<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Challenge Manager</h1>
  </div>
  
  <div class="col" style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <div class="row" style="display: flex; justify-content: end; margin-bottom: 10px;">
      <button class="is-primary box" id="create-challenge-button" style="max-width: 200px; padding: 15px; font-size: 15px;" @click="goToChallenge(null)">
        Create Challenge
      </button>
    </div>
    <div class="accordion" id="accordionExample" style="width: 1250px;">
      <div class="accordion-item" v-for="code_file in code_files">
        <h2 class="accordion-header" :id="'heading' + code_file.id">
          <button
            :id="'accordion-button-' + code_file.id"
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#collapse' + code_file.id"
            aria-expanded="true"
            :aria-controls="'collapse' + code_file.id"
          >
            {{ code_file.name }}
          </button>
        </h2>
        <div
          :id="'collapse' + code_file.id"
          :class="
            code_files.indexOf(code_file) == 0
              ? 'accordion-collapse collapse show'
              : 'accordion-collapse collapse'
          "
          :aria-labelledby="'heading' + code_file.id"
        >
          <div class="accordion-body">
            <ul class="list-group"  style="display: grid; grid-template-columns: repeat(3, 1.5fr); grid-gap: 10px;" >
              <li
                class="list-group-item"
                v-if="challenges[code_file.id]"
                v-for="challenge in challenges[code_file.id].sort(sort_function)"
                :key="challenge.id"
              >
                <ChallengeCard
                  :id="'challenge-card-' + challenge.id"
                  :challenge="challenge"
                  :passed="passed_challenges.includes(challenge.id)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ChallengeCard from '../components/ChallengeCard.vue'
import { authStore } from '../store/authStore'

import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';

export default defineComponent({
  components: { ChallengeCard },

  async beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: h(resolveComponent('LoadingIcon'))
      });

    this.auth = authStore()
    this.auth.checkAuth()

    await this.$axios.get(this.$api_link + '/code-files/', this.auth.config).then((response) => {
      this.code_files = response.data
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }})
      this.$error = true
    })

    await this.$axios.get(this.$api_link + '/challenges-by-code/', this.auth.config).then((response) => {
      this.challenges = response.data
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }})
      this.$error = true
    })

    await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/passed-challenges/', this.auth.config).then((response) => {
      this.passed_challenges = response.data
    }).catch((error) => {
      this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }})
      this.$error = true
    })

    if (this.$error) {
      loader.hide()
      return
    }

    loader.hide()
  },

  data() {
    return {
      challenges: {},
      code_files: [],
      passed_challenges: []
    }
  },

  methods: {
    sort_function(a, b) {
      return a.id - b.id
    },

    goToChallenge(id) {
      if (id == null)
        this.$router.push({ name: 'challenge-creator' })
      else
        this.$router.push({ name: 'challenge-editor', params: { id: id } })
    }
  }
})
</script>
