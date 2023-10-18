<template>
  <div class="col piece-overlap" v-if="redCount != 0 && blueCount != 0">
    <div class="overlap-box">
      <div class="square square-lg piece small red"></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ redCount }}
      </div>
    </div>
    <div class="overlap-box">
      <div class="square square-lg piece small blue"></div>
    </div>
    <div class="overlap-box">
      <div>
        {{ blueCount }}
      </div>
    </div>
  </div>
  <div class="square square-lg piece red" v-else-if="blueCount == 0 && redCount != 0" ></div>
  <div class="square square-lg piece blue" v-else-if="blueCount != 0 && redCount == 0"></div>
</template>

<script>
export default {
  components: {},
  props: {
    redCount: Number,
    blueCount: Number
  },
  methods: {
    changeRedCount(redCount) {
      this.$props.redCount = redCount;
    },

    changeBlueCount(blueCount) {
      this.$props.blueCount = blueCount;
    }
  }
}
</script>
