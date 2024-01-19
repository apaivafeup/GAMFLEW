<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Credits</h1>
  </div>

  <div class="row" style="justify-content: center; margin-top: 30px">
    <div class="col" style="text-align: center">
      <div class="row">
        <span><strong>Programming:</strong> <em>Mateus Silva</em></span>
      </div>
      <div class="row" >
        <span> <strong>Supervision:</strong> <em>Alexandra Marques, Ana Paiva</em> </span>
      </div>
      <div class="row" style="text-align: center; margin: 5px;">
        <span> <strong>Technologies</strong> </span>
      </div>
      <div class="row">
        <span> <strong>Frontend:</strong> <em>Vue.js (HTML + CSS + Javascript)</em> </span>
      </div>
      <div class="row">
        <span> <strong>Backend:</strong> <em> Python (sqlalchemy) + Postgress / MySQL</em> </span>
      </div>
      <div class="row">
        <span> <strong>API:</strong> <em> Python (FastAPI + Uvicorn)</em> </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeMount() {
    console.log(this.$axios.defaults)
  },

  methods: {
    return() {
      this.$router.push('home')
    }
  },
}
</script>
