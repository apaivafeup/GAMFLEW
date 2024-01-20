<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardCreator from '../components/BoardCreator.vue'
import { boardCreatorStore } from '../store/boardCreator'

export default {
  beforeMount() {
    this.board = boardCreatorStore()
  },

  methods: {
  },
  components: { Menu, BoardCreator }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Creator</h2>
  </div>
  <div class="row">
    <div class="col">
      
    </div>
    <div class="col">
      <BoardCreator />
    </div>
  </div>

</template>
