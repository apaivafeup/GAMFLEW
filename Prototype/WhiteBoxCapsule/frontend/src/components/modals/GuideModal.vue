<template>
  <div
    ref="guideModal"
    class="modal fade"
    id="guide-modal"
    tabindex="-1"
    data-bs-keyboard="false"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content" style="padding: 0px 20px; border-radius: 50px">
        <div
          class="modal-header"
          style="border-color: transparent; text-align: center; padding: 10px"
        >
          <h4 class="modal-title">Guide</h4>
          <button
            id="guide-modal-close-button"
            ref="close"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div v-if="tab == 'board'" style="font-size: 12px !important">
            <div class="row" style="justify-content: space-between">
              <div
                class="col"
                style="
                  margin-bottom: 10px;
                  margin-right: 7.5px;
                  border: #ccc 1px solid;
                  padding: 10px;
                "
              >
                <h6>Test Cases</h6>
                <p style="text-align: justify; margin: 0px">
                  When you click the
                  <button class="button is-primary is-fullwidth">Previous</button> and
                  <button class="button is-primary is-fullwidth">Next</button> buttons, you cycle
                  through different boards - for each challenge, you get as many as you need.
                  <br style="margin-bottom: 5px" />
                  When all your test cases are done, click the
                  <button class="button is-primary is-fullwidth">Submit</button> button to check
                  your answer. <br style="margin-bottom: 5px" />
                  After this, you have to click the
                  <button class="button is-primary is-fullwidth">Comment</button> button and explain
                  your solution - it's required for your attempt to be submitted! And anonymous to
                  other players. <br />
                </p>
              </div>

              <div
                class="col"
                style="
                  margin-bottom: 10px;
                  margin-left: 7.5px;
                  border: #ccc 1px solid;
                  padding: 10px;
                "
              >
                <h6>Interacting with the Board</h6>
                <p style="text-align: justify; margin: 0px">
                  The boards have boxes where pieces can be placed. See below the possible states.
                </p>
                <div
                  class="row"
                  style="display: flex; justify-content: center; margin: 5px 0px 5px 0px"
                >
                  <div
                    class="box"
                    id="board-box-example-red"
                    style="width: 55px; height: 55px"
                  ></div>

                  <div
                    class="box"
                    id="board-box-example-red"
                    style="width: 55px; height: 55px; padding: 0px"
                  >
                    <div
                      class="square square-lg small red"
                      style="
                        height: 45px;
                        width: 45px;
                        border-radius: 100px;
                        border: 1px solid var(--border-color);
                      "
                    ></div>
                  </div>

                  <div
                    class="box"
                    id="board-box-example-blue"
                    style="width: 55px; height: 55px; padding: 0px"
                  >
                    <div
                      class="square square-lg piece blue"
                      style="
                        height: 45px;
                        width: 45px;
                        border-radius: 100px;
                        border: 1px solid var(--border-color);
                      "
                    ></div>
                  </div>
                  <div class="box" id="board-box-example-stack" style="width: 55px; height: 55px">
                    <div class="col piece-overlap">
                      <div class="overlap-box">
                        <div class="square square-lg piece small red"></div>
                      </div>
                      <div class="overlap-box">
                        <div>2</div>
                      </div>
                      <div class="overlap-box">
                        <div class="square square-lg piece small blue"></div>
                      </div>
                      <div class="overlap-box">
                        <div>3</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p style="text-align: justify; margin: 0px">
                  To move a piece, click it and it'll turn purple, like so.
                </p>
                <div
                  class="row"
                  style="display: flex; justify-content: center; margin: 5px 0px 5px 0px"
                >
                  <div
                    class="box"
                    id="board-box-example-selected"
                    style="width: 55px; height: 55px; padding: 0px"
                  >
                    <div
                      class="square square-lg piece selected"
                      style="
                        height: 45px;
                        width: 45px;
                        border-radius: 100px;
                        border: 1px solid var(--border-color);
                      "
                    ></div>
                  </div>
                  <div
                    class="box"
                    id="board-box-example-selected-stack"
                    style="width: 55px; height: 55px"
                  >
                    <div class="col piece-overlap">
                      <div class="overlap-box">
                        <div class="square square-lg piece small selected"></div>
                      </div>
                      <div class="overlap-box">
                        <div>2</div>
                      </div>
                      <div class="overlap-box">
                        <div class="square square-lg piece small selected"></div>
                      </div>
                      <div class="overlap-box">
                        <div>3</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p style="text-align: justify; margin: 0px">
                  Then, click the spot you want to move it to. Stacks can also be moved, but only as
                  a whole. Coordinates follow an <em>(x, y)</em> pattern - <em>x</em> is the row and
                  <em>y</em> is the column.
                </p>
              </div>
            </div>
            <div class="row" style="border: #ccc 1px solid; padding: 10px">
              <h6>Adding Pieces</h6>
              <p style="text-align: justify; margin: 0px; margin-bottom: -10px">
                To add a piece, click the
                <button class="button is-primary is-fullwidth">Add</button> button and then click
                the spot you want to add it to. Each click gives you one of three states: red, blue,
                empty (in that order). <br />
              </p>
              <div class="row" style="display: flex; justify-content: center">
                <img
                  src="../../assets/pictures/add_piece.gif"
                  alt="add-piece"
                  style="width: 80px; margin: 5px 0px 5px 0px"
                />
              </div>
              <p style="text-align: justify; margin: 0px">
                You can add as many pieces as you want, but you can't add pieces to a stack with
                this feature. You can, however, remove the stack altogether (turn it into an empty
                spot) and then add individual pieces. Click the
                <button class="button is-primary is-fullwidth">Add</button> button again to stop
                adding pieces.
              </p>
            </div>
          </div>
          <div v-if="tab == 'auxiliary_functions'" style="font-size: 13px !important">
            <p style="text-align: justify">
              There are a bunch of auxiliary functions that may be used in challenges. These
              functions' code is superfluous to all challenge objectives, but what the functions do
              is not.
            </p>

            <div class="row" style="padding: 10px">
              <button
                :class="
                  name == 'isTriangle'
                    ? 'col button is-primary is-fullwidth guide-button guide-button-selected'
                    : 'col button is-primary is-fullwidth guide-button'
                "
                :id="'guide-button-' + name"
                v-for="name in auxiliaryFunctionsNames"
                @click="selectFunction(name)"
              >
                {{ name }}
              </button>
            </div>
            <div class="row">
              <CodeBlock
                id="code-block-example"
                class="line-numbers"
                theme="default"
                height="314.5px"
                data-line="1"
                :prismjs="true"
                :name="name"
                :code="auxiliaryFunctions[selectedFunction]"
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
        </div>
        <div class="modal-footer row" style="padding: 10px 20px">
          <button
            id="guide-button-1"
            class="col button is-primary is-fullwidth guide-button guide-button-selected"
            @click="changeTab('board', '1')"
          >
            Board
          </button>
          <button
            id="guide-button-2"
            class="col button is-primary is-fullwidth guide-button"
            @click="changeTab('auxiliary_functions', '2')"
          >
            Auxiliary Functions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { boardStore } from '../../store/boardStore'
import { auxiliaryFunctions, auxiliaryFunctionsNames } from '../../assets/js/auxiliary_functions'

export default defineComponent({
  beforeMount() {
    this.tab = 'board'
    this.board = boardStore()
  },

  mounted() {
    this.selectedFunction = this.auxiliaryFunctionsNames[0]
  },

  data() {
    return {
      tab: String,
      selectedFunction: String,
      board: null,
      auxiliaryFunctions: auxiliaryFunctions,
      auxiliaryFunctionsNames: auxiliaryFunctionsNames
    }
  },

  props: {
    placeholder: String
  },

  methods: {
    changeTab(value, button) {
      var button_1 = document.getElementById('guide-button-1'),
        button_2 = document.getElementById('guide-button-2')

      button_1.classList.toggle('guide-button-selected')
      button_2.classList.toggle('guide-button-selected')

      this.tab = value
    },

    selectFunction(name) {
      var old_button = document.getElementById('guide-button-' + this.selectedFunction)
      old_button.classList.toggle('guide-button-selected')

      this.selectedFunction = name

      var button = document.getElementById('guide-button-' + name)
      button.classList.toggle('guide-button-selected')
    },

    archive() {
      //this.$refs.close.click()
    }
  }
})
</script>
