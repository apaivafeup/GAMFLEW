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
            }, this.$slots.default);

        this.auth = authStore()
        this.auth.checkAuth()

        await this.$axios.get(this.$api_link + '/game-rooms/', this.auth.config)
            .then(response => {
                this.rooms = response.data
                this.rooms = this.rooms.sort((a, b) => a.id - b.id)
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
                .then((response) => {
                    console.log("Hey!")
                    if (response.data == null) {
                        this.$router.push({ name: 'error', params: { afterCode: '401', code: "Unauthorized", message: "Room is full." } })
                    } else {
                        this.$router.push({ name: 'multiplayer-room', params: { id: id } })
                    }
                })
                .catch(error => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        },

        async deleteRoom(id) {
            await this.$axios.delete(this.$api_link + '/game-room/' + id, this.auth.config)
                .then((response) => {
                    if (response.status.code == 200) {
                        this.$router.go()
                    }
                })
                .catch((error) => {
                    this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
                    return
                })
        }
    },
    components: { CreateRoomModal }
}
</script>

<template>
    <div class="col" style="display: flex; flex-direction: column; justify-content: center; align-content: center;">
        <CreateRoomModal />
        <div class="row" style="margin-bottom: 10px;">
            <h2 style="text-align: center;">Multiplayer Rooms</h2>
        </div>
        <div class="row" style="display: flex; flex-direction: row; justify-content: end; margin-bottom: 15px;">
            <button class="btn btn-primary" style="padding: 10px; width: auto; margin-right: 12.5px;" data-bs-target="#create-room-modal"
                data-bs-toggle="modal">Create Room</button>
        </div>
        <div class="row" style="padding: 0px; justify-content: center; display: flex; flex-direction: row;">
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
                                        style="font-size: 15px; font-style: italic; padding: 0px; margin: 0px !important;">
                                        {{ room.rounds + ' rounds, ' + room.player_number + ' players' }}</p>
                                </div>
                                <div class="col" style="justify-content: end; display: flex;">
                                    <button class="btn btn-primary" style="padding: 15px; border-radius: 10px;"
                                        @click="enterRoom(room.id)">Enter</button>
                                    <button class="btn btn-primary" v-if="room.room_owner == auth.user.id"
                                        style="padding: 15px; border-radius: 10px;"
                                        @click="deleteRoom(room.id)">Delete</button>
                                </div>
                            </div>
                            <div class="row" style="margin-top: 15px;">
                                <div class="col" style="display: flex; flex-direction: column; align-content: start;">
                                    <h6 style="font-size: 15px; font-style: italic;">Players</h6>
                                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 1vw;">
                                        <div class="badge bg-info" v-if="room.player_1_id != null"
                                            style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <img :src="this.$api_link + users[room.player_1_id].picture"
                                                style="width: 40px; height: 40px;" />
                                            <p style="margin: 0px; padding-right: 5px;">
                                                {{ users[room.player_1_id] ? users[room.player_1_id].username :
                                                'Empty' }}
                                            </p>
                                        </div>
                                        <div class="badge bg-secondary" v-else style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <div style="width: 40px; height: 40px; background-color: white; border-radius: 100px; ">
                                            </div>
                                            <p style="margin: 0px; padding-right: 5px;">
                                                Empty
                                            </p>
                                        </div>
                                        <div class="badge bg-info" v-if="room.player_2_id != null"
                                            style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <img :src="this.$api_link + users[room.player_2_id].picture"
                                                style="width: 40px; height: 40px;" />
                                            <p style="margin: 0px; padding-right: 5px;">
                                                {{ users[room.player_2_id] ? users[room.player_2_id].username :
                                                'Empty' }}
                                            </p>
                                        </div>
                                        <div class="badge bg-secondary" v-else style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <div style="width: 40px; height: 40px; background-color: white; border-radius: 100px; ">
                                            </div>
                                            <p style="margin: 0px; padding-right: 5px;">
                                                Empty
                                            </p>
                                        </div>
                                        <div class="badge bg-info" v-if="room.player_3_id != null"
                                            style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <img :src="this.$api_link + users[room.player_3_id].picture"
                                                style="width: 40px; height: 40px;" />
                                            <p style="margin: 0px; padding-right: 5px;">
                                                {{ users[room.player_3_id] ? users[room.player_3_id].username :
                                                'Empty' }}
                                            </p>
                                        </div>
                                        <div class="badge bg-secondary" v-else-if="room.player_number == 3" style="display: grid; grid-template-columns: 40px calc(100% - 40px); grid-gap: 5px; padding: 5px;">
                                            <div style="width: 40px; height: 40px; background-color: white; border-radius: 100px; ">
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
        </div>
    </div>
</template>
