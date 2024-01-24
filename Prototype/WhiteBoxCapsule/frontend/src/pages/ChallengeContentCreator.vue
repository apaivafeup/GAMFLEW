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
import BoardCreator from '../components/BoardCreator.vue'
import { boardCreatorStore } from '../store/boardCreator'

import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";

export default {
  async beforeMount() {
    this.board = boardCreatorStore()

    await this.$axios.get(this.$api_link + '/board-states').then((response) => {
      response.data.forEach((board_state) => {
        this.boardStates.push(board_state)
      })
      this.dropdownClick(0, true);
    })
  },

  data() {
    return {
      board: true,
      details: false,
      code: false,
      boardStates: [],
      selectedState: '',
      stateName: '',
      codeName: '',
      codeString: '// Placeholder code\n\nfunction hello() {\n  console.log("Hello World!");\n}\n\nhello();'
    }
  },

  methods: {
    change(state) {
      var current = (this.board ? 'board' : (this.details ? 'details' : 'code'))

      if (state == 'board') {
        this.board = !this.board
        this.details = false
        this.code = false
      } else if (state == 'details') {
        this.board = false
        this.details = !this.details
        this.code = false
      } else if (state == 'code') {
        this.board = false
        this.details = false
        this.code = !this.code
      }

      document.getElementById(current + '-button').classList.toggle('selected')
      document.getElementById(state + '-button').classList.toggle('selected')
    },

    toggleDropdown() {
      document.getElementById('dropdown-menu-states').classList.toggle('show')
      document.getElementById('dropdown-menu-states').style.display = (document.getElementById('dropdown-menu-states').style.display == '' ? 'block' : '')
      document.getElementById('dropdown-menu-states').style.position = 'absolute'
      document.getElementById('dropdown-menu-states').style.inset = '0px auto auto 0px'
      document.getElementById('dropdown-menu-states').style.margin = '0px'
      document.getElementById('dropdown-menu-states').style.transform = 'translate3d(12px, 57.6px, 0px)'
    },

    dropdownClick(id, firstTime = false) {
      this.selectedState = this.boardStates[id].name

      if (!firstTime) {
        this.toggleDropdown()
      }

      this.board.changeState(this.boardStates[id])
    },

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

  },
  components: {
    Menu,
    BoardCreator,
    'code-editor': CodeEditor
  }
}
</script>

<template>
  <div class="row" style="text-align: center;">
    <h2>Challenge Content Creator</h2>
  </div>
  <div class="row" style="justify-content: center;">
    <button class="menu-button selected" id="board-button" @click="this.change('board')"
      style="width: 30%; padding: 5px;">
      Board State
    </button>
    <button class="menu-button" id="code-button" @click="this.change('code')" style="width: 30%;">
      Code
    </button>
  </div>
  <div class="row" style="justify-content: center;">
    <div class="col" style="width: 50%;" v-if="board">
      <div class="row">
        <h3>Board States</h3>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Existing States</h6>
      </div>
      <div class="row" style="margin-bottom: 15px;">
        <div class="dropdown">
          <div v-if="this.selectedState != ''" style="font-size: 10px;">
            <p style="margin-bottom: 5px;"><strong>Selected: </strong>{{ this.selectedState }}</p>
          </div>
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false" @click="toggleDropdown()" style="margin: 0px;">
            Load State
          </button>
          <div id="dropdown-menu-states" class="dropdown-menu">
            <button class="dropdown-item" type="button" v-for="state in boardStates" v-bind:key="state.id - 1"
              @click="dropdownClick(state.id - 1)">{{ state.name }}</button>
          </div>
        </div>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">State Name</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Enter the name for a new state in the input below. If you click submit, this name
          will be used.</p>
      </div>
      <div class="row">
        <input type="text" placeholder="Write name here." id="state-name" name="state-name"
          style="width: 700px; height: 30px; margin-bottom: 5px; margin-left: calc(0.5 * var(--bs-gutter-x));">
      </div>
    </div>
    <div class="col" style="width: 50%;" v-if="code">
      <div class="row">
        <h3>Code Snippets</h3>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Code File Name</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Enter the name for a new code file in the input below. If you click submit, this name
          will be used.</p>
      </div>
      <div class="row" style="align-items: center; margin-bottom: 5px;">
        <div class="col" style="width: 80%!important; flex: 8;">
          <input type="text" v-model="codeName" placeholder="Write name here." id="state-name" name="state-name"
            style="width: 100%; height: 31.1px;">
        </div>
        <div class="col" style="width: 20%!important; flex: 2;">
          <button style="margin-left: 0px; width: 90%; margin-right: calc(var(--bs-gutter-x) * 0.5);" id="submit-code-file-button" class="button is-primary is-fullwidth" @click="submit()">
            Submit
          </button>
        </div>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Code</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Develop the code in an IDE, and paste it on the right. Please mind formatting. See
          how it looks!</p>
      </div>
      <div class="row">
        <CodeBlock
                id="code-block-example"
                class="line-numbers"
                theme="default"
                height="390px"
                data-line="1"
                :prismjs="true"
                :name="name"
                :code="codeString"
                lang="javascript"
                prism-js
                style="font-size: 16px; overflow: scroll"
                :copy-icon="false"
                :copy-button="false"
                :copy-tab="false"
                :tabs="false"
              />
      </div>
    </div>
    <div class="col" style="width: 50%;">
      <BoardCreator v-if="board" />
      <code-editor id="code-editor"
        max-height="555px"
        style="width: 100% !important; max-height: 555px; overflow: scroll; border-radius: 12px; border: var(--box-border); background: var(--bs-gray-100);"
        theme="stackoverflow-light" :line-nums="true" v-model="codeString" v-if="code">
      </code-editor>
    </div>

  </div>
</template>
