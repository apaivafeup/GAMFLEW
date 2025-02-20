<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore.js'
import PlayerBar from './PlayerBar.vue'
import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { CodeFile } from '../store/models/code_file.js'
import { authStore } from '../store/authStore.js'
import MultiplayerBoardGrid from './MultiplayerBoardGrid.vue'
import Prism from 'prismjs'

export default {
  props: {
    challenge: Object,
    user: User,
    code_file: CodeFile,
    playable: Boolean,
    round: Object,
    can_pass: Boolean,
    timer: Number,
    timer_set: Boolean
  },

  data() {
    return {}
  },

  components: { ChallengeCode, BoardGrid, PlayerInfo, PlayerBar, MultiplayerBoardGrid },

  async beforeMount() {
    this.board = boardStore()
    Prism.highlightAll()
    //console.log('board grid', this.can_pass)
  }
}
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: grid; grid-template-rows: 100%; grid-template-columns: 50% 50%;">
    <div class="col" style="display: grid; grid-template-rows: 65px 393px 85px 80px; grid-template-columns: 100%; grid-gap: 5px; justify-items: center; font-size: 14px;">
      <div class="row" style="width: 100%;" v-if="!board.failed || board.passed">
        <div class="alert alert-special player-info" v-if="!board.timeout">
          <p style="margin: 0px; padding: 0px; align-self: center;"><strong>Objective: </strong>{{ challenge.objective }}</p>
        </div>
      </div>
      <div class="row" style="display: grid; grid-template-columns: 49.5% 49.5%; grid-template-rows: 100%; grid-gap: 7.5px; width: 100%;" v-else-if="board.failed">
        <div class="col" style="padding: 0px; margin: 0px;">
          <div class="alert alert-special player-info" v-if="!board.timeout">
            <p style="margin: 0px; padding: 0px; align-self: center;"><strong>Objective: </strong>{{ challenge.objective }}</p>
          </div>
        </div>
        <div class="col" style="padding: 0px; margin: 0px;">
          <div v-if="board.failed" class="alert alert-danger player-info">
            <p id="fail-message" v-if="!board.error" style="margin: 0px; padding: 0px; align-self: center;">
              You didn't pass. You can keep trying, though.
            </p>
            <p v-else id="fail-message" style="margin: 0px; padding: 0px; align-self: center;">
              An error occurred while processing your submission. Tell your colleagues.
              Please contact us for assistance (be sure to include the error message - check your browser's console).
              If you wish to keep trying still, you can click the <b>Reset</b> button.
            </p>
          </div>
        </div>
        
      </div>

      
      <ChallengeCode :code_file="code_file" style="width: 100%;" />
      <div class="row" style="width: 100%;" v-if="!board.passed && board.hint">
        <div class="alert alert-secondary player-info" style="width: 100%; overflow-y: scroll; font-size: 14px;" id="#challenge-hint" >
          <p style="margin: 0px; padding: 0px; align-self: center;">
            <b>Hint:</b> {{ challenge.hint }}
          </p>
        </div>
      </div>

        <div class="row" style="display: flex; width: 100%; gap: 5px;">
          <div v-if="board.passed && !board.timeout" class="alert alert-success player-info">
            <p style="margin: 0px; padding: 0px; align-self: center;">
              You passed, congratulations!
            </p>
          </div> 
          <PlayerInfo v-if="board.passed && !board.timeout" style="width: 100%;"/>        
        </div>
      </div>
    <div class="col" style="display: flex; flex-direction: column; justify-content: right">
      <MultiplayerBoardGrid :timer_set="timer_set" :challenge="challenge" :can_pass="can_pass" :playable="playable" :round="round" :timer="timer"/>
      <PlayerBar :user="user" />
    </div>
  </div>
</template>
