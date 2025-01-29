<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoadingIcon',

  data: () => {
    return {
      text: 'LOADING...'
    };
  },

  methods: {
  },

  compilerOptions: {
    isCustomElement: true
  }
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <Transition name="fade">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <img src="../assets/pictures/loading.svg" alt="Loading..." style="width: 100px;" />
      <p id="loading-text" style="font-family: 'Inter'; font-weight: 700; color: #8647D4;">{{text}}</p>
    </div>
  </Transition>
</template>