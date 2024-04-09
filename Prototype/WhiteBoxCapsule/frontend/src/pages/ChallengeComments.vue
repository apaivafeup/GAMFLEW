<template>
    <div class="container">

        <div class="row" style="text-align: center; margin-bottom: 15px;">
            <h1>Challenge Comments</h1>
        </div>

        <div class="row" style="justify-content: center; margin-bottom: 10px;" v-if="this.challenge != null">
            <div class="card challenge-card" style="width: 650px;">
                <div class="card-body" style="">
                    <div class="row" style="display: flex; justify-content: space-between">
                        <div style="width: 100%">
                            <div class="row" style="align-items: center">
                                <h5 class="card-title" style="width: auto">{{ this.challenge.name.split(':')[0] }}</h5>
                            </div>
                            <div class="row">
                                <h6 class="card-subtitle mb-2 text-muted" style="font-size: 14px;">{{
            this.challenge.name.split(':')[1] }}</h6>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                            <div class="badge bg-primary"
                                style="margin: 0px; font-size: 12px !important; background-color: rgb(169, 89, 255)!important; text-align: center; display: flex; justify-content: center;">
                                <strong>{{ this.challenge.score }} points</strong>
                            </div>
                            <div class="badge bg-primary"
                                style="margin: 0px; font-size: 12px !important; background-color: rgb(25, 135, 84)!important; text-align: center; font-style: italic; display: flex; justify-content: center;">
                                {{ this.challenge.challenge_type == 'mcdc' ? this.challenge.challenge_type.toUpperCase()
            : this.challenge.challenge_type.charAt(0).toUpperCase() +
            this.challenge.challenge_type.slice(1) }}
                            </div>
                            <div class="badge bg-primary"
                                style="margin: 0px; font-size: 12px !important; background-color: rgb(13, 202, 240)!important; text-align: center; display: flex; justify-content: center;">
                                {{ this.challenge.difficulty }}
                            </div>
                            <button class="badge menu-button comments-badge play-badge"
                                style="margin: 0px; justify-content: center;" @click="goToChallenge(this.challenge.id)">
                                Play ▶️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" style="place-content: center; display: grid; grid-template-columns: 600px;" v-if="comments.length > 0">
            <div class="card" v-for="comment in comments">
                <div class="card-body" style="display: grid; grid-template-columns: 85% 15%; font-size: 15px; font-style: italic; background-color: var(--background-color); color: var(--text-color);">
                    <p class="card-text" style="margin: 0px;">{{ comment.comment }}</p>
                    <div v-if="hasScore(comment.attempt_id)" style="font-size: 10px;">
                        <p v-if="getAttemptScore(comment.attempt_id).score > 0">You marked it as <strong style="color: #8adc6d">Helpful</strong>.</p>
                        <p v-else>You marked it as <strong style="color: #dc3545">Not Helpful</strong>.</p>
                    </div>
                    <div style="display: flex; flex-direction: row;" v-else>
                        <button data-bs-toggle="tooltip" data-bs-placement="top" style="width: 50%;" title="Helpful" class="badge comment-score-badge" @click="scoreComment(comment.attempt_id, 1)">
                            👍
                        </button>
                        <button data-bs-toggle="tooltip" data-bs-placement="top" style="width: 50%;" title="Not Helpful" class="badge comment-score-badge" @click="scoreComment(comment.attempt_id, -1)">
                            👎
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-else>
            <p style="margin-top: 45px; font-size: 16px; text-align: center;">This challenge has no comments to show.<br/>Come back later!</p>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import ChallengeCard from '../components/ChallengeCard.vue'
import { authStore } from '../store/authStore'
import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';
import { Challenge } from '../store/models/challenge';

export default defineComponent({
    components: { ChallengeCard },

    data() {
        return {
            challenge: Challenge,
            auth: null,
            loader: null,
            comments: [],
            attemptScores: []
        }
    },

    async beforeMount() {
        this.loader = this.$loading.show({
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
        this.getChallenge()
        this.loader.hide()
    },

    mounted() {
    },

    methods: {
        async getChallenge() {
            const id = this.$route.params.id

            await this.$axios.get(this.$api_link + '/challenges/' + id, this.auth.config)
                .then((response) => {
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
                    this.getComments()
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
                    return
                })
        },

        async getComments() {
            const id = this.$route.params.id

            await this.$axios.get(this.$api_link + '/challenges/' + id + '/comments', this.auth.config)
                .then((response) => {
                    this.comments = response.data.sort((a, b) => {
                        if (a.comment_score == b.comment_score)
                            return a.id - b.id
                        return b.comment_score - a.comment_score
                    })

                    this.getAttemptScores()
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
                    return
                })
        },

        async scoreComment(attempt_id, score) {
            await this.$axios.post(this.$api_link + '/challenges/' + this.challenge.id + '/comments/' + attempt_id + '/score', { id: 0, user_id: this.auth.user.id, attempt_id: attempt_id, given_score: score, challenge_id: this.challenge.id }, this.auth.config)
                .then((response) => {
                    this.toast.success('Comment scored successfully!')
                    this.getComments()
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
                    return
                })
        },

        async getAttemptScores() {
            await this.$axios.get(this.$api_link + '/challenges/' + this.challenge.id + '/comments/scores/' + this.auth.user.id, this.auth.config)
                .then((response) => {
                    this.attemptScores = response.data
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } });
                    return
                })
        },

        getAttemptScore(attempt_id) {
            return this.attemptScores.find(element => element.attempt_id == attempt_id && element.user_id == this.auth.user.id)
        },

        hasScore(attempt_id) {
            return this.attemptScores.some(element => element.attempt_id == attempt_id && element.user_id == this.auth.user.id)
        },

        goToChallenge(id) {
            this.$router.push({ name: 'challenge', params: { id: id } })
        }
    }
})
</script>