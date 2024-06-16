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
import CommentModal from '../components/modals/CommentModal.vue'
</script>

<template style="overflow: hidden">
    <div class="col" style="text-align: center; margin-bottom: 15px;">
        <h1>Achievements</h1>
    </div>

    <div class="row"
        style="display: flex; gap: 10px; padding: 0px 12px; margin-bottom: 20px; justify-content: center; align-items: center; flex-direction: row; width: 100%; ">
        <button id="guide-button-1" v-if="individual"
            class="col button is-primary is-fullwidth guide-button guide-button-selected" style="margin: 0px;"
            @click="switchTabs()">
            Individual Achievements
        </button>
        <button id="guide-button-1" v-else class="col button is-primary is-fullwidth guide-button" style="margin: 0px;"
            @click="switchTabs()">
            Individual Achievements
        </button>
        <button id="guide-button-2" v-if="!individual"
            class="col button is-primary is-fullwidth guide-button guide-button-selected" style="margin: 0px;"
            @click="switchTabs()">
            General Achievements
        </button>
        <button id="guide-button-2" v-else class="col button is-primary is-fullwidth guide-button" style="margin: 0px;"
            @click="switchTabs()">
            General Achievements
        </button>
    </div>


    <div class="col" style="display: flex; align-items: center; flex-direction: column">
        <div style="width: 100%; margin-bottom: 15px; display: flex; flex-direction: column; justify-content: center;"
            v-if="individual">
            <div class="row"
                style="width: 100%; display: grid; grid-template-columns: repeat(3, 1.5fr); grid-gap: 10px;">
                <div class="col" v-for="challenge in challenges" :key="challenge.id">
                    <ChallengeAchievementCard :challenge="challenge" :unlocked="user_individual_achievements.includes(challenge.id)" :passed="user_passed_challenges.includes(challenge.id)" />
                </div>
            </div>
        </div>
        <div style="width: 100%; margin-bottom: 15px; display: flex; flex-direction: column; justify-content: center;"
            v-else>
            <div class="row"
                style="width: 100%; display: grid; grid-template-columns: repeat(3, 1.5fr); grid-gap: 15px;">
                <div class="col" v-for="general_achievement in general_achievements" :key="general_achievement.id">
                    <GeneralAchievementCard :general_achievement="general_achievement"
                        :unlocked="user_general_achievements.includes(general_achievement.id)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { h, resolveComponent } from 'vue'
import ChallengeAchievementCard from '../components/ChallengeAchievementCard.vue'
import GeneralAchievementCard from '../components/GeneralAchievementCard.vue'

export default {
    components: { ChallengeAchievementCard },

    props: {
    },

    data() {
        return {
            challenges: [],
            general_achievements: [],
            user_general_achievements: [],
            user_individual_achievements: [],
            user_passed_challenges: [],
            individual: Boolean
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
            }, this.$slots.default);

        this.auth = authStore()
        this.auth.checkAuth()

        await this.getChallenges()
        await this.getIndividualAchievements()
        await this.getGeneralAchievements()
        await this.getPassedChallenges()

        this.individual = true

        loader.hide()
    },

    updated() {
        Prism.highlightAll()
    },

    methods: {
        async getChallenges() {
            await this.$axios.get(this.$api_link + '/challenges', this.auth.config).then((response) => {
                this.challenges = response.data
                this.challenges = this.challenges.filter(challenge => challenge.id < 100)
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
            })
        },

        async getPassedChallenges() {
            await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/passed-challenges/', this.auth.config).then((response) => {
                this.user_passed_challenges = response.data
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
            })
        },

        async getIndividualAchievements() {
            await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/challenge-achievements/', this.auth.config).then((response) => {
                this.user_individual_achievements = response.data
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
            })
        },

        async getGeneralAchievements() {
            await this.$axios.get(this.$api_link + '/general-achievements', this.auth.config).then((response) => {
                this.general_achievements = response.data
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
            })

            await this.$axios.get(this.$api_link + '/users/' + this.auth.user.id + '/general-achievements', this.auth.config).then((response) => {
                this.user_general_achievements = response.data
            }).catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status.toString(), message: error.response.statusText } })
            })
        },

        switchTabs() {
            this.individual = !this.individual
        }

    },

    watch: {
        auth: {
            handler: function () {
                this.$forceUpdate()
            },
            deep: true
        },
    }
}
</script>
