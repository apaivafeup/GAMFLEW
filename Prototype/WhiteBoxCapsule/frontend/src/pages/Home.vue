<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'

export default {
  beforeMount() {
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
  <div class="row" style="text-align: center; justify-content: center;">
    <img src="../assets/pictures/logo.png" style="width: 600px; margin-top: 30px;" />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px">
    <Menu />
  </div>
</template>
