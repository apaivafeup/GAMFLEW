<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore'
import LoadingIcon from '../components/LoadingIcon.vue'
import { defineComponent, h, resolveComponent } from 'vue'

export default {
  beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: h(resolveComponent('LoadingIcon'))
      });

    setTimeout(() => {loader.hide()}, 5000)
  },

  methods: {
  },
  components: { LoadingIcon }
}
</script>

<template>

</template>
