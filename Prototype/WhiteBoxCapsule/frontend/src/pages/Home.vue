<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'

export default {
  beforeMount() {
    console.log(this.$axios.defaults)
  },

  methods: {
    goToChallenge(id) {
      this.$router.push('/challenge/' + id)
    }
  },
  components: { Menu }
}
</script>

<template>
  <div class="row" style="text-align: center">
    <h1>White-Box Capsule</h1>
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px">
    <Menu />
  </div>
</template>
