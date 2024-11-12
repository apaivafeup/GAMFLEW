import { defineStore } from 'pinia'
import { User } from './models/user.js'
import { useToast } from 'vue-toastification'

const toast = useToast()

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
            const username = window.localStorage.getItem('username')
            if (username != null) {
                this.config = {
                    headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem('access_token') }
                }
                this.user = JSON.parse(window.localStorage.getItem('user_data'))
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

                    window.localStorage.setItem('access_token', response.data.access_token)
                    window.localStorage.setItem('username', form.get('username'))

                    this.getUserData(response.data.user_id)
                }
            }).catch((error) => {
                toast.error('An error occurred while logging in. Check your credentials and try again.')
            })
        },

        async logout() {
            await this.$axios.post(this.$api_link + '/logout', this.username, this.config)
                .then((response) => {
                    if (response.status === 200) {
                        this.config = {}
                        this.username = ''
                        this.authenticated = false
                        window.localStorage.removeItem('access_token')
                        window.localStorage.removeItem('username')
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    toast.error('An error occurred while logging in. Check your credentials and try again.')
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
                            response.data.achievements,
                            response.data.user_type,
                            response.data.student_class
                        )

                        window.localStorage.setItem('user_data', JSON.stringify(this.user))
                    }
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: {afterCode: '_', code: error.response.status, message: error.response.statusText } })
                })
        }
    },
    persist: {
        storage: localStorage
    }
})
