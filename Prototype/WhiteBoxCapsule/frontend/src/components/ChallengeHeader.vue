<template>
  <header>
    <div class="row justify-content-between" id="header-row" style="align-items: center; display: flex;">
      <div class="col" id="challenge-id">
        <strong>{{ name.split(':')[0] + ':' }}</strong
        ><em>{{ name.includes(':')?name.split(':')[1] : name}}</em>
      </div>
      <div class="col" v-if="id != null" id="challenge-buttons" style="display: flex; justify-content: end;">
        <button class="button" style="width: auto !important;" v-if="id != 1" @click="changePreviousPage(id, true)">
          Previous Challenge
        </button>
        <button class="button disabled" style="width: auto !important;"  v-else  @click="changePreviousPage(id, false)">
          Previous Challenge
        </button>
        <button class="button" style="width: auto !important;"  v-if="id != 99" @click="changeNextPage(id, false)">
          Next Challenge
        </button>
        <button class="button disabled" style="width: auto !important;" v-else @click="changeNextPage(id, true)">
          Next Challenge
        </button>
      </div>
    </div>

  </header>
</template>

<script>
import { boardStore } from '../store/boardStore';

export default {
  props: {
    name: String,
    id: Number
  },

  beforeMount() {
    this.board = boardStore()
  },


  methods: {
    changeAddMode(){
      if (this.board.add) {
        this.board.addMode();
      }
    },

    changePreviousPage(id, one) {
      this.changeAddMode();
      this.$forceUpdate(); 
      if (one) {
        this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) - 1).toString() }}).then(() => {
          window.location.reload();
        }); 
        this.$router.go(1);
      } else {
        this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) - 1).toString() }}).then(() => {
          window.location.reload();
        }); 
        this.$forceUpdate();
      }
      
    this.$forceUpdate()
  },

  changeNextPage(id, last) {
    this.changeAddMode();
    this.$forceUpdate(); 
    if (last) {
      this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) + 1).toString() }}).then(() => {
          window.location.reload();
        }); 
      this.$forceUpdate();
    }
    else {
      this.$router.push({ name: 'challenge', params: { id: parseInt(parseInt(id) + 1).toString() }}).then(() => {
          window.location.reload();
        }); 
      this.$router.go(1);
    }
    this.$forceUpdate()
  },

  }
}
</script>