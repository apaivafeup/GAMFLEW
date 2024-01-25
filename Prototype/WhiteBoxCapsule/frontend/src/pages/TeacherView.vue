<script setup>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
</script>

<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardChecker from '../components/BoardChecker.vue'
import { boardCreatorStore } from '../store/boardCreator'

import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";

export default {
  async beforeMount() {
    this.boardCreator = boardCreatorStore()

    await this.$axios.get(this.$api_link + '/board-states').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
      })
    })
  },

  data() {
    return {
      boardStates: [],
      selectedState: '',
      stateName: '',
      codeName: '',
      codeString: '// Placeholder code\n\nfunction hello() {\n  console.log("Hello World!");\n}\n\nhello();'
    }
  },

  methods: {
    async submit() {
      var body = {
        id: 0,
        name: this.codeName,
        content: this.codeString
      }
      
      await this.$axios.post(this.$api_link + '/create/code-file', body)
        .then(response => {
          console.log(response)
          console.log(body)
        });
    },

    selectState(id) {
      this.selectedState = id
      this.boardCreator.changeState(this.boardStates[id - 1])
    }

  },
  components: {
    Menu,
    'code-editor': CodeEditor,
    BoardChecker
  }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h2>Teacher View</h2>
  </div>
  <div class="container" style="display: flex; justify-content: center;">
    <div class="row" style="width: 525px; justify-content: center; display: flex; flex-direction: column;">
      <div class="col">

      </div>
      <div class="col">
        <div class="row" style="width: 100%; margin: 0px;">
          <h6 style="padding: 0px; margin-bottom: 5px;">Board State</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Choose an existing board state below.</p>
        </div>
        <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
          <select style="padding: 5px;">
            <option @click="this.selectState(state.id)" v-for="state in boardStates" :value="state.id">{{state.name}}</option>
          </select>
        </div>
        <div class="row" style="padding: 0px; margin: 0px;">
          <BoardChecker />
        </div>
      </div>
    </div>
  </div>
</template>
