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
    style="padding-left: 10px; width: 650px"
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
