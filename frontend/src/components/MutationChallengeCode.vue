<template>
  <CodeBlock
    :class="[
      'col line-numbers mutation-code-block',
      { 'killed-mutant-code-block': hasResult && isCurrentMutantKilled }
    ]"
    theme="default"
    height="393px"
    :data-line="changedLines"
    :prismjs="true"
    :code="mutated_code || code_file.content"
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

<style scoped>
.mutation-code-block :deep(.line-highlight) {
  background: rgba(255, 99, 99, 0.2) !important;
}

.killed-mutant-code-block :deep(.line-highlight) {
  background: rgba(99, 255, 99, 0.5) !important;
}
</style>

<script>
import { CodeFile } from '../store/models/code_file.js'
import { mutationResultsStore } from '../store/mutationResultsStore.js'
import { diffLines } from 'diff'
import Prism from 'prismjs'

export default {
  components: {},
  props: {
    code_file: CodeFile,
    mutated_code: String,
    mutant_id: [Number, String]
  },

  async beforeMount() {
    this.mutationResults = mutationResultsStore()
    Prism.highlightAll()
  },

  computed: {
    currentMutantResult() {
      const results = this.mutationResults?.results || []

      if (!results.length) {
        return null
      }

      if (this.mutant_id !== undefined && this.mutant_id !== null) {
        return results.find((entry) => String(entry.mutantId) === String(this.mutant_id)) || null
      }

      return results[0]
    },

    hasResult() {
      return this.currentMutantResult !== null
    },

    isCurrentMutantKilled() {
      const result = this.currentMutantResult?.result

      if (!result) {
        return false
      }

      if (typeof result.mutantKilled === 'boolean') {
        return result.mutantKilled
      }

      if (typeof result.killed === 'boolean') {
        return result.killed
      }

      return false
    },

    changedLines() {
      if (!this.code_file?.content || !this.mutated_code) return ''
      const changes = diffLines(this.code_file.content, this.mutated_code)
      let currentMutantLine = 1
      const changed = []

      for (const part of changes) {
        const lineCount = part.value.split('\n').length - 1

        if (part.added) {
          for (let i = 0; i < lineCount; i++) {
            changed.push(currentMutantLine + i)
          }
          currentMutantLine += lineCount
        } else if (!part.removed) {
          currentMutantLine += lineCount
        }
      }

      return changed.join(',')
    }
  }
}
</script>
