import { defineStore } from 'pinia'

export const mutationResultsStore = defineStore('mutationResultsStore', {
  state: () => {
    return {
      results: []
    }
  },

  actions: {
    setResults(results) {
      this.results = Array.isArray(results) ? results : []
    },

    clearResults() {
      this.results = []
    }
  }
})