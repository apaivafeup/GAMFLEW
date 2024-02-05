<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import gameLogo from '../assets/pictures/logo.png'

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
    <img :src="gameLogo" style="width: 600px; margin-top: 30px;" />
  </div>
  <div class="row" style="justify-content: center; margin-top: 30px">
    <Menu />
  </div>
</template>
