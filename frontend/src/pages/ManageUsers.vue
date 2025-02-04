<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Manage Users</h1>
  </div>
  <div class="row" v-if="users.length > 0">
    <div class="col"
      style="display: grid; grid-template-columns: repeat(5, 200px); grid-gap: 30px; place-content: center;">
      <div class="col" style="margin: 0px; padding: 0px;">
        <ul class="list-group" style="display: grid; grid-template-columns: repeat(5, 200px); grid-gap: 10px;">
          <li class="list-group-item user-card" v-for="user in users" :key="user.id">
            <div class="row" style="display: flex; justify-content: center; margin-bottom: 5px;">
              <div class="col" style="text-align: center;">
                <img :src="this.$api_link + user.picture" style="width: 100px; height: 100px; border-radius: 50%;" />
              </div>
            </div>
            <div class="row" style="display: flex; flex-direction: column; gap: 2.5px; margin-bottom: 5px;">
              <h5 style="margin: 0px; padding: 0px; text-align: center;">{{ user.name }}</h5><br />
              <p class="text-muted" style="text-align: center; font-style: italic; margin: 0px;">{{ user.username }}
              </p>
            </div>
            <div class="row" style="justify-content: center;">
              <button class="menu-button" width="width: 100%; margin: 0px;" @click="deleteUser(user.id)">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from '../store/authStore.js';
import { useToast } from 'vue-toastification';
import { h, resolveComponent } from 'vue'
import LoadingIcon from '../components/LoadingIcon.vue';

export default {
  beforeMount() {
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

    if (this.auth.user.user_type != 'admin') {
      this.$router.push({ name: 'error', params: { afterCode: '403', code: 'Forbidden', message: 'You are not allowed to access this page.' } })
    }
    this.toast = useToast()

    this.getUsers()

    loader.hide()
  },

  data() {
    return {
      users: []
    }
  },

  methods: {
    async getUsers() {
      await this.$axios.get(this.$api_link + '/users/', this.auth.config)
        .then(response => {
          this.users = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    async deleteUser(user_id) {
      await this.$axios.post(this.$api_link + '/admin/delete-user/' + user_id, {}, this.auth.config)
        .then(response => {
          this.toast.success('User deleted!')
          this.getUsers()
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    }
  },
}
</script>
