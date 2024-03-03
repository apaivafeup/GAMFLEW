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
import MultiplayerBoardGrid from './MultiplayerBoardGrid.vue'

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

  components: { ChallengeCode, BoardGrid, PlayerInfo, PlayerBar, MultiplayerBoardGrid },

  async beforeMount() {
    this.board = boardStore()
  }
}
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: grid; grid-template-rows: 100%; grid-template-columns: 50% 50%;">
    <div class="col">
      <div class="alert alert-warning player-info" v-if="!board.timeout">
        {{ this.challenge.objective }}
      </div>

      <ChallengeCode :code_file="code_file" />
      <div
        class="alert alert-secondary player-info"
        id="#challenge-hint"
        v-if="!board.passed"
      >
        <p style="margin: 0px">
          <b>Hint:</b> {{ this.challenge.hint }}
        </p>
      </div>
      <PlayerInfo v-if="!board.passed && !board.timeout" />
      <div
        v-if="board.failed && !board.timeout && !board.passed"
        class="alert alert-danger player-info"
      >
        You didn't pass. There's still time, though! Keep trying.
      </div>
      <div v-else-if="board.passed && !board.timeout" class="alert alert-success player-info">
        <p style="margin: 0px">
          You passed, congratulations! To submit your solution, click the <b>Comment</b> button.
          <em>It's required for your score!</em>
        </p>
      </div>
      <div v-if="board.passed && !board.timeout" class="alert alert-special player-info">
        <p style="margin: 0px">A <b>special achievement</b> hint will be here!</p>
      </div>
    </div>
    <div class="col" style="display: flex; flex-direction: column; justify-content: right">
      <MultiplayerBoardGrid :challenge="challenge" :playable="playable "/>
      <PlayerBar :user="user" />
    </div>
  </div>
</template>
