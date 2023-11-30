<template>
  <CodeBlock
    class="line-numbers"
    theme="default"
    max-height="625px"
    data-line="1"
    :prismjs="true"
    :code="code_file.content"
    lang="javascript"
    prism-plugin
    prism-js
    style="font-size: 16px"
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
import { CodeFile } from '../store/models/code_file'

export default {
  components: {},
  props: {
    code_file: CodeFile
  }
}
</script>
