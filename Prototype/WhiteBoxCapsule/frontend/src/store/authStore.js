import { defineStore } from 'pinia'
import { User } from './models/user.js'

export const authStore = defineStore('authStore', {
    state: () => {
        return {
            // Actual game state.
            config: {},
            user: User,
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
                if (response.status === 200) {
                    this.config = {
                        headers: { 'Authorization': 'Bearer ' + response.data.access_token }
                    }
                    this.auth = true;

                    window.sessionStorage.setItem('access_token', response.data.access_token)
                    window.sessionStorage.setItem('username', form.get('username'))

                    this.getUserData(response.data.user_id)
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
        },

        async getUserData(id) {
            await this.$axios.get(this.$api_link + '/users/' + id, this.config)
                .then((response) => {
                    if (response.status === 200) {
                        this.user = new User(
                            response.data.id,
                            response.data.name,
                            response.data.username,
                            response.data.picture,
                            response.data.score,
                            response.data.failed_attempts,
                            response.data.successful_attempts,
                            response.data.achievements
                        )
                    }
                })
        }
    }
})
