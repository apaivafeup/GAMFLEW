<template>
  <CodeBlock
    class="col line-numbers"
    theme="default"
    height="393px"
    data-line="1"
    :prismjs="true"
    :code="code_file.content"
    lang="javascript"
    prism-plugin
    prism-js
    style="font-size: 16px; overflow: scroll; margin-bottom: 5px"
    :copy-icon="false"
    :copy-button="false"
    :copy-tab="false"
    :tabs="false"
  />
</template>

<script setup>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
</script>

<script>
import { CodeFile } from '../store/models/code_file.js'

export default {
  components: {},
  props: {
    code_file: CodeFile
  },

  async beforeMount() {}
}
</script>
