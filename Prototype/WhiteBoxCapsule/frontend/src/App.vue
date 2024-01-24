<template>
  <head>
    <meta charset="utf-8">
    <link rel="shortcut icon" type="svg" href="./assets/logo.svg" />
    <link rel="stylesheet" href="themes.css" />
    <link rel="stylesheet" href="themes-base16.css" />
    <link rel="stylesheet" href="simple-code-editor.css" />
    <title>Gamflew</title>
  </head>

  <router-view></router-view>
  <GuideModal />
  <button v-if="!url.includes('content-challenge')" id="guide-button" data-bs-target="#guide-modal"
    data-bs-toggle="modal">📙 Guide</button>
  <button v-if="!url.includes('content-challenge') && !url.includes('challenge/')" @click="toggleMode"
    id="theme-toggle">💡 Theme</button>
</template>

<script>
import GuideModal from './components/modals/GuideModal.vue'

export default {
  beforeMount() {
  },
  components: { GuideModal },
  data: () => {
    return {
      url: window.location.href
    };
  },

  methods: {
    toggleMode() {
      document.body.classList.toggle('dark-theme')
    }
  }
}
</script>
