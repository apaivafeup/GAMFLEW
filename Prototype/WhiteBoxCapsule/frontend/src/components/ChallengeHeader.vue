<template>
  <header>
    <div class="row justify-content-between" id="header-row">
      <div class="col" id="challenge-id">
        <strong>{{ name.split(':')[0] + ':' }}</strong
        ><em>{{ name.includes(':')?name.split(':')[1] : name}}</em>
      </div>
    </div>
  </header>
</template>

<script>
import { boardStore } from '../store/boardStore.js'

export default {
  props: {
    name: String,
  },

  beforeMount() {
  },

  methods: {}
}
</script>

<style scoped></style>
