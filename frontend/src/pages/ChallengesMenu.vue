<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Challenges</h1>
  </div>
  
  <div class="col" style="display: flex; justify-content: center; align-items: center; flex-direction: column" >
    <div class="accordion" id="challengeList" style="width: 1400px;">
      <div class="accordion-item" v-for="code_file in code_files">
        <h2 class="accordion-header" :id="'heading-' + code_file.id" v-if="challenges[code_file.id] != undefined">
          <button :id="'accordion-button-' + code_file.id" class="accordion-button collapsed" type="button" @click="toggleAccordion(code_file.id)">
            {{ code_file.name }}
          </button>
        </h2>
        <div v-if="challenges[code_file.id] != undefined && challenges[code_file.id].length > 0" class="accordion-body accordion-collapse collapse" :id="'collapse-' + code_file.id" data-bs-parent="challengeList">
            <ul class="list-group"  style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;" >
              <li class="list-group-item" v-if="challenges[code_file.id]" v-for="challenge in challenges[code_file.id].sort(sort_function)" :key="challenge.id" >
                <ChallengeCard
                  :id="'challenge-card-' + challenge.id"
                  :challenge="challenge"
                  :passed="passed_challenges.includes(challenge.id)"
                  :unlocked="unlocked_challenge_achievements.includes(challenge.id)"
                  :attemptedChallenges="attempted_challenges"
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

    // if (this.auth.user.student_class == null && this.auth.user.user_type != 'teacher') {
    //   this.$router.push({ name: 'error', params: {afterCode: '_', code: '401', message: 'No Class'}})
    //   this.$error = true
    //   loader.hide()
    //   return
    // }
    
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
      unlocked_challenge_achievements: [],
      attempted_challenges: []
    }
  },

  methods: {
    sort_function(a, b) {
      return a.id - b.id
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
