<script setup>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import { testChallenge } from '../assets/challenges/test/testValues.js'

defineProps({
})
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: flex; flex-direction: row">
    <ChallengeCode :challenge="testChallenge"  />

    <BoardGrid :challenge="testChallenge" />
  </div>
</template>
