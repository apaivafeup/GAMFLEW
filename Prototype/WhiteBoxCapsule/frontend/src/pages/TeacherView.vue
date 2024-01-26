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
        this.selectedState = 1
      })
    })

    await this.$axios.get(this.$api_link + '/code-files').then((response) => {
      response.data.forEach((codeFile) => {
        this.codeFiles.push(codeFile)
        
        if (codeFile.id == 1) {
          this.selectedCode = 1
          this.codeString = codeFile.content
        }
      })
    })
  },

  data() {
    return {
      boardStates: [],
      codeFiles: [],
      selectedState: '',
      stateName: '',
      selectedCode: '',
      codeString: ''
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
    },

    selectCode(id) {
      this.selectedCode = id
      this.codeString = this.codeFiles[id - 1].content
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
    <div class="row" style="justify-content: center; display: flex; flex-direction: row;">
      <div class="col">
        <div class="row" style="width: 100%; margin: 0px;">
          <h6 style="padding: 0px; margin-bottom: 5px;">Code File</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Choose an existing code file below.</p>
        </div>
        <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
          <select style="padding: 5px; width: 650px;">
            <option @click="this.selectCode(code.id)" v-for="code in codeFiles" :value="code.id">{{code.name}}</option>
          </select>
        </div>
        <div class="row" style="width: 100%; padding: 0px; margin: 0px;">
          <CodeBlock
                id="code-block-example"
                class="line-numbers"
                theme="default"
                height="440px"
                data-line="1"
                :prismjs="true"
                :name="name"
                :code="codeString"
                lang="javascript"
                prism-js
                style="font-size: 16px; width: 650px;"
                :copy-icon="false"
                :copy-button="false"
                :copy-tab="false"
                :tabs="false"
          />
        </div>
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
