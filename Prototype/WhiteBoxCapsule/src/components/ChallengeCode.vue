<template>
  <CodeBlock
    :prismjs="true"
    class="line-numbers"
    theme="default"
    :copy-icon="false"
    :copy-button="false"
    :copy-tab="false"
    max-height="625px"
    :code="code"
    lang="javascript"
    prism-plugin
    prismjs
    style="padding-left: 10px; width: 650px"
  />
</template>

<script setup>
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
</script>

<script>
export default {
  components: {},
  props: {
    code: String
  }
}
</script>
