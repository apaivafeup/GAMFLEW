<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Challenge Editor</h1>
  </div>
  
  <div class="col" style="display: flex; justify-content: center; align-items: center; flex-direction: column">
    <div class="row" style="display: flex; justify-content: end; margin-bottom: 10px;">
      <button class="is-primary box" id="create-challenge-button" style="max-width: 200px; padding: 15px; font-size: 15px;" @click="goToChallenge(null)">
        Create Challenge
      </button>
    </div>
    <div class="accordion" id="challengeExample" style="width: 1400px;">
      <div class="accordion-item" v-for="code_file in code_files">
        <h2 class="accordion-header" :id="'heading-' + code_file.id" v-if="challenges[code_file.id] != undefined" style="display: grid; grid-template-columns: 80% 15%;">
          <button :id="'accordion-button-' + code_file.id" class="accordion-button collapsed" type="button" @click="toggleAccordion(code_file.id)">
            {{ code_file.name }}
          </button>
          <button :id="'accordion-delete-button-' + code_file.id" class="menu-button" type="button" style="margin: 20px; font-size: 12px; border-radius: 15px; " @click="deleteCodeFile(code_file.id)">
            Delete
          </button>
        </h2>
        <div v-if="challenges[code_file.id] != undefined && challenges[code_file.id].length > 0" class="accordion-body accordion-collapse collapse" :id="'collapse-' + code_file.id" data-bs-parent="challengeList">
            <ul class="list-group"  style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;" >
              <li class="list-group-item" v-if="challenges[code_file.id]" v-for="challenge in challenges[code_file.id].sort(sort_function)" :key="challenge.id" >
                <ChallengeCard
                  :editor="true"
                  :id="'challenge-card-' + challenge.id"
                  :challenge="challenge"
                  :passed="passed_challenges.includes(challenge.id)"
                  :unlocked="unlocked_challenge_achievements.includes(challenge.id)"
                  :visible="challenge.visible"
                  :attempted-challenges="[]"
                />
              </li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ChallengeCard from '../components/ChallengeCard.vue'
import { authStore } from '../store/authStore.js'

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

      this.code_files.forEach((code_file) => {
        if (!this.challenges[code_file.id])
          this.code_files = this.code_files.filter((cf) => cf.id != code_file.id)
      })
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

    await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/achievements/challenges/', this.auth.config).then((response) => {
      this.unlocked_challenge_achievements = response.data
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
      passed_challenges: [],
      unlocked_challenge_achievements: []
    }
  },

  methods: {
    async deleteCodeFile(id) {
      console.log(id)
      await this.$axios.delete(this.$api_link + '/code-file/' + id, this.auth.config)
        .then(response => {
          alert('Code file deleted successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when deleting the code file. Please try again later.')
        })
    },

    sort_function(a, b) {
      return a.id - b.id
    },

    goToChallenge(id) {
      if (id == null)
        this.$router.push({ name: 'challenge-creator' })
      else
        this.$router.push({ name: 'challenge-editor', params: { id: id } })
    },

    toggleAccordion(id) {
      let button = document.getElementById('accordion-button-' + id)
      let collapse = document.getElementById('collapse-' + id)

      if (collapse.classList.contains('show')) {
        collapse.classList.remove('show')
        button.classList.add('collapsed')
      } else {
        collapse.classList.add('show')
        button.classList.remove('collapsed')
      }
    }
  }
})
</script>
