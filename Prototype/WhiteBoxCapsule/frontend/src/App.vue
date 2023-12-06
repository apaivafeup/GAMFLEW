<template>
  <router-view></router-view>
  <GuideModal />
  <button id="guide-button" data-bs-target="#guide-modal" data-bs-toggle="modal">📙 Guide</button>
  <button @click="toggleMode" id="theme-toggle">💡 Theme</button>
</template>

<script>
import GuideModal from './components/modals/GuideModal.vue';

export default {
  beforeMount() {},
  components: { GuideModal },
  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    }
  }
}
</script>
