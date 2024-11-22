<template>
  <div style="display: flex; justify-content: center;">
    <div style="flex-direction: column; display: flex; justify-content: space-between;">
      <div class="col" style="">
        <div class="game-board-out-labels" v-if="!board.table">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out of Bounds</div>
        </div>
        <div class="game-board-out-creator">
          <div class="box">
            <OutPieceStackCreator />
          </div>
          <div style="width: 100%; display: flex; flex-direction: row; justify-content: center">
            <input v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" id="piece-stack-out-x"
              class="col box" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="row"/>
            <input v-else id="piece-stack-out-x" class="col box disabled"
              style="width: 50px; text-align: center; font-size: 12px" type="number" disabled />
            <input v-if="board.outOfBoundsState[board.currentKey].pieceCount() == 0" id="piece-stack-out-y"
              class="col box" style="width: 50px; text-align: center; font-size: 12px" type="number" placeholder="column" />
            <input v-else id="piece-stack-out-y" class="col box disabled"
              style="width: 50px; text-align: center; font-size: 12px" type="number" disabled />
          </div>
        </div>

        <div class="buttons-grid">
          <button id="add-button" class="button is-primary is-fullwidth add-button" v-if="!board.passed && !board.pause"
            @click="this.board.addMode()">
            {{ !board.add ? 'Add' : 'Move' }}
          </button>
          <button id="add-button" class="button is-primary is-fullwidth add-button disabled" style="cursor: default" v-else>
            {{ !board.add ? 'Add' : 'Move' }}
          </button>
          <button id="reset-button" class="button is-primary is-fullwidth"
            v-if="!board.passed && !board.pause && !board.add" @click="board.generateState(true)">
            Reset
          </button>
          <button id="reset-button" class="button is-primary is-fullwidth disabled" style="cursor: default" v-else>
            Reset
          </button>
          <button id="submit-button" class="button is-primary is-fullwidth" @click="submit()">
            Submit
          </button>
          <button id="exit-button" class="button is-primary is-fullwidth" @click="board.exit()">
            Exit
          </button>
        </div>
        
      </div>
      </div>


      
    <div style="align-content: center" v-if="!board.table">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels-creator">
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          0
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          1
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          2
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          3
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          4
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          5
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          6
        </div>
        <div class="game-board-label row" style="align-self: center; justify-content: center">
          7
        </div>
      </div>
    </div>
    <div style="justify-self: right" v-if="!board.table">
      <div class="game-board-col-labels-creator">
        <div class="game-board-label col" style="display: flex; justify-content: center">0</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">1</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">2</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">3</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">4</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">5</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">6</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">7</div>
      </div>
      <div class="game-board-creator" id="challenge-board">
        <div class="box" v-for="index in 64" :id="'board-box-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)">
          <PieceStackCreator :id="'piece-stack-' + Math.floor((index - 1) / 8) + '-' + ((index - 1) % 8)"
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieceStackCreator from './PieceStackCreator.vue'

// JS
import { Challenge } from '../store/models/challenge.js'
import { boardCreatorStore } from '../store/boardCreator.js'
import OutPieceStackCreator from './OutPieceStackCreator.vue'
import 'vue3-easy-data-table'
import { authStore } from '../store/authStore.js'

export default {
  components: { PieceStackCreator, OutPieceStackCreator  },
  props: {
    challenge: Object,
  },

  data() {
    return {
      headers: [],
      items: [],
      itemsSelected: [],
      outcomeInput: '',
      board: null
    }
  },

  beforeMount() {
    this.board = boardCreatorStore()
    this.board.generateState()
    this.auth = authStore()
    this.auth.checkAuth()
  },

  mounted() { },

  methods: {
    async submit() {
      var state = this.board.state[this.board.currentKey],
          outOfBoundsState = this.board.outOfBoundsState[this.board.currentKey],
          stateName = document.getElementById('state-name').value
      
      if (stateName == '') {
        alert('Please enter a name for the state.')
        return
      }

      var body = {
        id: 0,
        name: stateName,
        board_state: this.board.serializeState(),
        out_of_bounds_state: {
          color: outOfBoundsState.color,
          content: (outOfBoundsState.color == "stack" ? outOfBoundsState.stack : null),
          king: outOfBoundsState.king
        }
      }
      
      await this.$axios.post(this.$api_link + '/create/board-state', body, this.auth.config)
        .then(response => {
          alert('Board state created successfully!')
          this.$router.go()
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText }});
          return
        })
    },

  },

  watch: {}
}
</script>
