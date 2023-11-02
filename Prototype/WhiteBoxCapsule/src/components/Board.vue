<script>
import ChallengeCode from './ChallengeCode.vue'
import BoardGrid from './BoardGrid.vue'
import { testChallenge } from '../assets/challenges/test/testValues.js'
import PlayerInfo from './PlayerInfo.vue'
import { boardStore } from '../store/boardStore'

export default {
  components: { ChallengeCode, BoardGrid, PlayerInfo },
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
      <div class="alert alert-secondary player-info" v-if="board.timer <= 100">
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

    <div class="col">
      <BoardGrid :challenge="this.testChallenge" />
    </div>
  </div>
</template>
