<template>
  <div style="display: flex; justify-content: center;">
    <div style="flex-direction: column; display: flex; justify-content: space-between;">
      <div class="col" style="margin-right: 10px;">
        <div class="game-board-out-labels" v-if="!board.table">
          <div class="game-board-label col" style="display: flex; justify-content: center">Out</div>
        </div>
        <div class="game-board-out-checker">
          <div class="box">
            <OutPieceStackChecker />
          </div>
        </div>
      </div>
    </div>


      
    <div style="align-content: center" v-if="!board.table">
      <div class="game-board-labels">
        <div class="game-board-label col" style="display: flex; justify-content: center; margin-top: 25px"></div>
      </div>
      <div class="game-board-row-labels-checker">
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
      <div class="game-board-col-labels-checker">
        <div class="game-board-label col" style="display: flex; justify-content: center">0</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">1</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">2</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">3</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">4</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">5</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">6</div>
        <div class="game-board-label col" style="display: flex; justify-content: center">7</div>
      </div>
      <div class="game-board-checker" id="challenge-board">
        <div class="box" v-for="index in 64" >
          <PieceStackChecker 
            :x="Math.floor((index - 1) / 8).toString()" :y="((index - 1) % 8).toString()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieceStackChecker from './PieceStackChecker.vue'
import SubmitModal from './modals/SubmitModal.vue'

// JS
import { Challenge } from '../store/models/challenge'
import { boardCreatorStore } from '../store/boardCreator'
import OutPieceStackChecker from './OutPieceStackChecker.vue'
import 'vue3-easy-data-table'
import { auxiliaryFunctions } from '../assets/js/auxiliary_functions'
import { authStore } from '../store/authStore'

export default {
  components: { PieceStackChecker, OutPieceStackChecker, SubmitModal },
  props: {
    challenge: Challenge,
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
  },

  mounted() { },

  methods: {
  },

  watch: {}
}
</script>
