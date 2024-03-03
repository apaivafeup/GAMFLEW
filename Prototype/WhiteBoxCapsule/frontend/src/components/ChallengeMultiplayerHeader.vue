<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">
        <strong>{{room_name + ': '}}</strong><em>{{ challenge_name.includes(':') ? challenge_name.split(':')[1] : challenge_name }}</em>
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
  },

  beforeMount() {
  },

  methods: {}
}
</script>

<style scoped></style>
