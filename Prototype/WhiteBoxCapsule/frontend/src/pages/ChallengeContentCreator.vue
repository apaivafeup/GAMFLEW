<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardCreator from '../components/BoardCreator.vue'
import { boardCreatorStore } from '../store/boardCreator'

export default {
  async beforeMount() {
    this.board = boardCreatorStore()

    await this.$axios.get(this.$api_link + '/board-states').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
      })
    })

     document.getElementById('flexRadioDefault1').checked = true
  },

  data() {
    return {
      board: true,
      details: false,
      code: false,
      boardStates: []
    }
  },

  methods: {
    change(state) {
      var current = (this.board ? 'board' : (this.details ? 'details' : 'code'))

      if (state == 'board') {
        this.board = !this.board
        this.details = false
        this.code = false
      } else if (state == 'details') {
        this.board = false
        this.details = !this.details
        this.code = false
      } else if (state == 'code') {
        this.board = false
        this.details = false
        this.code = !this.code
      }
  
      document.getElementById(current + '-button').classList.toggle('selected')
      document.getElementById(state + '-button').classList.toggle('selected')
    }

  },
  components: { Menu, BoardCreator }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Content Creator</h2>
  </div>
  <div class="row" style="justify-content: center;">
    <button
    class="menu-button selected"
    id="board-button"
    @click="this.change('board')"
    style="width: 30%; padding: 5px;"
  >
    Board State
  </button>
  <button
    class="menu-button"
    id="code-button"
    @click="this.change('code')"
    style="width: 30%;"
  >
    Code
  </button>
  </div>
  <div class="row" style="justify-content: center;">
     <div class="col" style="width: 50%;">
      <div class="row">
        <h3>Board States</h3>
      </div>
      <div class="row">
        <h6>Existing States</h6>
      </div>
      <div class="row">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown button
          </button>
          <div class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </div>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Load State
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
          <button class="dropdown-item" type="button" v-for="state in boardStates" v-bind:key="state.id - 1" @change="this.board.changeState(this.boardStates[state.id - 1])">{{state.name}}</button>
        </div>
      </div>

      </div>
      <div class="col" style="width: 50%;">
       <BoardCreator v-if="board" />
     </div> 
  </div>
</template>
