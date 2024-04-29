<template>
  <div class="col" style="text-align: center; margin-bottom: 15px;">
    <h1>Validate Administrators</h1>
  </div>
  <div class="row" v-if="admins.length > 0">
    <div class="col"
      style="display: grid; grid-template-columns: repeat(5, 200px); grid-gap: 30px; place-content: center;">
      <div class="col" style="margin: 0px; padding: 0px;">
        <ul class="list-group" style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;">
          <li class="list-group-item user-card" v-for="admin in admins" :key="admin.id">
            <div class="row" style="display: flex; justify-content: center; margin-bottom: 5px;">
              <div class="col" style="text-align: center;">
                <img :src="this.$api_link + admin.picture" style="width: 100px; height: 100px; border-radius: 50%;" />
              </div>
            </div>
            <div class="row" style="display: flex; flex-direction: column; gap: 2.5px; margin-bottom: 5px;">
              <h5 style="margin: 0px; padding: 0px;">{{ admin.name }}</h5><br />
              <p class="text-muted" style="text-align: center; font-style: italic; margin: 0px;">{{ admin.username }}
              </p>
            </div>
            <div class="row" style="justify-content: center;">
              <button class="menu-button" width="width: 100%; margin: 0px;" @click="validateAdmin(admin.id)">
                Validate
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="row" style="display: flex; justify-content: center; place-content: center;" v-else>
    <p style="width: 100%; text-align: center; font-size: 18px; top: 50%;">No pending administrators. <br /> Come back
      later to validate pending registrations.</p>
  </div>
</template>

<script>
import { auxiliaryFunctions } from '../assets/js/auxiliary_functions';
import { authStore } from '../store/authStore';
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
    this.toast = useToast()

    this.getAdmins()

    loader.hide()
  },

  data() {
    return {
      admins: []
    }
  },

  methods: {
    async getAdmins() {
      await this.$axios.get(this.$api_link + '/admin/pending-admins', this.auth.config)
        .then(response => {
          this.admins = response.data
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    },

    async validateAdmin(admin_id) {
      await this.$axios.post(this.$api_link + '/admin/validate-admin/' + admin_id, {}, this.auth.config)
        .then(response => {
          this.toast.success('Administrator validated successfully!')
          this.getAdmins()
        })
        .catch(error => {
          this.$router.push({ name: 'error', params: { afterCode: '_', code: error.response.status, message: error.response.statusText } })
        })
    }
  },
}
</script>
