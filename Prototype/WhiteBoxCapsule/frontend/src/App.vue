<template>
  <router-view></router-view>
  <button @click="toggleMode" id="theme-toggle">💡</button>
</template>

<script>
export default {
  beforeMount() {

  },
  components: {},
  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    }
  }
}
</script>
