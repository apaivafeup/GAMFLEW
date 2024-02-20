<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Challenges</h1>
  </div>
  
  <div
    class="col"
    style="display: flex; justify-content: center; align-items: center; flex-direction: column"
  >
    <div class="accordion" id="accordionExample" style="width: 1000px">
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
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <ul class="list-group">
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

export default defineComponent({
  components: { ChallengeCard },

  async beforeMount() {
    this.auth = authStore()

    await this.$axios.get(this.$api_link + '/code-files/', this.auth.config).then((response) => {
      this.code_files = response.data
    })

    await this.$axios.get(this.$api_link + '/challenges-by-code/', this.auth.config).then((response) => {
      this.challenges = response.data
    })

    //TODO: get logged user id when login is implemented
    await this.$axios.get(this.$api_link + '/users/' + 1 + '/passed-challenges/', this.auth.config).then((response) => {
      this.passed_challenges = response.data
    })
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
    }
  }
})
</script>
