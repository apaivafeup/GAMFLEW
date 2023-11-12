<template>
  <CodeBlock
    class="line-numbers"
    theme="default"
    max-height="625px"
    data-line="1"
    :prismjs="true"
    :code="challenge.file"
    lang="javascript"
    prism-plugin
    prism-js
    style="width: 650px; margin-left: 5px; font-size: 16px"
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
import { Challenge } from '../store/models/challenge'

export default {
  components: {},
  props: {
    challenge: Challenge
  }
}
</script>
