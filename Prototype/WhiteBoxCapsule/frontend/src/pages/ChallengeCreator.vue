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
      codeString: '',
      testCasesCount: '',
      badgeCount: 1,
      dictionary: {
        'board': 'input',
        'log': 'input.log[X]',
        "less": '<',
        'greater': '>',
        'equal': '=',
        'equality': '==',
        'inequality': '!=',
        'not': '!',
        'and': '&&',
        'or': '||',
        'out_of_bounds': 'input.outOfBoundsState',
        'isTriangle': 'utils.isTriangle(I, J, K)',
        'distance': 'utils.distance(I, J)',
        'count_blue_pieces': 'utils.count_blue_pieces(input, I)',
        'count_red_pieces': 'utils.count_red_pieces(input, I)',
        'count_empty_spaces': 'utils.count_empty_spaces(input, I)',
        'find_first_red_piece': 'utils.find_first_red_piece(input, I)',
        'find_first_blue_piece': 'utils.find_first_blue_piece(input, I)',
        'find_first_stack': 'utils.find_first_stack(input, I)',
        'find_blue_pieces': 'utils.find_blue_pieces(input, I)',
        'find_red_pieces': 'utils.find_red_pieces(input, I)',
        'find_stacks': 'utils.find_stacks(input, I)',
      }
    }
  },

  methods: {
    // 65 is A, 97 is a
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
    },

    addValueBadge(placeholder) {
      var badge = document.createElement('span')
      badge.setAttribute('id', 'expression-badge-' + this.badgeCount)
      badge.setAttribute('class', 'badge text-bg-values')
      badge.onclick = function () {
        if (!this.classList.contains('text-bg-values'))
          this.remove()
      }
      badge.innerHTML = placeholder
      return badge.outerHTML
    },

    addBadge(key, type) {
      var row = document.getElementById('validation-expression-row')

      var badge = document.createElement('span')
      badge.setAttribute('id', 'expression-badge-' + this.badgeCount)
      badge.setAttribute('class', 'badge text-bg-' + type)
      badge.onclick = function () {
        if (!this.classList.contains('text-bg-values'))
          this.remove()
      }

      var boardAccess = 'caseNum'
      if (this.testCasesCount == 1) {
        boardAccess = 'input.currentKey'
      }

      var html = this.dictionary[key].replace('I', this.addValueBadge(this.badgeCount))
      this.badgeCount = this.badgeCount + 1

      if (html.includes('J')) {
        html = html.replace('J', this.addValueBadge(this.badgeCount))
        this.badgeCount = this.badgeCount + 1
      }

      if (html.includes('K')) {
        html = html.replace('K', this.addValueBadge(this.badgeCount))
        this.badgeCount = this.badgeCount + 1
      }

      html = html.replace('X', boardAccess)

      badge.innerHTML = html

      row.appendChild(badge)
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
    <h2>Challenge Creator</h2>
  </div>
  <div class="container" style="display: flex; justify-content: center; margin-bottom: 10px;">
    <div class="row" style="justify-content: center; display: flex; flex-direction: row;">
      <div class="col">
        <div class="row" style="width: 100%; margin: 0px;">
          <h5 style="padding: 0px; margin-bottom: 5px;">Code File</h5>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Choose an existing code file below.</p>
        </div>
        <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
          <select style="padding: 5px; width: 650px;">
            <option @click="this.selectCode(code.id)" v-for="code in codeFiles" :value="code.id">{{ code.name }}</option>
          </select>
        </div>
        <div class="row" style="width: 100%; padding: 0px; margin: 0px;">
          <CodeBlock id="code-block-example" class="line-numbers" theme="default" height="440px" data-line="1"
            :prismjs="true" :name="name" :code="codeString" lang="javascript" prism-js
            style="font-size: 16px; width: 650px;" :copy-icon="false" :copy-button="false" :copy-tab="false"
            :tabs="false" />
        </div>
      </div>
      <div class="col">
        <div class="row" style="width: 100%; margin: 0px;">
          <h5 style="padding: 0px; margin-bottom: 5px;">Board State</h5>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Choose an existing board state below.</p>
        </div>
        <div class="row" style="width: 100%; margin-left: 0px; margin-bottom: 10px;">
          <select style="padding: 5px;">
            <option @click="this.selectState(state.id)" v-for="state in boardStates" :value="state.id">{{ state.name }}
            </option>
          </select>
        </div>
        <div class="row" style="padding: 0px; margin: 0px;">
          <BoardChecker />
        </div>
      </div>
    </div>
  </div>
  <div class="container" style="display: flex; justify-content: center; flex-direction: column;">
    <div class="row" style="width: 100%; text-align: left; justify-content: start; display: flex;">
      <h5 style="text-align: left; margin-bottom: 5px;">Validation Expression Maker</h5>
    </div>

    <div class="row" style="margin-bottom: 5px;">
      <div class="col">
        <div class="row">
          <h6 style="text-align: left; margin-bottom: 5px;">Test Cases Count</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Challenges with multiple cases require different function calls.</p>
        </div>
        <div class="row" style="margin: 0px;">
          <input style="margin-left: 0px; margin-right: 0px;" class="box" type="number" min="1" max="10" value="1"
            :v-model="testCasesCount" />
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px; text-align: justify;">For challenges of only 1 test case, only 1 board is needed. <em>currentKey</em> then represents 1 existing board state. In challenges with more cases, <em>currentKey</em> is used as an iterator. All board states are covered in validation!</p>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <h6 style="text-align: left; margin-bottom: 5px;">Board State</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">Everything related to the board is accessible here.</p>
        </div>
        <div class="row" style="margin: 0px; display: grid;">
          <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('board', 'input')">Board Grid (8x8)</button>
          <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('log', 'input')">Log (Movements)</button>
          <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('out_of_bounds', 'input')">Out of Bounds Spot</button>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <h6 style="text-align: left; margin-bottom: 5px;">Operators</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">To create Boolean expressions.</p>
        </div>
        <div class="row"
          style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 45px 45px; grid-template-columns: 150px 150px 150px 150px;">
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('less', 'operators')">< (LESS THAN)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('greater', 'operators')">> (GREATER THAN)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('equal', 'operators')">= (EQUAL)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('equality', 'operators')">== (EQUALITY)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('inequality', 'operators')">!= (INEQUALITY)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('not', 'operators')">! (NOT)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('and', 'operators')">&& (AND)</button>
            <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('or', 'operators')">|| (OR)</button>
        </div>
      </div>
    </div>
    <div class="row" style="margin-bottom: 5px;">
      <div class="col">
        <div class="row">
          <h6 style="text-align: left; margin-bottom: 5px;">Auxiliary Functions</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">To provide computed values from the board's state. Check the Guide if needed.</p>
        </div>
        <div class="row"
          style="margin: 0px; grid-gap: 5px; display: grid; grid-template-rows: 45px 45px; grid-template-columns: 150px 150px 150px 150px;">
          <button style="padding: 10px 5px;" class="box" @click="addBadge('isTriangle', 'auxiliary')">isTriangle</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('distance', 'auxiliary')">distance</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('count_blue_pieces', 'auxiliary')">count_blue_pieces</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('count_red_pieces', 'auxiliary')">count_red_pieces</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('count_empty_spaces', 'auxiliary')">count_empty_spaces</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_first_red_piece', 'auxiliary')">find_first_red_piece</button>
          <!--TODO: add the piece accessors - like color and position and shit, same as going through the board, I guess? -->
          <!--TODO: validation of the expression logic (try catch, errors/exceptions, etc) -->
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_first_blue_piece', 'auxiliary')">find_first_blue_piece</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_first_stack', 'auxiliary')">find_first_stack</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_blue_pieces', 'auxiliary')">find_blue_pieces</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_red_pieces', 'auxiliary')">find_red_pieces</button>
          <button style="padding: 10px 5px;" class="box" @click="addBadge('find_stacks', 'auxiliary')">find_stacks</button>
        </div>
      </div>
      <div class="col">
        <div class="row" >
          <h6 style="text-align: left; margin-bottom: 5px;">Mathematical Functions</h6>
        </div>
        <div class="row" style="font-size: 10px;">
          <p style="margin-bottom: 5px;">JavaScript functions. As they're quite extensive, one can simply write them.</p>
        </div>
      </div>
    </div>
    <div class="box" id="validation-expression-row" style="display: flex; margin: 0px; padding-top: 5px; padding-bottom: 5px;">
     

    </div>
    <div class="row" style="font-size: 10px;">
      <p style="margin-bottom: 5px;">If a submission is correct, the expression must return True.</p>
    </div>
  </div>
</template>
