<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">Challenge 1</div>
      <div class="col" id="challenge-timer">05:00</div>
    </div>
  </header>
</template>

<style scoped></style>
