<script>
import GameCredits from './GameCredits.vue'
import { authStore } from '../store/authStore.js'

export default {
  methods: {
  },
}
</script>

<template>
  <div class="col" style="height: 100%;
  overflow-y: hidden;display: inline-grid; grid-template-rows: 50% 50%; place-self: center; height: 100vh; width: 100%; overflow: hidden;">
    <div class="row" style="display: inline-grid; grid-template-columns:50% 50%; place-self: center; grid-template-rows: 100% 100%; align-content:center; vertical-align:middle; justify-content: center;min-width: 100%;">
      <div class="col" style="display: flex; flex-direction: column;">
        <h1 style="font-size: 72px; font-family: 'Inter'; font-weight: 'bold';color:#8647d4;"> <strong>404</strong> </h1>
        <h2 style="font-size: 56px; font-family: 'Inter'; font-weight: 'bold';color:#8647d4;"> <em>Not Found</em></h2>
      </div>
      <div class="col">
        <img src="../assets/pictures/logo.png" style="width:100%;margin-top:30px;">
        <p style="margin-top: 5px; text-align: center; font-size: 26px; font-family: 'Inter'; font-weight: 'bold'; color: #8647d4;"><strong>GAM</strong>e <strong>F</strong>or <strong>LE</strong>arning <strong>W</strong>hite-box testing</p>
      </div>
    </div>
    <div class="row" style="margin-top: -1vh; display: flex; flex-direction: column; text-align: center; justify-content: center; font-size: 32px;">
      <p style="margin-bottom: 0px;">
        You've either taken a wrong turn into the void or some error has occurred.
      </p>
      <p style="margin-bottom: 0px;">
        Please go somewhere else or try again later.
      </p>
      <p style="margin-top: 22.5vh; font-size: 12px;">
        You can also go Home by clicking <a href="/">here</a>.
      </p>
    </div>
  </div>
</template>
