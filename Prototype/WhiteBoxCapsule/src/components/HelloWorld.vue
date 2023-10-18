<script setup>
import Header from './Header.vue'
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <Header />
</template>
