<template>
    <div class="col" v-if="main" style="display: flex; justify-content: center; align-items: center; flex-direction: column">
        <button class="menu-button" @click="switchMenu('challenges')" style="width: 500px">
            Single Player
        </button>
        <button class="menu-button" @click="switchMenu('howTo')" style="width: 500px">
            How To Play
        </button>
        <button class="menu-button" @click="switchMenu('credits')" style="width: 500px">
            Credits
        </button>
    </div>
    <div class="row" v-if="challenges" style="justify-content: center; margin-top: 30px">
        <ChallengesMenu />
    </div>
    <div class="row" v-if="howTo" style="justify-content: center; margin-top: 30px">
        <div class="col" style="display: flex; justify-content: center; align-items: center; flex-direction: column">
            <span>TBD</span>
            <button class="menu-button" @click="switchMenu('main')" style="width: 500px; margin-top: 40px">
                Return
            </button>
        </div>
    </div>
    <div class="row" v-if="credits" style="justify-content: center; margin-top: 30px">
        <div class="col" style="text-align: center">
            <div class="row">
                <h4>Credits</h4>
            </div>
            <div class="row">
                <span><strong>Programming:</strong> <em>Mateus Silva</em></span>
            </div>
            <div class="row">
                <span> <strong>Supervision:</strong> <em>Alexandra Marques, Ana Paiva</em> </span>
            </div>
            <div class="row">
                <span> <strong>Platforms:</strong> <em>Vue3 (HTML + CSS + JS)</em> </span>
            </div>
            <button class="menu-button" @click="switchMenu('main')" style="width: 500px; margin-top: 40px">
                Return
            </button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import ChallengesMenu from './ChallengesMenu.vue'

export default defineComponent({
    components: { ChallengesMenu },

    data() {
    return {
      main: true,
      challenges: false,
      howTo: false,
      credits: false
    }
  },

    methods: {
        switchMenu(target) {
            switch (target) {
                case 'main':
                    this.main = true
                    this.challenges = false
                    this.howTo = false
                    this.credits = false
                    break
                case 'challenges':
                    this.main = false
                    this.challenges = true
                    this.howTo = false
                    this.credits = false
                    break
                case 'howTo':
                    this.main = false
                    this.challenges = false
                    this.howTo = true
                    this.credits = false
                    break
                case 'credits':
                    this.main = false
                    this.challenges = false
                    this.howTo = false
                    this.credits = true
                    break
            }
        }
    }
})
</script>
