<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import { testChallenge } from '../assets/challenges/test/testValues.js'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore'
import PlayerBar from './PlayerBar.vue'

export default {
  components: { ChallengeCode, BoardGrid, PlayerInfo, PlayerBar },
  beforeMount() {
    this.board = boardStore()
    this.board.generateState()
    this.testChallenge = testChallenge
  }
}
</script>

<template>
  <div id="board-row" class="justify-content-between" style="display: flex; flex-direction: row">
    <div class="col">
      <div class="alert alert-warning player-info">
        {{ this.testChallenge.objective }}
      </div>

      <ChallengeCode :challenge="this.testChallenge" />
      <div class="alert alert-secondary player-info" v-if="board.timer > 100">
        <p style="margin: 0px">
          You will get a hint when the timer reaches <b>100 seconds</b>. Try your best, and if you
          don't pass until then, know help is coming!
        </p>
      </div>
      <div class="alert alert-secondary player-info" v-else>
        {{ this.testChallenge.hint }}
      </div>
      <PlayerInfo />
      <div v-if="board.failed" class="alert alert-danger player-info">
        You didn't pass. There's still time, though! Keep trying.
      </div>
      <div v-else-if="board.passed" class="alert alert-success player-info">
        You passed! Congratulations!
      </div>
    </div>

    <div class="col" style="display: flex; flex-direction: column; justify-content: right">
      <BoardGrid :challenge="this.testChallenge" />
      <PlayerBar />
    </div>
  </div>
</template>
