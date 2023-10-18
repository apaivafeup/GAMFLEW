<script setup>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'

defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: flex; flex-direction: row">
    <ChallengeCode />

    <BoardGrid />
  </div>
</template>
