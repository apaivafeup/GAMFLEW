<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import SubmitModal from '../components/modals/SubmitModal.vue'
import FailModal from '../components/modals/FailModal.vue'
import { boardStore } from '../store/boardStore'

import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { Attempt } from '../store/models/attempt.js'
import { CodeFile } from '../store/models/code_file.js'
import { BoardState } from '../store/models/board_state.js'
import Prism from 'prismjs'
import { authStore } from '../store/authStore'

import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
</script>

<style>
.vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}
</style>

<template style="overflow: hidden">
    <div v-if="loaded">
        <ChallengeHeaderMultiplayer :room_name="room.name" :challenge_name="challenge.name" />
        <Board :challenge="challenge" :code_file="code_file" :user="auth.user" />
        <SubmitModal :placeholder="submit_placeholder" />
        <SubmittedModal />
        <FailModal :placeholder="fail_placeholder" />
    </div>
    <div style="display: flex; justify-content: center;" v-else>
        <div class="vertical-center" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
            <h2 style="text-align: center;">You've entered <em>{{ room.name }}</em></h2>
            <p style="text-align: center; margin-bottom: 5px;">When all players get in the room, the game will start.
            </p>
            <p style="text-align: center;">Leaving this page means the game won't start.</p>
            <button class="btn btn-primary" style="justify-self: center; width: 125px;" @click="leaveRoom()">Leave
                Room</button>
        </div>
    </div>
</template>

<script>
export default {
    components: { ChallengeHeader, Board, SubmitModal, FailModal },

    props: {
        id: Number
    },

    data() {
        return {
            first_time: true,
            interval: Number,
            loaded: false,
            room: {},
            room_state: {},
            code_file: CodeFile,
            challenge: Challenge,
            board_state: BoardState,
            submit_placeholder:
                "Don't know what to write? Answer these: What was the specific objective to hit, beyond the target line? How did you hit it?",
            fail_placeholder:
                'Writing what you tried shows that it was an honest attempt! Can you identify the objective to hit, beyond the target line?'
        }
    },

    async beforeMount() {
        let loader = this.$loading.show({
            color: '#A959FF',
            container: this.fullPage ? null : this.$refs.formContainer,
            transition: 'fade',
            canCancel: true,
            freezeScroll: true,
            onCancel: this.onCancel,
            opacity: 0.9,
            blur: '50px'
        },
            {
                default: h(resolveComponent('LoadingIcon'))
            });

        this.auth = authStore()
        this.auth.checkAuth()

        await this.$axios.get(this.$api_link + '/game-room/' + this.id, this.auth.config)
            .then(response => {
                this.room = response.data
            })
            .catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })

        await this.$axios.post(this.$api_link + '/start/game-room/' + this.id, {}, this.auth.config)
            .then((response) => {
                this.game_started = true
            })
            .catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })

        if (this.$error) {
            loader.hide()
            return
        }

        loader.hide()

        this.interval = setInterval(() => { this.checkState() }, 5000)

        window.onhashchange = function () {
            if (!confirm('Are you sure you want to leave the room? You will have to enter again to play.'))
                return
            this.leaveRoom()
        }
    },

    updated() {
        Prism.highlightAll()
    },

    methods: {
        async leaveRoom() {
            if (!confirm('Are you sure you want to leave the room?'))
                return

            await this.$axios.post(this.$api_link + '/leave/game-room/' + this.id, {}, this.auth.config)
                .then((response) => {
                    this.$router.push({ name: 'multiplayer-rooms' })
                })
                .catch(error => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async checkState() {
            console.log('Checking state...')
            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/state', this.auth.config)
                .then(response => {
                    this.room_state = response.data
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

            if (this.room_state.players_in.length === this.room.player_number && this.first_time) {
                this.first_time = false
                clearInterval(this.interval)
                console.log('Cleared!')
                this.getChallenge()
            }
        },

        async getChallenge() {
            this.interval = setInterval(() => { this.checkState() }, 10 * 1000)
            // GET CHALLENGE ID


            var user_id

            return

            await this.$axios.get(this.$api_link + '/challenges/' + this.challenge_id, this.auth.config).then((response) => {
                user_id = response.data.owner_id

                this.challenge = new Challenge(
                    response.data.id,
                    response.data.name,
                    response.data.description,
                    response.data.difficulty,
                    response.data.hint,
                    response.data.objective,
                    response.data.test_cases_count,
                    response.data.score,
                    response.data.initial_board,
                    response.data.code_file,
                    response.data.challenge_type,
                    response.data.passing_criteria,
                    response.data.achievement_criteria,
                    response.data.owner_id
                )
            }).catch((error) => {
                console.log(error.response)
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
                this.$error = true
            })

            await this.$axios.get(this.$api_link + '/code-files/' + this.challenge.code_file, this.auth.config).then((response) => {
                this.code_file = new CodeFile(response.data.id, response.data.name, response.data.content)
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                this.$error = true
            })

            await this.$axios.get(this.$api_link + '/board-states/' + this.challenge.initial_board, this.auth.config).then((response) => {
                this.board_state = new BoardState(response.data.id, response.data.name, response.data.board_state, response.data.out_of_bounds_state)
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })

            this.board = boardStore()
            this.board.initialState = this.board_state
            this.board.setState()

            this.board.attempt = new Attempt(this.auth.user.id, this.challenge_id, this.challenge.score, 0, 0, null, null)
        }
    },

    watch: {
        board: {
            handler: function () {
                this.$forceUpdate()
            },
            deep: true
        },
        auth: {
            handler: function () {
                this.$forceUpdate()
            },
            deep: true
        },
    }
}
</script>
