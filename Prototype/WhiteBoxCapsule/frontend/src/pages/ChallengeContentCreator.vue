<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardCreator from '../components/BoardCreator.vue'
import { boardCreatorStore } from '../store/boardCreator'
import dropdown from 'vue-dropdowns';

export default {
  async beforeMount() {
    this.board = boardCreatorStore()

    await this.$axios.get(this.$api_link + '/board-states').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
      })
      this.dropdownClick(0, true);
    })
  },

  data() {
    return {
      board: true,
      details: false,
      code: false,
      boardStates: [],
      selectedState: '',
      stateName: ''
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
    },

    toggleDropdown() {
      document.getElementById('dropdown-menu-states').classList.toggle('show')
      document.getElementById('dropdown-menu-states').style.display = (document.getElementById('dropdown-menu-states').style.display == '' ? 'block' : '')
      document.getElementById('dropdown-menu-states').style.position = 'absolute'
      document.getElementById('dropdown-menu-states').style.inset = '0px auto auto 0px'
      document.getElementById('dropdown-menu-states').style.margin = '0px'
      document.getElementById('dropdown-menu-states').style.transform = 'translate3d(12px, 57.6px, 0px)'
    },

    dropdownClick(id, firstTime = false) {
      this.selectedState = this.boardStates[id].name

      if (!firstTime) {
        this.toggleDropdown()
      }

      this.board.changeState(this.boardStates[id])
    }

  },
  components: {
    Menu, BoardCreator
  }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Content Creator</h2>
  </div>
  <div class="row" style="justify-content: center;">
    <button class="menu-button selected" id="board-button" @click="this.change('board')"
      style="width: 30%; padding: 5px;">
      Board State
    </button>
    <button class="menu-button" id="code-button" @click="this.change('code')" style="width: 30%;">
      Code
    </button>
  </div>
  <div class="row" style="justify-content: center;">
    <div class="col" style="width: 50%;">
      <div class="row">
        <h3>Board States</h3>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Existing States</h6>
      </div>
      <div class="row" style="margin-bottom: 15px;">
        <div class="dropdown">
          <div v-if="this.selectedState != ''" style="font-size: 10px;">
            <p style="margin-bottom: 5px;"><strong>Selected: </strong>{{ this.selectedState }}</p>
          </div>
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false" @click="toggleDropdown()" style="margin: 0px;">
            Load State
          </button>
          <div id="dropdown-menu-states" class="dropdown-menu">
            <button class="dropdown-item" type="button" v-for="state in boardStates" v-bind:key="state.id - 1"
              @click="dropdownClick(state.id - 1)">{{ state.name }}</button>
          </div>
        </div>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">State Name</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Enter the name for a new state in the input below. If you click submit, this name will be used.</p>
      </div>
      <div class="row">
        <input type="text" placeholder="Write name here." id="state-name" name="state-name" style="width: 700px; height: 30px; margin-bottom: 5px; margin-left: calc(0.5 * var(--bs-gutter-x));">
      </div>
    </div>
    <div class="col" style="width: 50%;">
      <BoardCreator v-if="board" />
    </div>
  </div>
</template>
