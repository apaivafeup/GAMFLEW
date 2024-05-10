<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore'
import PlayerBar from './PlayerBar.vue'
import { Challenge } from '../store/models/challenge'
import { User } from '../store/models/user.js'
import { CodeFile } from '../store/models/code_file'
import { authStore } from '../store/authStore'

export default {
  props: {
    challenge: Challenge,
    user: User,
    code_file: CodeFile,
    playable: Boolean
  },

  data() {
    return {}
  },

  components: { ChallengeCode, BoardGrid, PlayerInfo, PlayerBar },

  async beforeMount() {
    this.board = boardStore()
    this.board.generateState()
  }
}
</script>

<template>
  <div id="board-row" class="justify-content-between"
    style="display: grid; grid-template-rows: 100%; grid-template-columns: 50% 50%;">
    <div class="col"
      style="display: grid; grid-template-rows: 65px 393px 85px 80px; grid-template-columns: 100%; grid-gap: 5px; justify-items: center;">
      <div class="row" style="width: 100%;">
        <div class="alert alert-special player-info" v-if="!board.timeout">
          <p style="margin: 0px; padding: 0px; align-self: center;"><strong>Objective: </strong>{{ this.challenge.objective }}</p>
        </div>
      </div>
      <div class="row" style="display: flex; flex-direction: row; width: 100%;">
        <ChallengeCode :code_file="code_file" style="width: 100%;" />
      </div>
      <div class="row" style="width: 100%;" v-if="!board.passed && board.hint && !board.error">
        <div class="alert alert-secondary player-info" style="width: 100%; overflow-y: scroll; font-size: 14px;" id="#challenge-hint" >
          <p style="margin: 0px; padding: 0px; align-self: center;">
            <b>Hint:</b> {{ this.challenge.hint }}
          </p>
        </div>
      </div>
      <div class="row" style="display: flex; width: 100%; gap: 5px;">
        <PlayerInfo v-if="!board.passed && !board.timeout" style="width: 100%;"/>
        <div v-if="board.failed && !board.timeout && !board.passed" class="alert alert-danger player-info">
          <p id="fail-message" v-if="!board.error" style="margin: 0px; padding: 0px; align-self: center;">
            You didn't pass. You can keep trying, though.
          </p>
          <p v-else id="fail-message" style="margin: 0px; padding: 0px; align-self: center;">
            An error occurred while processing your submission.
            Please contact us for assistance (be sure to include the error message - check your browser's console).
          </p>
        </div>
        <div v-else-if="board.passed && !board.timeout" class="alert alert-success player-info">
          <p style="margin: 0px; padding: 0px; align-self: center;">
            You passed, congratulations! To submit your solution, click the <b>Comment</b> button.
            <em>It's required for your score!</em>
          </p>
        </div>
        <div v-if="board.passed && !board.timeout && !board.achievement" class="alert alert-special-hint player-info">
          <p v-if="challenge.achievement_hint == null" id="achievement-text" style="margin: 0px; padding: 0px; align-self: center;">There is no achievement for this challenge!</p>
          <p v-else id="achievement-text" style="margin: 0px; padding: 0px; align-self: center; "><b>Achievement Hint:</b> {{ challenge.achievement_hint }}</p>
        </div>
        <div v-else-if="board.passed && !board.timeout && board.achievement" class="alert alert-special-hint player-info">
          <p id="achievement-text" style="margin: 0px; padding: 0px; align-self: center;">You have won this Challenge's achievement!</p>
        </div>
      </div>
    </div>
    <div class="col" style="display: flex; flex-direction: column; justify-content: right">
      <BoardGrid :challenge="challenge" :playable="playable"/>
      <PlayerBar :user="user" />
    </div>
  </div>
</template>
