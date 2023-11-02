<script setup>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import { testChallenge } from '../assets/challenges/test/testValues.js'
import PlayerInfo from './PlayerInfo.vue'

defineProps({})
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: flex; flex-direction: row">
    <div class="col">
      <ChallengeCode :challenge="testChallenge" />
      <PlayerInfo />
    </div>
    
    <div class="col">
      <BoardGrid :challenge="testChallenge" />
    </div>
  </div>
</template>
