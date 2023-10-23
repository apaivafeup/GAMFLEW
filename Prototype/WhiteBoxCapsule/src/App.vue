<script setup>
import ChallengeTest from './pages/ChallengeTest.vue'
import { testCode } from './assets/challenges/test/testValues.js'
</script>

<template>
  <ChallengeTest :timer="300" :code="testCode" />
</template>
