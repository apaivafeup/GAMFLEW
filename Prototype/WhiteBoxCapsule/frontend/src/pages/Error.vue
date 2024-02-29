<script>
import GameCredits from './GameCredits.vue'
import { authStore } from '../store/authStore'

export default {
  props: {
    code: String,
    message: String
  },

  beforeMount() {
    console.log(this.code, this.message)

    if (this.code == undefined) {
      this.code = 'Error'
      this.message = 'Unknown'
    }
  },

  methods: {
  },
}
</script>

<template>
  <div class="col">
    <div class="row" style="display: inline-grid; grid-template-columns: 50% 50%; place-self: center; grid-template-rows: 100%; align-content:center; vertical-align: middle; justify-content: center; min-width: 100%;">
      <div class="col" style="display: flex; flex-direction: column;">
        <h1 style="font-size: 72px; font-family:'Lemon Milk';color:#8647d4;"> <strong>{{this.code == ''? 'Error' : this.code}}</strong> </h1>
        <h2 style="font-size: 56px; font-family:'Lemon Milk';color:#8647d4;"> <em>{{this.message == '' ? 'Unknown' : this.message}}</em></h2>
      </div>
      <div class="col">
        <img src="https://i.ibb.co/BnR2dGP/logo.png" style="width:100%;margin-top:30px;">
        <p style="margin-top: 5px; text-align: center; font-size: 26px; font-family: 'Lemon Milk'; color: #8647d4;"><strong>GAM</strong>e <strong>F</strong>or <strong>LE</strong>arning <strong>W</strong>hite-box testing</p>
      </div>
    </div>
    <div class="row" style="display: flex; flex-direction: column; text-align: center; justify-content: center; font-size: 32px;">
      <p style="margin-bottom: 0px;">
        You've either taken a wrong turn into the void or some error has occurred.
      </p>
      <p style="margin-bottom: 0px;">
        Please go somewhere else or try again later.
      </p>
      <p style="margin: 0px !important; font-size: 12px;">
        You can also go Home by clicking <a id="home-button" href="/">here</a>.
      </p>
    </div>
  </div>
</template>
