<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore'
import PlayerBar from './PlayerBar.vue'
import { Challenge } from '../store/models/challenge'
import { User } from '../store/models/user.js'
import { CodeFile } from '../store/models/code_file'
import axios from 'axios'

export default {
  props: {
    challenge: Challenge,
    user: User,
    code_file: CodeFile
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
  <div id="board-row" class="justify-content-between" style="display: flex; flex-direction: row">
    <div class="col">
      <div class="alert alert-warning player-info" v-if="!board.timeout">
        {{ this.challenge.objective }}
      </div>

      <ChallengeCode :code_file="code_file" />
      <div
        class="alert alert-secondary player-info"
        v-if="board.timer > 100 && !board.timeout && !board.passed"
      >
        <p style="margin: 0px">
          You will get a hint when the timer reaches <b>100 seconds</b>. Try your best, and if you
          don't pass until then, know help is coming!
        </p>
      </div>
      <div
        class="alert alert-secondary player-info"
        v-else-if="!board.timeout && board.timer <= 100 && !board.passed"
      >
        {{ this.challenge.hint }}
      </div>
      <PlayerInfo v-if="!board.passed && !board.timeout" />
      <div v-if="board.timeout" class="alert alert-danger player-info">
        Game over! You ran out of time. Try again!
      </div>
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
      <BoardGrid :challenge="this.challenge" />
      <PlayerBar :user="this.user" />
    </div>
  </div>
</template>
