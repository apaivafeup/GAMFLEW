<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore'

export default {
    async beforeMount() {
        this.auth = authStore()
        this.auth.checkAuth()

        await this.$axios.get(this.$api_link + '/game-rooms/', this.auth.config)
            .then(response => {
                this.rooms = response.data
            })
            .catch(error => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })

        await this.$axios.get(this.$api_link + '/users/', this.auth.config)
            .then(response => {
                var users = response.data

                for (var i = 0; i < users.length; i++) {
                    this.users[users[i].id] = users[i]
                }
            })
            .catch(error => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })
    },

    data() {
        return {
            auth: null,
            rooms: [],
            users: {}
        }
    },

    methods: {
        async enterRoom(id) {
            await this.$axios.post(this.$api_link + '/enter/game-room/' + id, {}, this.auth.config)
                .then(response => {
                    //this.$router.push({ name: 'multiplayer-room', params: { id: id } })
                })
                .catch(error => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        }
    },
    components: {}
}
</script>

<template>
    <div class="row" style="margin-bottom: 10px;">
        <h2 style="text-align: center;">Multiplayer Rooms</h2>
    </div>
    <div class="row" style="display: flex; justify-content: end;">
        <button class="btn btn-primary" style="padding: 10px; width: auto;">Create Room</button>
    </div>
    <div class="row" style="padding: 0px;">
        <div class="col" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;">
            <div v-for="room in rooms">
                <!-- <router-link :to="{ name: 'multiplayer-room', params: { id: room.id } }"> -->
                <div class="card" style="width: 100%">
                    <div class="card-body">
                        <div class="row" style="display: flex;">
                            <div class="col"
                                style="display: flex; flex-direction: column; align-content: center; justify-content: center;">
                                <h5 class="card-title">{{ room.name }}</h5>
                                <p class="card-subtitle mb-2 text-muted"
                                    style="font-size: 15px; font-style: italic; padding: 0px; margin: 0px !important;">{{
                                        room.rounds + ' rounds, ' + room.player_number + ' players' }}</p>
                            </div>
                            <div class="col" style="justify-content: end; display: flex;">
                                <button class="btn btn-primary" style="padding: 15px; border-radius: 10px;" @click="enterRoom(room.id)">Enter</button>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 15px;">
                            <div class="col" style="display: flex; flex-direction: column; align-content: start;">
                                <h6 style="font-size: 15px; font-style: italic;">Players</h6>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 1vw;">
                                    <div class="badge bg-info"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px);">
                                        <img :src="this.$api_link + users[room.player_1_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px;">
                                            {{ users[room.player_1_id] ? users[room.player_1_id].username : 'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-info" v-if="room.player_2_id != null"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px);">
                                        <img :src="this.$api_link + users[room.player_2_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px;">
                                            {{ users[room.player_2_id] ? users[room.player_2_id].username : 'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary" v-else
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px);">
                                        <div style="width: 40px; height: 40px; background-color: white; border-radius: 100px;" >
                                        </div>
                                        <p style="margin: 0px;">
                                            Empty
                                        </p>
                                    </div>
                                    <div class="badge bg-info"
                                    v-if="room.player_3_id != null"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px);">
                                        <img :src="this.$api_link + users[room.player_3_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px;">
                                            {{ users[room.player_3_id] ? users[room.player_3_id].username : 'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary" v-else-if="room.player_number == 3"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px);">
                                        <div style="width: 40px; height: 40px; background-color: white; border-radius: 100px;" >
                                        </div>
                                        <p style="margin: 0px;">
                                            Empty
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary disabled" style="justify-content: center;" v-else>
                                        N/A
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                </div>
            <!-- </router-link> -->
        </div>
    </div>
</div></template>
