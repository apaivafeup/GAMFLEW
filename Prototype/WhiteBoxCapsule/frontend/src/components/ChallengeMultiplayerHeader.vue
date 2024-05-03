<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">
        <div class="span" style="display: flex; flex-direction: row">
          <strong style="margin-right: 2.5px;">{{room_name + ': '}}</strong><em style="margin-right: 5px;">{{ challenge_name.includes(':') ? challenge_name.split(':')[1] : challenge_name }}</em>
          <span class="badge bg-primary" style="font-size: 12px; margin: 0px; background-color: rgb(169, 89, 255)!important; text-align: center; display: flex; justify-content: center;"><strong>{{ score }} points</strong></span>
        </div>       
      </div>
      <div class="col">
        <p v-if="playable" style="margin: 0px; text-align: right; font-weight: bold; font-style: italic; color: rgb(169, 89, 255);">It's your turn! Go at it!</p>
        <p v-else style="margin: 0px; text-align: right; font-weight: bold; font-style: italic;">It's not your turn. If you want, get a submission ready!</p>
      </div>
    </div>
  </header>
</template>

<script>
import { boardStore } from '../store/boardStore'

export default {
  props: {
    room_name: String,
    challenge_name: String,
    playable: Boolean,
    score: Number
  },

  beforeMount() {
  },

  methods: {}
}
</script>

<style scoped></style>
