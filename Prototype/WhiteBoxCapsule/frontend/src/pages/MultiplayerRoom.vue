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
import ChallengeMultiplayerHeader from '../components/ChallengeMultiplayerHeader.vue'
import MultiplayerBoard from '../components/MultiplayerBoard.vue'
import MultiplayerSubmitModal from '../components/modals/MultiplayerSubmitModal.vue'
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
        <ChallengeMultiplayerHeader :room_name="room.name" :challenge_name="challenge.name" :playable="this.playable" />
        <MultiplayerBoard :challenge="challenge" :code_file="code_file" :user="auth.user" :playable="this.playable" />
        <MultiplayerSubmitModal :placeholder="submit_placeholder" :round_id="this.round.id" />
        <FailModal :placeholder="fail_placeholder" />
    </div>
    <div style="display: flex; justify-content: center;" v-else-if="!loaded">
        <div class="vertical-center" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
            <h2 style="text-align: center;" v-if="!this.round_loading">You've entered <em>{{ room.name }}</em></h2>
            <h2 style="text-align: center;" v-else><em>{{ room.name }}</em></h2>
            <p style="text-align: center; margin-bottom: 5px;" v-if="!this.round_loading">When all players get in the room, the game will start.</p>
            <p style="text-align: center; margin-bottom: 5px;" v-else>New round is loading...</p>
            <p style="text-align: center;" v-if="!this.round_loading">Leaving this page means the game won't start.</p>
            <p style="text-align: center;" v-else>Leaving this page means the game won't continue.</p>
            <button class="btn btn-primary" style="justify-self: center; width: 125px;" v-if="!this.round_loading" @click="leaveRoom()">Leave
                Room</button>
        </div>
    </div>
    <div style="display: flex; justify-content: center;" v-else-if="this.winner != null">
        <EndScreen :winner="this.winner"/>
    </div>
</template>

<script>
export default {
    components: { ChallengeHeader, Board, MultiplayerSubmitModal, FailModal },

    props: {
        id: Number
    },

    data() {
        return {
            interval: Number,
            loaded: false, // if the page is loaded (before getting rounds - step 1)
            room: {}, // room information
            room_state: {}, // room state info
            round: {}, // round info
            current_round: 0, // current round number
            got_round: false, // if we (the player) have the round (step 2)
            round_loading: false, // if all players have the round (step 3)
            is_ready: false, // if we can play (step 4)
            playable: Boolean, // if it's our turn to play (step 5),
            winner: null,
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

        if (this.$error) {
            loader.hide()
            return
        }

        loader.hide()
    },

    async mounted() {
        window.onpopstate = () => {
            this.leaveRoom()
        }

        this.stateChecking()
        this.startGameRoom()
    },

    update() {
        Prism.highlightAll()
    },

    methods: {
        async startGameRoom() {
            await this.$axios.post(this.$api_link + '/start/game-room/' + this.id, {}, this.auth.config)
                .then((response) => {

                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async leaveRoom() {
            console.log('Leaving...')
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
            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/state', this.auth.config)
                .then(response => {
                    this.room_state = response.data
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

            if (this.room_state.players_in.length === this.room.player_number && !this.not_first_time) {
                this.not_first_time = true
                clearInterval(this.interval)
                this.stateChecking()
            }

            if (this.room_state.game_state == 'ready' && !this.is_ready) {
                this.getRound()
                this.is_ready = true
            }

            if (this.room_state.game_state == 'playing') {
                if (!this.is_ready) {
                    this.round_loading = true
                    this.loaded = false
                    this.getRound()
                    this.is_ready = true
                }
                this.loaded = true
                this.round_loading = false
                this.got_round = false
            }

            if (this.room_state.game_state == 'waiting') {
                this.loaded = false
                
                if (this.round != null) {
                    this.round_loading = true
                }

                this.is_ready = false
                this.not_first_time = false
                this.startGameRoom()
                this.$forceUpdate()
            }

            if (this.room_state.game_state == 'next_round') {
                this.is_ready = false;
                this.round_loading = true
                this.loaded = false
                this.getRound()
            }

            if (this.room_state.game_state == 'finished') {
                this.loaded = false
                this.round_loading = false
                this.getWinner()
            }

            if (this.round.state == 'finished' && this.round.round_number != -1) {
                console.log('The next round is starting...')
                this.round_loading = true
                this.loaded = false
            } else if (this.round.state == 'finished' && this.round.round_number == -1) {
                this.loaded = false
                this.round_loading = false
                this.finishRoom()
                this.getWinner()
            }
        },

        stateChecking() {
            this.interval = setInterval(() => { this.checkState() }, 5000)
        },

        async getRound() {
            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/round', this.auth.config)
                .then(response => {
                    if (this.round.id == response.data.id) {
                        return
                    }
                    this.round = response.data
                    this.current_round = this.round.round_number
                    this.challenge_id = this.round.challenge_id
                    this.playable = (this.round.user_id == this.auth.user.id)
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })


            var user_id = 0
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
            this.board.generateState()
            this.board.initialState = this.board_state
            this.board.setState()

            this.board.attempt = new Attempt(this.auth.user.id, this.challenge_id, this.challenge.score, 0, 0, null, null)
            Prism.highlightAll()
            this.$forceUpdate()
        },

        async sendStart() {
            await this.$axios.post(this.$api_link + '/round/' + this.round.id + '/start', {}, this.auth.config)
                .then((response) => {

                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async finishRoom() {
            await this.$axios.post(this.$api_link + '/finish/game-room/' + this.id, {}, this.auth.config)
                .then((response) => {
                    clearInterval(this.interval)
                    this.room_state.game_state = 'finished'
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async getWinner() {
            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/winner', this.auth.config)
                .then(response => {
                    if (response.data.length == 1 || response.data.length > 1) {
                        // someone won or a tie
                        this.winner = response.data;
                    } else {
                        // no winner yet
                        this.winner = null;
                    }
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
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
    },

    components: {
        ChallengeHeader,
        Board,
        SubmitModal,
        FailModal,
        LoadingIcon,
        ChallengeMultiplayerHeader
    }
}
</script>
