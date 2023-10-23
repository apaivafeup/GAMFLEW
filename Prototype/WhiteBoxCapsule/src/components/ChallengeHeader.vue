<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  },
  timer: Number
})
</script>

<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">Challenge 1</div>
      <div class="col" id="challenge-timer">{{ timer }}</div>
    </div>
  </header>
</template>

<style scoped></style>
