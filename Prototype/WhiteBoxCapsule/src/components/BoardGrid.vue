<script setup>
import BoardProgressBar from './BoardProgressBar.vue'
</script>

<template>
  <div style="display: flex">
    <div>
      <div class="game-board-out">
        <div class="box"></div>
      </div>
    </div>
    <div style="justify-content: center; display: flex; flex-direction: column">
      <div class="game-board" id="challenge-board">
        <div class="box">
          <div class="square square-lg piece red"></div>
        </div>
        <div class="box">
          <div class="square square-lg piece blue"></div>
        </div>
        <div class="box">
          <div class="col piece-overlap">
            <div class="overlap-box">
              <div class="square square-lg piece small red"></div>
            </div>
            <div class="overlap-box">
              <div>3</div>
            </div>
            <div class="overlap-box">
              <div class="square square-lg piece small blue"></div>
            </div>
            <div class="overlap-box">
              <div>10</div>
            </div>
          </div>
        </div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
        <div class="box"></div>
      </div>

      <BoardProgressBar />
    </div>
  </div>
</template>
