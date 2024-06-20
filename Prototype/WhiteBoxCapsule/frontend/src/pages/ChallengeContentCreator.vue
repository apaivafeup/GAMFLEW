<script>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import BoardCreator from '../components/BoardCreator.vue'
import { boardCreatorStore } from '../store/boardCreator.js'

import hljs from 'highlight.js';
import CodeEditor from "simple-code-editor";
import { authStore } from '../store/authStore.js'

import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';

export default {
  async beforeMount() {
    let loader = this.$loading.show({
      color: '#A959FF',
      container: this.fullPage ? null : this.$refs.formContainer,
      transition: 'fade',
      canCancel: true,
      freezeScroll: true,
      onCancel: this.onCancel,
      opacity: 0.9,
      blur: '50px'
    },
      {
        default: h(resolveComponent('LoadingIcon'))
      });

    this.boardCreator = boardCreatorStore()
    this.auth = authStore()
    this.auth.checkAuth()

    await this.getBoardStates()
    await this.getCodeFiles()

    if (this.$error) {
      loader.hide()
      return
    }

    loader.hide()
  },

  data() {
    return {
      boardCreator: null,
      board: true,
      details: false,
      code: false,
      boardStates: [],
      codeFiles: [],
      selectedStateId: 0,
      selectedState: '',
      stateName: '',
      selectedCodeId: -1,
      selectedCodeString: '',
      submittedBoard: false,
      submittedCode: false,
      codeName: '',
      codeString: '// Placeholder code\n\nfunction hello() {\n  console.log("Hello World!");\n}\n\nhello();',
      defaultCodeString: '// Placeholder code\n\nfunction hello() {\n  console.log("Hello World!");\n}\n\nhello();'
    }
  },

  methods: {
    async getCodeFiles() {
      await this.$axios.get(this.$api_link + '/code-files/', this.auth.config).then((response) => {
      response.data.forEach((codeFile) => {
        this.codeFiles.push(codeFile)
      })
      this.codeFilesDropdownClick(-1);
    }).catch((error) => {
      this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
      this.$error = true
    })
    },

    async getBoardStates() {
      await this.$axios.get(this.$api_link + '/board-states', this.auth.config).then((response) => {
        response.data.forEach((board_state) => {
          this.boardStates.push(board_state)
        })
        this.boardStatesDropdownClick(-1);
      }).catch((error) => {
        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
        this.$error = true
      })
    },

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
    },

    boardStatesDropdownClick(id) {
      if (id == -1 || id == -2) {
        this.selectedState = ''
        this.selectedStateId = -1
        this.boardCreator.changeState(this.boardStates[0])
        this.stateName = ''
        return
      }

      this.selectedStateId = id + 1
      this.selectedState = this.boardStates[id].name
      this.stateName = this.boardStates[id].name
      this.boardCreator.changeState(this.boardStates[id])
    },

    codeFilesDropdownClick(id) {
      if (id == -1 || id == -2) {
        this.codeString = this.defaultCodeString
        this.codeName = ''
        return
      }

      this.selectedCodeId = id + 1
      this.codeName = this.codeFiles[id].name
      this.codeString = this.codeFiles[id].content
    },

    async deleteBoardState() {
      await this.$axios.delete(this.$api_link + '/board-state/' + this.selectedStateId, this.auth.config)
        .then(response => {
          alert('Board state deleted successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when deleting the board state. Please try again later.')
        })
    },

    async updateBoardState() {
      var board_state = {
        id: this.selectedStateId,
        name: this.stateName,
        board_state: this.boardCreator.serializeState(),
        out_of_bounds_state: {
          color: this.boardCreator.outOfBoundsState[this.boardCreator.currentKey].color,
          content: (this.boardCreator.outOfBoundsState[this.boardCreator.currentKey].color == "stack" ? this.boardCreator.outOfBoundsState[this.boardCreator.currentKey].stack : null),
          king: this.boardCreator.outOfBoundsState[this.boardCreator.currentKey].king
        }
      }

      await this.$axios.post(this.$api_link + '/update/board-state/' + this.selectedStateId, board_state, this.auth.config)
        .then(response => {
          alert('Board state updated successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when updating the board state. Please try again later.')
        })
    },

    async deleteCodeFile() {
      await this.$axios.delete(this.$api_link + '/code-file/' + this.selectedCodeId, this.auth.config)
        .then(response => {
          alert('Code file deleted successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when deleting the code file. Please try again later.')
        })
    },

    async updateCodeFile() {
      var code_file = {
        id: this.selectedCodeId,
        name: this.codeName,
        content: this.codeString
      }

      await this.$axios.post(this.$api_link + '/update/code-file/' + this.selectedCodeId, code_file, this.auth.config)
        .then(response => {
          alert('Code file updated successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when updating the code file. Please try again later.')
        })
    },

    async submit() {
      var body = {
        id: 0,
        name: this.codeName,
        content: this.codeString,
        dictionary: {}
      }

      if (this.codeName == '') {
        alert('Please enter a name for the code file.')
        return
      }

      if (this.codeString == '') {
        alert('Please enter code for the code file.')
        return
      }

      if (this.codeName == '') {
        alert('Please enter a name for the code file.')
        return
      }

      await this.$axios.post(this.$api_link + '/create/code-file', body, this.auth.config)
        .then(response => {
          alert('Code file created successfully!')
          this.$router.go()
        })
        .catch((error) => {
          alert('An error occurred when creating the code file. Please try again later.')
        })
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
  <div class="row" style="justify-content: center; margin-bottom: 5px;">
    <button class="menu-button" id="board-button" v-if="!this.board" @click="this.change('board')"
      style="width: 30%; padding: 5px; font-size: 16px;">
      Board State
    </button>
    <button class="menu-button selected" id="board-button" v-else style="width: 30%; padding: 5px;  font-size: 16px;">
      Board State
    </button>
    <button class="menu-button" id="code-button" v-if="!this.code" @click="this.change('code')" style="width: 30%;  font-size: 16px;">
      Code
    </button>
    <button class="menu-button selected" id="code-button" v-else style="width: 30%;  font-size: 16px;">
      Code
    </button>
    <button class="menu-button" id="challenge-manager-button" style="width: 30%;  font-size: 16px;" @click="this.$router.push({name: 'challenge-manager'})">
      Challenge Manager
    </button>

  </div>
  <div class="row" style="justify-content: center;">
    <div class="col" style="flex: 0 0 0%;" v-if="board">
      <div class="row"
        style="width: 450px; margin-bottom: 15px; display: flex; flex-direction: row; align-items: center;  align-content: center; padding: 0px;">
        <h6 style="margin-bottom: 2.5px;">Existing States</h6>
        <select id="existing-states-select" class="guide-button" style="margin-left: 12px; margin-right: 7.5px; padding: 5px; width: 250px;" v-model="selectedStateId" @change="boardStatesDropdownClick(selectedStateId - 1)" >
          <option selected="selected" disabled hidden :value="-1"> -- select an option -- </option>
          <option :id="state.name.toLowerCase().replaceAll(' ', '-') + '-option'" v-for="state in boardStates" :value="state.id">
            {{ state.name }}
          </option>
        </select>
        <button class="guide-button" style="width: 75px; margin: 0px; margin-right: 7.5px;" v-if="selectedStateId > 4"
          @click="deleteBoardState()">
          Delete
        </button>
        <button class="guide-button disabled" style="width: 75px; margin: 0px; margin-right: 7.5px;" v-else>
          Delete
        </button>
        <button class="guide-button" style="width: 75px; margin: 0px;" v-if="selectedStateId > 4"
          @click="updateBoardState()">
          Update
        </button>
        <button class="guide-button disabled" style="width: 75px; margin: 0px;" v-else>
          Update
        </button>
      </div>
      <div class="row" style="width:450px;">
        <h6 style="margin-bottom: 2.5px;">State Name</h6>
        <p style="margin-bottom: 5px; font-size: 10px;">Enter the name for a new state in the input below.<br />If you
          click submit, this name
          will be used.</p>
        <input type="text" placeholder="Write name here." class="is-primary" id="state-name" name="state-name"
          style="width: 400px; height: 40px; margin-bottom: 5px; margin-left: calc(0.5 * var(--bs-gutter-x));"
          v-model="stateName">
      </div>
    </div>
    <div class="col" style="flex: 0 0 0%;" v-if="code">
      <div class="row">
        <h3>Code Snippets</h3>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Code File Name</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">Enter the name for a new code file in the input below. If you click submit, this
          name
          will be used.</p>
      </div>
      <div class="row" style="align-items: center; margin-bottom: 5px;">
        <div class="col" style="width: 80%!important; flex: 8;">
          <input type="text" class="is-primary guide-button" v-model="codeName" placeholder="Write name here."
            id="code-file-name" name="state-name" style="width: 100%; height: 31.1px;">
        </div>
        <div class="col" style="width: 20%!important; flex: 2;">
          <button style="margin-left: 0px; width: 90%; margin-right: calc(var(--bs-gutter-x) * 0.5);"
            id="submit-code-file-button" class="button is-primary is-fullwidth" @click="submit()">
            Submit
          </button>
        </div>
      </div>
      <div class="row">
        <h6 style="margin-bottom: 2.5px;">Code</h6>
      </div>
      <div class="row" style="font-size: 10px;">
        <p style="margin-bottom: 5px;">
          Develop the code in an IDE, and paste it on the right. Please mind formatting.
          See how it looks!
        </p>
      </div>
      <div class="row">
        <CodeBlock id="code-block-example" class="line-numbers" theme="default" height="390px" data-line="1"
          :prismjs="true" :name="name" :code="codeString" lang="javascript" prism-js
          style="width: 650px; font-size: 16px; overflow: scroll; margin-left: 5.5px; margin-right: 5px;"
          :copy-icon="false" :copy-button="false" :copy-tab="false" :tabs="false" />
      </div>
    </div>
    <div class="col" style="flex: 0 0 0%;">
      <BoardCreator v-if="board" />
      <div v-if="code"
        style="margin-bottom: 5px; display: flex; flex-direction: column; align-items: start; align-content: start;">
        <div class="row">
          <h6 style="margin-bottom: 2.5px;">Existing Code Files</h6>
        </div>
        <div class="row"
          style="margin: 0px; padding: 0px; display: flex; flex-direction: row; align-items: center; align-content: center;">
          <select id="existing-code-files-select" class="guide-button" style="margin-right: 7.5px; padding: 5px; width: 335px;" v-model="selectedCodeId" @change="codeFilesDropdownClick(selectedCodeId - 1)">
            <option selected="selected" :value="-1"> -- select an option -- </option>
            <option :id="file.name.toLowerCase().replaceAll(' ', '-') + '-option'" v-for="file in codeFiles" :value="file.id">
              {{ file.name }}
            </option>
          </select>
          <button class="guide-button" style="width: 100px; margin: 0px; margin-right: 7.5px;" v-if="selectedCodeId > 7"
            @click="deleteCodeFile()">
            Delete
          </button>
          <button class="guide-button disabled" style="width: 100px; margin: 0px; margin-right: 7.5px;" v-else>
            Delete
          </button>
          <button class="guide-button" style="width: 100px; margin: 0px;" v-if="selectedCodeId > 7"
            @click="updateCodeFile()">
            Update
          </button>
          <button class="guide-button disabled" style="width: 100px; margin: 0px;" v-else>
            Update
          </button>
        </div>

      </div>
      <code-editor id="code-editor" max-height="487.5px"
        style="width: 550px !important; max-height: 487.5px; overflow: scroll; border-radius: 12px; border: var(--box-border); background: var(--bs-gray-100);"
        theme="stackoverflow-light" :line-nums="true" v-model="codeString" v-if="code">
      </code-editor>
    </div>

  </div>
</template>
