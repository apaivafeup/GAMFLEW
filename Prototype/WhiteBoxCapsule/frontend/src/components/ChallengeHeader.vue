<template>
  <header>
    <div class="row justify-content-between" id="header-row" style="align-items: center; display: flex;">
      <div class="col" id="challenge-id">
        <strong>{{ name.split(':')[0] + ':' }}</strong
        ><em>{{ name.includes(':')?name.split(':')[1] : name}}</em>
      </div>
      <div class="col" v-if="id != null" id="challenge-buttons" style="display: flex; justify-content: end;">
        <button class="button" style="width: auto !important;" v-if="id != 1" @click="this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) - 1).toString() }})">
          Previous Challenge
        </button>
        <button class="button disabled" style="width: auto !important;"  v-else  @click="this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) - 1).toString() }})">
          Previous Challenge
        </button>
        <button class="button" style="width: auto !important;"  v-if="id != 99" @click="this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) + 1).toString() }})">
          Next Challenge
        </button>
        <button class="button disabled" style="width: auto !important;" v-else @click="this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) + 1).toString() }})">
          Next Challenge
        </button>
      </div>
    </div>

  </header>
</template>

<script>
import { boardStore } from '../store/boardStore.js'

export default {
  props: {
    name: String,
    id: Number
  },

  beforeMount() {
  },

  methods: {}
}
</script>

<style scoped></style>
