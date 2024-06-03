<script setup>
import ChallengeHeader from '../components/ChallengeHeader.vue'
import Board from '../components/Board.vue'
import { boardStore } from '../store/boardStore'

import { Challenge } from '../store/models/challenge.js'
import { User } from '../store/models/user.js'
import { Attempt } from '../store/models/attempt.js'
import { CodeFile } from '../store/models/code_file.js'
import { BoardState } from '../store/models/board_state.js'
import Prism from 'prismjs'
import { authStore } from '../store/authStore.js'

import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import ChallengeMultiplayerHeader from '../components/ChallengeMultiplayerHeader.vue'
import MultiplayerBoard from '../components/MultiplayerBoard.vue'
import MultiplayerSubmitModal from '../components/modals/MultiplayerSubmitModal.vue'
import MultiplayerUserSubmissions from '../components/MultiplayerUserSubmissions.vue'
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
    <div v-if="got_round_solution && round_solution != null">
        <MultiplayerUserSubmissions :code_file="code_file" :challenge="challenge" :attempt="round_solution"
            :show_solution_timer="show_solution_timer" :playable="playable" />
    </div>
    <div v-else-if="loaded">
            <ChallengeMultiplayerHeader :room_name="room.name" :challenge_name="challenge.name"
                :playable="playable" :score="challenge.score" />
            <MultiplayerBoard :challenge="challenge" :code_file="code_file" :can_pass="can_pass" :user="auth.user"
                :playable="playable" :round="round" :timer="timer" :timer_set="timer_set" />
            <MultiplayerSubmitModal :placeholder="submit_placeholder" :round_id="round.id"
                :challenge="challenge" />
            <FailModal :placeholder="fail_placeholder" />
    </div>
    <div style="display: flex; justify-content: center;" v-else-if="!loaded && !got_round_solution && winner.length <= 0">
        <div class="vertical-center" style="display: flex; flex-direction: column; margin: auto; align-items: center;">
            <h2 style="text-align: center;" v-if="room_state.game_state == 'waiting'">You've entered <em>{{ room.name }}</em></h2>
            <h2 style="text-align: center;" v-else><em>{{ room.name }}</em></h2>
            <p style="text-align: center; margin-bottom: 5px;" v-if="room_state.game_state == 'waiting'">When all
                players get in the
                room, the game will start.</p>
            <p style="text-align: center; margin-bottom: 5px;"
                v-else-if="room_state.game_state != 'waiting' || round_loading && winner.length <= 0">New
                round is loading...</p>
            <p style="text-align: center; margin-bottom: 5px;" v-else>The game is over.</p>
            <p style="text-align: center;" v-if="!round_loading">Leaving this page means the game won't start.</p>
            <p style="text-align: center;" v-else-if="round_loading && winner.length <= 0">Leaving this page
                means
                the game won't continue.</p>
            <p style="text-align: center;" v-else>If you wish, you can wait for the End Screen to load.</p>
            <button class="btn btn-primary" style="justify-self: center; width: 125px;" v-if="!round_loading"
                @click="leaveRoom()">Leave
                Room</button>
        </div>
    </div>
    <div style="display: flex; flex-direction: row; justify-content: center; overflow-y: scroll;"
        v-else-if="winner.length > 0">
        <EndScreen :winner="winner" :id="id" :room="room"
            style="position: absolute; top: 50%; transform: translate(0, -50%);" />
    </div>
</template>

<script>
import EndScreen from '../components/EndScreen.vue'
import { solutionViewer } from '../store/solutionViewer.js'

