import { defineStore } from 'pinia'

export const authStore = defineStore('authStore', {
    state: () => {
        return {
            // Actual game state.
            config: {},
            username: String,
            authenticated: Boolean
        }
    },
    actions: {
        async checkAuth() {
            const token = window.sessionStorage.getItem('access_token')
            if (token) {
                this.config = {
                    headers: { 'Authorization': 'Bearer ' + token }
                }
                this.username = window.sessionStorage.getItem('username')
                this.authenticated = true
            }
        },

        async login(form) {
            await this.$axios({
                method: 'post',
                url: this.$api_link + '/login',
                data: form,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then((response) => {
                console.log(response)
                if (response.status === 200) {
                    this.config = {
                        headers: { 'Authorization': 'Bearer ' + response.data.access_token }
                    }
                    this.username = form.get('username')
                    this.auth = true;

                    window.sessionStorage.setItem('access_token', response.data.access_token)
                    window.sessionStorage.setItem('username', form.get('username'))
                }
            })
        },

        async logout() {
            await this.$axios.post(this.$api_link + '/logout', this.username, this.config)
                .then((response) => {
                    if (response.status === 200) {
                        this.config = {}
                        this.username = ''
                        this.authenticated = false
                        window.sessionStorage.removeItem('access_token')
                        window.sessionStorage.removeItem('username')
                        window.location.reload()
                    }
                })
        }
    }
})
