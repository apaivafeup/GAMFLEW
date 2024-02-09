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
      selectedInput: '',
      testCasesCount: 1,
      badgeCount: 1,
      inputBadge: 1,
      selectedBadge: '',
      dictionary: {
        'board': 'input[X]',
        'board_spot': 'input.state[X][I][J]',
        'log': 'input.log[X][input.log[X].length - 1]',
        "less": '<',
        'greater': '>',
        'equal': '=',
        'equality': '==',
        'inequality': '!=',
        'not': '!',
        'and': '&&',
        'or': '||',
        "open_par": '(',
        "close_par": ')',
        'out_of_bounds': 'input.outOfBoundsState',
        'isTriangle': 'utils.isTriangle(I, J, M)',
        'distance': 'utils.distance(I, J)',
        'count_blue_pieces': 'utils.count_blue_pieces(L, I)',
        'count_red_pieces': 'utils.count_red_pieces(L, I)',
        'count_empty_spaces': 'utils.count_empty_spaces(L, I)',
        'find_first_red_piece': 'utils.find_first_red_piece(L, I)',
        'find_first_blue_piece': 'utils.find_first_blue_piece(L, I)',
        'find_first_stack': 'utils.find_first_stack(L, I)',
        'find_blue_pieces': 'utils.find_blue_pieces(L, I)',
        'find_red_pieces': 'utils.find_red_pieces(L, I)',
        'find_stacks': 'utils.find_stacks(L, I)',
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

    addWildcardBadge() {
      var row = document.getElementById('validation-expression-row'),
          badge = document.createElement('span')

      badge.setAttribute('id', 'value-badge-' + this.inputBadge)
      badge.setAttribute('class', 'badge text-bg-wildcard')
      badge.setAttribute('style', 'display: inline-flex; width: auto; align-self: center;')

      var button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.setAttribute('class', 'btn-close')
      button.setAttribute('id', 'close-btn-' + this.badgeCount)
      button.style = 'margin-right: 2.5px;'

      badge.innerHTML = button.outerHTML + this.addValueBadge(this.badgeCount)
      row.appendChild(badge)

      document.getElementById('close-btn-' + this.badgeCount).onclick = function () {
        if (!this.parentElement.classList.contains('text-bg-input')) {
          for (var c = 1; c < this.parentElement.children.length; c++) {
            var child = this.parentElement.children[c]
            if (!isNaN(child.innerHTML))
              document.getElementById('value-badge-row-' + child.getAttribute('value-input')).remove()
          }
        }
        this.parentElement.remove()
      }

      this.badgeCount += 1

    },

    addInputBadge(placeholder) {
      var col = document.getElementById('value-badges-inputs')
      var row = document.createElement('div')
      row.setAttribute('class', 'row')
      row.setAttribute('id', 'value-badge-row-' + this.inputBadge)
      row.setAttribute('class', 'value-badge-row')
      row.setAttribute('style', 'display: flex;')

      var div, input
      div = document.createElement('div')
      div.setAttribute('style', 'display: flex; flex-wrap: nowrap; width: auto; align-self: center;')
      div.innerHTML = 'Value ' + this.inputBadge + ':'
      input = document.createElement('input')
      input.setAttribute('id', 'value-badge-input-' + this.inputBadge)
      input.setAttribute('type', 'text')
      input.setAttribute('class', 'box')
      input.setAttribute('style', 'width: 85%; max-width: auto;')
      input.value = placeholder

      row.innerHTML = div.outerHTML + input.outerHTML
      col.appendChild(row)
    },

    addValueBadge(placeholder) {
      var badge = document.createElement('span')
      //badge.setAttribute('id', 'expression-badge-' + this.badgeCount)
      badge.setAttribute('class', 'badge text-bg-values')

      if (!isNaN(placeholder)) {
        badge.setAttribute('value-input', this.inputBadge)
        this.addInputBadge(this.inputBadge)
        placeholder = this.inputBadge
        this.inputBadge += 1
      }

      badge.onclick = function () {
        this.remove()
      }

      badge.innerHTML = placeholder
      return badge.outerHTML
    },

    addBadge(key, type) {
      var row = document.getElementById('validation-expression-row'),
        badge = document.createElement('span')

      badge.setAttribute('class', 'badge text-bg-' + type)
      badge.setAttribute('id', 'expression-badge-' + this.badgeCount)

      var boardAccess = 'case_num'
      if (this.testCasesCount == 1) {
        boardAccess = 'input.currentKey'
      }

      var html = this.dictionary[key]

      if (html.includes('I') && html.includes('J')) {
        html = html.replace('I', this.addValueBadge(this.badgeCount))
      } else {
        html = html.replace('I', this.addValueBadge(boardAccess))
      }

      if (html.includes('J')) {
        html = html.replace('J', this.addValueBadge(this.badgeCount))
      }

      if (html.includes('M')) {
        html = html.replace('M', this.addValueBadge(this.badgeCount))
      }

      html = html.replaceAll('X', this.addValueBadge(boardAccess))
      html = html.replace('L', this.addValueBadge('input'))

      var button = document.createElement('button')
      button.setAttribute('type', 'button')
      button.setAttribute('class', 'btn-close')
      button.setAttribute('id', 'close-btn-' + this.badgeCount)
      button.style = 'margin-right: 2.5px;'

      badge.innerHTML = button.outerHTML + html
      row.appendChild(badge)

      document.getElementById('close-btn-' + this.badgeCount).onclick = function () {
          for (var c = 1; c < this.parentElement.children.length; c++) {
            var child = this.parentElement.children[c]
            if (!isNaN(child.innerHTML))
              document.getElementById('value-badge-row-' + child.getAttribute('value-input')).remove()
              if (this.selectedBadge == this.parentElement.getAttribute('id'))
                this.selectedBadge = ''
          }
        this.parentElement.remove()
      }

      badge.onclick = () => {
        this.selectSwitchBadge(badge)
      }
      this.badgeCount += 1
    },

    selectSwitchBadge(badge) {
      if (this.selectedBadge == badge.getAttribute('id') || document.getElementById(badge.getAttribute('id')) == null || document.getElementById(this.selectedBadge) == null) {
        this.selectedBadge = ''
        return
      }

      if (this.selectedBadge == '') {
          this.selectedBadge = badge.getAttribute('id')
      } else {
        var secondBadge = document.getElementById(badge.getAttribute('id')),
            firstBadge = document.getElementById(this.selectedBadge),
            parent = document.getElementById('validation-expression-row'),
            temp = document.createComment('')

        parent.insertBefore(temp, firstBadge) 
        secondBadge.replaceWith(temp)
        firstBadge.replaceWith(secondBadge)
        temp.replaceWith(firstBadge)

        this.selectedBadge = ''
      }
    },

    changeCount(event) {
      var holder = document.getElementById('validation-expression-row'),
          newValue 

      this.testCasesCount = event.target.value

      if (this.testCasesCount > 1) {
        newValue = 'case_num'
      } else if (this.testCasesCount == 1) {
        newValue = 'input.currentKey'
      }

      for (var badge of holder.children) {
        var children = badge.children
        for (var child of children) {
          if (child.classList.contains('text-bg-values') && (child.innerHTML == 'input.currentKey' || child.innerHTML == 'case_num')) {
            child.innerHTML = newValue
          }
        }
      }
    },

    makeExpression() {
      var expression = document.getElementById('validation-expression-row').textContent
      
      for (let i = 1; i < this.badgeCount; i++) {
        if (document.getElementById('value-badge-input-' + i).value == '') {
          alert('Please fill Value ' + i + '.')
          return
        }

        expression = expression.replaceAll(i, document.getElementById('value-badge-input-' + i).value)
      }

      console.log(expression)
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
          <select class="button is-primary guide-button" style="width: 650px;">
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
          <select class="button is-primary guide-button">
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
    <div class="row" style="font-size: 10px;">
      <p style="margin-bottom: 5px;">If a submission is correct, the expression must return True.</p>
    </div>
    <div class="row">
      <div class="col">
        <div class="box" id="validation-expression-row"
          style="display: inline-block; padding: 5px; margin: 0px; margin-bottom: 5px; width: 100%; min-height: 600px;">
        </div>
      </div>
      <div class="col">
        <div class="row" style="margin-bottom: 5px;">
          <div style="width: 50%;">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Test Cases Count</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">Challenges with multiple cases require different function calls.</p>
            </div>
            <div class="row" style="margin: 0px;">
              <input style="margin-left: 0px; margin-right: 0px;" class="box" type="number" min="1" max="10" value="1"
                :v-model="this.testCasesCount" @change="this.changeCount($event)" />
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px; text-align: justify;">For challenges of only 1 test case, only 1 board is needed.
                <em>currentKey</em> then represents the one existing board state. In challenges with more cases, <em>case_num</em>
                is used as an iterator. All board states are covered in validation!
              </p>
            </div>
          </div>
          <div style="width: 50%">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Board State</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">Everything related to the board is accessible here.</p>
            </div>
            <div class="row" style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 30px;">
              <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('board', 'input')">Board Grid
                (8x8)</button>
              <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('board_spot', 'input')">Board Grid
                (X, Y)
              </button>
              <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('log', 'input')">Log
                (Last Movement)</button>
              <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('out_of_bounds', 'input')">Out
                of Bounds Spot</button>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="row">
            <h6 style="text-align: left; margin-bottom: 5px;">Auxiliary Functions</h6>
          </div>
          <div class="row" style="font-size: 10px;">
            <p style="margin-bottom: 5px;">To provide computed values from the board's state. Check the Guide if needed.</p>
          </div>
          <div class="row"
            style="margin: 0px; grid-gap: 5px; display: grid; grid-template-rows: 45px 45px; grid-template-columns: 100px 100px 100px 100px 100px 100px;">
            <button style="padding: 10px 5px;" class="box" @click="addBadge('isTriangle', 'auxiliary')">Triangle</button>
            <button style="padding: 10px 5px;" class="box" @click="addBadge('distance', 'auxiliary')">Euclidean Distance</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('count_blue_pieces', 'auxiliary')"># of Blue Pieces</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('count_red_pieces', 'auxiliary')"># of Red Pieces</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('count_empty_spaces', 'auxiliary')">Empty Spaces</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_first_red_piece', 'auxiliary')">1st Red Piece</button>
            <!--TODO: add the piece accessors - like color and position and shit, same as going through the board, I guess? -->
            <!--TODO: validation of the expression logic (try catch, errors/exceptions, etc) -->
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_first_blue_piece', 'auxiliary')">1st Blue Piece</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_first_stack', 'auxiliary')">1st Stack</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_blue_pieces', 'auxiliary')">Blue Pieces</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_red_pieces', 'auxiliary')">Red Pieces</button>
            <button style="padding: 10px 5px;" class="box"
              @click="addBadge('find_stacks', 'auxiliary')">Stacks</button>
              <button style="padding: 10px 5px;" class="box"
            @click="addWildcardBadge()">
            Add Wildcard
          </button>
          </div>
        </div>
        <div class="row" style="margin-bottom: 5px;">
          <div class="col">
            <div class="row">
              <h6 style="text-align: left; margin-bottom: 5px;">Operators</h6>
            </div>
            <div class="row" style="font-size: 10px;">
              <p style="margin-bottom: 5px;">To create Boolean expressions.</p>
            </div>
            <div class="row"
              style="margin: 0px; display: grid; grid-gap: 5px; grid-template-rows: 45px 45px; grid-template-columns: 150px 150px 150px 150px;">
              <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('less', 'operators')">
                &lt; (LESS THAN)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('greater', 'operators')">>
                    (GREATER THAN)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('equal', 'operators')">=
                    (EQUAL)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box"
                    @click="addBadge('equality', 'operators')">== (EQUALITY)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box"
                    @click="addBadge('inequality', 'operators')">!= (INEQUALITY)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('not', 'operators')">!
                    (NOT)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('and', 'operators')">&&
                    (AND)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box" @click="addBadge('or', 'operators')">||
                    (OR)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box"
                    @click="addBadge('open_par', 'operators')">( (OPEN PARENTHESIS)</button>
                  <button style="margin-left: 0px; margin-right: 0px;" class="box"
                    @click="addBadge('close_par', 'operators')">) (CLOSE PARENTHESIS)</button>
            </div>
          </div>
        </div>
        <div class="row" style="display: grid;">
          <button class="box" style="text-align: left; padding: 5px;" @click="makeExpression()">
            Validate
          </button>
        </div>
      </div>
    </div>

    <div class="row">
      <h6 style="text-align: left; margin-bottom: 5px;">Values</h6>
    </div>
    <div class="row" style="font-size: 10px;">
      <p style="margin-bottom: 5px;">Fill the values here.</p>
    </div>
    <div class="row">
      <div class="col" id="value-badges-inputs">

      </div>
    </div>
  </div>
</template>
