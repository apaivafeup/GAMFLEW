<template>
    <div class="row" style="text-align: center; margin-bottom: 15px;">
      <h1>Challenge Comments</h1>
    </div>
    
    <div class="row">

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
      }
    }
  })
  </script>
  