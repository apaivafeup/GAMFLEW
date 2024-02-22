<script>
import { authStore } from '../store/authStore'

export default {
    beforeMount() {
        this.authStore = authStore()
    },

    methods: {
    },
    components: {}
}
</script>

<template>
    <div class="container">
        <div class="row" style="text-align: center; justify-content: center;">
            <img src="https://i.ibb.co/BnR2dGP/logo.png" style="width: 600px; margin-top: 30px;" />
        </div>
        <div class="row" style="justify-content: center; margin-top: 30px">
            <h4>Register</h4>
        </div>
    </div>
</template>
