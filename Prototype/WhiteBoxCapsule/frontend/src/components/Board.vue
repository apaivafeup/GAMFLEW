<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore'
import PlayerBar from './PlayerBar.vue'
import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { CodeFile } from '../store/models/code_file.js'
import { authStore } from '../store/authStore.js'

export default {
  props: {
    challenge: Challenge,
    user: User,
    code_file: CodeFile,
    playable: Boolean,
    beat_challenge: Boolean
  },

  data() {
    return {
      objective: true,
    }
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
      style="display: grid; grid-template-rows: 90px 393px 85px 55px; grid-template-columns: 100%; grid-gap: 5px; justify-items: center;">
      <div class="row" style="width: 100%;">
        <div class="alert alert-special player-info" v-if="!board.timeout && objective" style="font-size: 14px; display: flex; justify-content: space-between; flex-direction: row;">
          <p style="margin: 0px; padding: 0px; align-self: center;"><strong>Objective: </strong>{{ challenge.objective }}</p>
          <button class="button" @click="objective = !objective" v-if="beat_challenge" style="border-style: solid;
          border: double 1px transparent;
          background-image: linear-gradient(to left, rgb(169, 216, 238), rgb(169, 216, 238)),
                            linear-gradient(to right, rgb(107, 196, 237), rgb(107, 196, 237));
          background-origin: border-box;
          padding: 7.5px 5px;
          border-radius: 50px;
          background-clip: padding-box, border-box;">
            <font-awesome-icon icon="award" />
            Achievement
          </button>
          <button class="button disabled" v-else style="border-style: solid;
          border: double 1px transparent;
          background-image: linear-gradient(to left, rgb(169, 216, 238), rgba(225, 209, 241, 1)),
                            linear-gradient(to right, rgb(186, 143, 229), rgb(107, 196, 237));
          background-origin: border-box;
          padding: 10px 5px;
          border-radius: 50px;
          background-clip: padding-box, border-box;">
            <font-awesome-icon icon="award" />
            Achievement
          </button>
        </div>
        <div v-else-if="!board.timeout" class="alert alert-special-hint player-info" style="display: grid; grid-template-columns: 85% 15%;">
          <p v-if="challenge.achievement_hint == null" id="achievement-text" style="font-size: 14px; margin: 0px; padding: 0px; align-self: center;">There is no achievement for this challenge!</p>
          <p v-else id="achievement-text" style="font-size: 14px; margin: 0px; padding: 0px; align-self: center; "><b>Achievement Hint:</b> {{ challenge.achievement_hint }}</p>
          <button class="button" @click="objective = !objective" style="border: double 1px transparent;
          background-image: linear-gradient(to right, rgba(225, 209, 241, 1), rgba(225, 209, 241, 1)),
                            linear-gradient(to left, rgb(186, 143, 229), rgb(186, 143, 229));
          background-origin: border-box;
          padding: 7.5px 5px;
          border-radius: 50px;
          background-clip: padding-box, border-box;">
            <font-awesome-icon icon="bullseye" />
            Objective
          </button>
        </div>
      </div>
      <div class="row" style="display: flex; flex-direction: row; width: 100%;">
        <ChallengeCode :code_file="code_file" style="width: 100%;" />
      </div>
      <div class="row" style="width: 100%;" v-if="!board.passed && board.hint && !board.error">
        <div class="alert alert-secondary player-info" style="width: 100%; overflow-y: scroll; font-size: 14px;" id="#challenge-hint" >
          <p style="margin: 0px; padding: 0px; align-self: center;">
            <b>Hint:</b> {{ challenge.hint }}
          </p>
        </div>
      </div>
      <div class="row" style="display: flex; width: 100%; gap: 5px; font-size: 14px;">
        <PlayerInfo v-if="!board.passed && !board.timeout && !board.failed" style="width: 100%;"/>
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
            You passed, congratulations!
          </p>
        </div>
        <div v-if="board.passed && !board.timeout && board.achievement" class="alert alert-special-hint player-info">
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
