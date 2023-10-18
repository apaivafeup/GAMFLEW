<template>
    <div class="col piece-overlap">
        <div class="overlap-box">
          <div class="square square-lg piece small red"></div>
        </div>
        <div class="overlap-box">
          <div>
            {{ redCount }}
          </div>
        </div>
        <div class="overlap-box">
          <div class="square square-lg piece small blue">
            
          </div>
        </div>
        <div class="overlap-box">
          <div>
            {{ blueCount }}
          </div>
        </div>
      </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    redCount: Number,
    blueCount: Number
  }
}
</script>