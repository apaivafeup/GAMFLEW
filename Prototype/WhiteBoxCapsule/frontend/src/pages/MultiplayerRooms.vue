<script>
import GameCredits from './GameCredits.vue'
import Menu from '../components/Menu.vue'
import Login from '../components/Login.vue'
import { authStore } from '../store/authStore.js'
import CreateRoomModal from '../components/modals/CreateRoomModal.vue'
import LoadingIcon from '../components/LoadingIcon.vue'
import { h, resolveComponent } from 'vue'

export default {
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

                users.forEach(user => {
                    this.users[user.id] = user
                })

                this.loaded = true
            })
            .catch((error) => {
                this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                return
            })

        loader.hide()
    },

    data() {
        return {
            rooms: [],
            users: {},
            loaded: false
        }
    },

    methods: {
        async enterRoom(id) {
            await this.$axios.post(this.$api_link + '/enter/game-room/' + id, {}, this.auth.config)
                .then(response => {
                    this.$router.push({ name: 'multiplayer-room', params: { id: id } })
                })
                .catch(error => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        }
    },
    components: { CreateRoomModal }
}
</script>

<template>
    <CreateRoomModal />
    <div class="row" style="margin-bottom: 10px;">
        <h2 style="text-align: center;">Multiplayer Rooms</h2>
    </div>
    <div class="row" style="display: flex; justify-content: end;">
        <button class="btn btn-primary" style="padding: 10px; width: auto;" data-bs-target="#create-room-modal"
            data-bs-toggle="modal">Create Room</button>
    </div>
    <div class="row" style="padding: 0px;">
        <div class="col" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;">
            <div v-for="room in rooms" v-if="loaded">
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
                                <button class="btn btn-primary" style="padding: 15px; border-radius: 10px;"
                                    @click="enterRoom(room.id)">Enter</button>
                            </div>
                        </div>
                        <div class="row" style="margin-top: 15px;">
                            <div class="col" style="display: flex; flex-direction: column; align-content: start;">
                                <h6 style="font-size: 15px; font-style: italic;">Players</h6>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 1vw;">
                                    <div class="badge bg-info" v-if="room.player_1_id != null"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                        <img :src="this.$api_link + this.users[room.player_1_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px; padding-right: 5px;">
                                            {{ this.users[room.player_1_id] ? this.users[room.player_1_id].username :
                                                'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-info" v-if="room.player_2_id != null"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                        <img :src="this.$api_link + users[room.player_2_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px; padding-right: 5px;">
                                            {{ users[room.player_2_id] ? this.users[room.player_2_id].username : 'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary" v-else
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                        <div
                                            style="width: 40px; height: 40px; background-color: white; border-radius: 100px; ">
                                        </div>
                                        <p style="margin: 0px; padding-right: 5px;">
                                            Empty
                                        </p>
                                    </div>
                                    <div class="badge bg-info" v-if="room.player_3_id != null"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                        <img :src="this.$api_link + this.users[room.player_3_id].picture"
                                            style="width: 40px; height: 40px;" />
                                        <p style="margin: 0px; padding-right: 5px;">
                                            {{ this.users[room.player_3_id] ? this.users[room.player_3_id].username :
                                                'Empty' }}
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary" v-else-if="room.player_number == 3"
                                        style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                        <div
                                            style="width: 40px; height: 40px; background-color: white; border-radius: 100px; ">
                                        </div>
                                        <p style="margin: 0px; padding-right: 5px;">
                                            Empty
                                        </p>
                                    </div>
                                    <div class="badge bg-secondary disabled" style="justify-content: center; grid-gap: 5px; padding: 5px;" v-else>
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
