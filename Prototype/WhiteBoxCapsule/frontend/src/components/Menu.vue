<template>
  <div
    class="col"
    v-if="main"
    style="display: flex; justify-content: center; align-items: center; flex-direction: column"
  >
    <button
      class="menu-button"
      id="single-player-button"
      @click="this.$router.push('challenges')"
      style="width: 500px"
    >
      Single Player
    </button>
    <button
      class="menu-button"
      id="single-player-button"
      @click="this.$router.push('content-creator')"
      style="width: 500px"
    >
      Challenge Content Creator
    </button>
    <button
      class="menu-button"
      id="single-player-button"
      @click="this.$router.push('challenge-creator')"
      style="width: 500px"
    >
      Challenge Creator
    </button>
    <button class="menu-button" @click="this.$router.push('how-to')" style="width: 500px">
      How To Play
    </button>
    <button class="menu-button" @click="this.$router.push({name: 'credits'})" style="width: 500px">
      Credits
    </button>
    <!-- <button class="menu-button" @click="this.$router.push({name: 'challenge-editor', params: {id: 1}})" style="width: 500px">
      Challenge Editor
    </button> -->
  </div>

</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},

  data() {
    return {
      main: true,
      challenges: false,
      howTo: false,
      credits: false
    }
  },

  methods: {
    switchMenu(target) {
      switch (target) {
        case 'main':
          this.main = true
          this.challenges = false
          this.howTo = false
          this.credits = false
          break
        case 'challenges':
          this.main = false
          this.challenges = true
          this.howTo = false
          this.credits = false
          break
        case 'howTo':
          this.main = false
          this.challenges = false
          this.howTo = true
          this.credits = false
          break
        case 'credits':
          this.main = false
          this.challenges = false
          this.howTo = false
          this.credits = true
          break
      }
    }
  }
})
</script>
