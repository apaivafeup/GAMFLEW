<template>
    <img src="../assets/pictures/icon.svg" alt="Loading" />
</template>
  
  <script>
  import { defineComponent } from 'vue'
  import { authStore } from '../store/authStore'
  import { RouterLink } from 'vue-router'
  
  export default defineComponent({
    name: 'LoadingIcon'
  })
  </script>
  