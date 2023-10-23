<template>
    <button class="button is-primary is-fullwidth" @click="testChallenge()">
        Test Challenge
    </button>
</template>
  
<script>
export default {
    beforeMount() {
        
    },

    methods: {
        testChallenge() {
            console.log("Test Challenge")
            this.$router.push('/challenge/test')
        }
    },
    components: { }
}
</script>