export default {
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
            round_solution: null,
            current_round: 0, // current round number
            challenge_id: -1,
            got_round: false, // if we (the player) have the round (step 2)
            round_loading: false, // if all players have the round (step 3)
            is_ready: false, // if we can play (step 4)
            can_pass: Boolean,
            playable: false, // if it's our turn to play (step 5),
            winner: [],
            got_round_solution: false,
            show_solution_timer: 10, //*1000,
            show_solution_interval: null,
            solution_timer_set: false,
            timer: 0,
            timer_interval: null,
            has_time_ended: false,
            timer_set: false,
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
        this.board = boardStore()

        await this.$axios.get(this.$api_link + '/game-room/' + this.id, this.auth.config)
            .then(response => {
                this.room = response.data

            })
            .catch((error) => {
                clearInterval(this.interval)
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })
        // console.log('can_pass', this.can_pass)

        if (this.$error) {
            loader.hide()
            return
        }

        loader.hide()
        Prism.highlightAll()
    },

    async mounted() {
        this.can_pass = this.can_user_pass_auto()
        this.got_round_solution = false
        this.round_solution = null
        this.stateChecking()
        this.startGameRoom()
    },

    update() {
        Prism.highlightAll()
    },

    methods: {
        async startGameRoom() {
            if (this.room_state.game_state == undefined) {
                await this.$axios.post(this.$api_link + '/start/game-room/' + this.id, {}, this.auth.config)
                    .then((response) => {

                    })
                    .catch((error) => {
                        clearInterval(this.interval)
                        this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                        return
                    })
            }
        },

        async leaveRoom() {
            await this.$axios.post(this.$api_link + '/leave/game-room/' + this.id, {}, this.auth.config)
                .then((response) => {
                    this.$router.back()
                })
                .catch(error => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async checkState() {
            this.old_room_state = this.room_state

            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/state', this.auth.config)
                .then(response => {
                    this.room_state = response.data
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

            if (this.room_state.players_in.length === this.room.player_number && !this.not_first_time) {
                console.log('all players in, starting periodic checking...')
                this.not_first_time = true
                clearInterval(this.interval)
                this.stateChecking()
            }

            if ((this.room_state.game_state == 'pass_round' || this.room_state.game_state == 'waiting') && this.old_room_state.game_state == 'playing') {
                console.log('passing or waiting after playing...')
                this.can_pass = await this.can_user_pass_auto()
                this.$forceUpdate()
                this.$router.go()
            }

            if (this.room_state.game_state == 'ready' && !this.is_ready) {
                console.log('ready...')
                this.getRound()
                this.is_ready = true
            }

            if (this.room_state.game_state == 'playing') {
                console.log('playing...')
                if (!this.is_ready) {
                    this.round_loading = true
                    this.loaded = false
                    this.getRound()
                    this.is_ready = true
                }

                if (this.playable && !this.timer_set) {
                    this.timer = this.getTimeForRound()
                    this.timer_interval = setInterval(() => {
                        this.timer--

                        if (this.timer <= 0) {
                            clearInterval(this.timer_interval)
                            this.has_time_ended = true
                            this.timer_set = false
                        }
                    }, 1000)
                    this.timer_set = true
                }

                this.loaded = true
                this.round_loading = false
                this.got_round = false
            }

            if (this.room_state.game_state == 'waiting') {
                console.log('waiting...')
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
                console.log('next round...')
                this.timer_set = false
                clearInterval(this.timer_interval)
                this.loaded = false
                this.is_ready = false
                this.can_pass = await this.can_user_pass_auto()
                this.round_loading = true
                this.round_solution = {}
                this.board.emptyState(true)
                this.getRound()
            }

            if (this.room_state.game_state == 'show_solution' && !this.solution_timer_set) {
                console.log('showing solution...')
                clearInterval(this.timer_interval)
                this.getRoundSolution()

                if (this.round_solution != null) {
                    this.show_solution_interval = setInterval(() => {
                    this.show_solution_timer--

                    if (this.show_solution_timer <= 0) {
                        this.stateChecking()
                        clearInterval(this.show_solution_interval)
                        this.solution_timer_set = false
                        this.send_seen_solution()
                        this.$forceUpdate()
                    }
                    }, 1000)
                    this.solution_timer_set = true
                } else {
                    this.send_seen_solution()
                    this.$forceUpdate()
                }
            }

            if (this.room_state.game_state == 'finished' && this.winner.length <= 0) {
                console.log('finished...')
                this.loaded = false
                this.round_loading = false
                this.getWinner()
            }

            if (this.round.state == 'finished' && this.round.round_number != -1) {
                console.log('round finished...')
                this.round_loading = true
                this.loaded = false
            } else if (this.round.state == 'finished' && this.round.round_number == -1) {
                console.log('game finished...')
                this.loaded = false
                this.round_loading = false
                this.finishRoom()
                this.getWinner()
            }

            

            if (this.has_time_ended) {
                console.log('time ran out, automatic pass...')
                this.autoPassRound()
            }
        },

        stateChecking() {
            this.interval = setInterval(() => { this.checkState() }, 5000)
        },

        getTimeForRound() {
            return 30
            if (this.challenge.difficulty == 'Very Easy') {
                return 100 // 1 minute and 40 seconds
            } else if (this.challenge.difficulty == 'Easy') {
                return 150 // 2 minutes and 30 seconds
            } else if (this.challenge.difficulty == 'Normal') {
                return 300 // 5 minutes
            } else if (this.challenge.difficulty == 'Hard') {
                return 480 // 8 minutes 
            } else {
                return 600 // 10 minutes
            }
        },

        async getRoundSolution() {
            this.round_solution = {}
            this.$forceUpdate()

            var round_id
            if (this.round.id != null && this.round.id != undefined) {
                round_id = this.round.id
            } else if (this.room_state.last_round_id != null && this.room_state.last_round_id != undefined) {
                round_id = this.room_state.last_round_id
            } else {
                return
            }

            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/round/' + round_id + '/solution', this.auth.config)
                .then(response => {
                    if (!this.got_round_solution) {
                        if (response.data == null || response.data == undefined) {
                            console.log('did not get round solution')
                            this.got_round_solution = false
                            this.round_solution = response.data
                            return
                        }

                        this.round_solution = response.data
                        this.got_round_solution = true
                        console.log("got round solution")
                        this.$forceUpdate()
                    }
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

        },

        async autoPassRound() {
            if (!this.playable) {
                return;
            }

            await this.$axios.post(this.$api_link + '/game-room/' + this.round.game_room_id + '/game-round/' + this.round.id + '/auto-pass/', {}, this.auth.config)
                .then(response => {
                    this.$router.go()
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async getRound() {
            await this.$axios.get(this.$api_link + '/game-room/' + this.id + '/round', this.auth.config)
                .then(response => {
                    if (response.data == null || response.data == undefined) {
                        this.current_round = this.round.round_number
                        this.challenge_id = -1
                        this.playable = false
                        this.room_state.game_state = 'finished'
                        return
                    }

                    if (this.round.id == response.data.id) {
                        return
                    }
                    this.round = response.data
                    this.current_round = this.round.round_number
                    this.challenge_id = this.round.challenge_id
                    this.playable = (this.round.user_id == this.auth.user.id)
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

            if (this.round.all_passed && this.round.first_chosen == this.auth.user.id) {
                if (confirm('All players have passed the round. It is your turn, and you can choose to move on to a new challenge.')) {
                    clearInterval(this.interval)
                    this.finishPassedRound()
                }
            }

            this.can_pass = await this.can_user_pass_auto()

            var user_id = 0

            if (this.challenge_id != -1) {
                await this.$axios.get(this.$api_link + '/challenges/' + this.challenge_id, this.auth.config).then((response) => {
                    user_id = response.data.owner_id
    
                    this.challenge = new Challenge(
                        response.data.id,
                        response.data.name,
                        response.data.difficulty,
                        response.data.hint,
                        response.data.objective,
                        response.data.test_cases_count,
                        response.data.score,
                        response.data.initial_board,
                        response.data.code_file,
                        response.data.challenge_type,
                        response.data.passing_criteria,
                        response.data.achievement,
                        response.data.achievement_hint,
                        response.data.owner_id
                    )
                }).catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
                    this.$error = true
                })
            } else {
                return
            }

            await this.$axios.get(this.$api_link + '/code-files/' + this.challenge.code_file, this.auth.config).then((response) => {
                this.code_file = new CodeFile(response.data.id, response.data.name, response.data.content)
            }).catch((error) => {
                clearInterval(this.interval)
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                this.$error = true
            })

            await this.$axios.get(this.$api_link + '/board-states/' + this.challenge.initial_board, this.auth.config).then((response) => {
                this.board_state = new BoardState(response.data.id, response.data.name, response.data.board_state, response.data.out_of_bounds_state)
            }).catch((error) => {
                clearInterval(this.interval)
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
            Prism.highlightAll()
        },

        async sendStart() {
            await this.$axios.post(this.$api_link + '/round/' + this.round.id + '/start', {}, this.auth.config)
                .then((response) => {

                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async finishRoom() {
            await this.$axios.post(this.$api_link + '/finish/game-room/' + this.id, {}, this.auth.config)
                .then((response) => {
                    clearInterval(this.interval)
                    clearInterval(this.timer_interval)
                    this.room_state.game_state = 'finished'
                })
                .catch((error) => {
                    clearInterval(this.interval)
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
                        clearInterval(this.interval)
                        clearInterval(this.timer_interval)
                    } else {
                        // no winner yet
                        this.winner = null;
                    }
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async can_user_pass_auto() {
            let can_pass = false

            if (this.round.id == undefined || this.id == undefined) {
                return can_pass
            }

            await this.$axios.post(this.$api_link + '/game-room/' + this.id + '/game-round/' + this.round.id + '/can-pass', {}, this.auth.config)
                .then(response => {
                    can_pass = response.data.can_pass
                })
                .catch((error) => {
                    clearInterval(this.timer_interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })

            return can_pass
        },

        async send_seen_solution() {
            var round_id
            if (this.round.id != null && this.round.id != undefined) {
                round_id = this.round.id
            } else if (this.room_state.last_round_id != null && this.room_state.last_round_id != undefined) {
                round_id = this.room_state.last_round_id
            } else {
                return
            }

            await this.$axios.post(this.$api_link + '/game-room/' + this.id + '/round/' + round_id + '/seen-solution/', {}, this.auth.config)
                .then(response => {
                    this.round_solution = null
                    this.solution_timer_set = false
                    this.$router.go()
                })
                .catch((error) => {
                    clearInterval(this.interval)
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async finishPassedRound() {
            await this.$axios.post(this.$api_link + '/round/' + this.round.id + '/all-passed/finish/', {}, this.auth.config)
                .then(response => {
                    window.location.reload()
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        }
    },

    watch: {
        auth: {
            handler: function () {
                this.$forceUpdate()
            },
            deep: true
        },
        winner: {
            handler: function () {
                this.$forceUpdate()
            },
            deep: true
        },
    },

    components: {
        ChallengeHeader,
        Board,
        MultiplayerSubmitModal,
        LoadingIcon,
        ChallengeMultiplayerHeader,
        MultiplayerUserSubmissions
    }
}
</script>
