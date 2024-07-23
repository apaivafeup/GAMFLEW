<script>
import { authStore } from '../store/authStore.js'
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
            }, this.$slots.default);

        this.auth = authStore()
        this.auth.checkAuth()

        loader.hide()
    },

    methods: {
        async register(event) {
            event.preventDefault()

            const name = document.getElementById('name').value
            const username = document.getElementById('username').value
            const password = document.getElementById('password').value
            const passwordConfirm = document.getElementById('password-confirm').value
            const email = document.getElementById('email').value
            const picture = document.getElementById('picture').files[0] == undefined ? 'default.png' : document.getElementById('picture').files[0]
            const user_type = document.querySelector('input[type="radio"]:checked').value

            if (username === '' || password === '' || passwordConfirm === '' || email === '') {
                alert('Please fill all the fields.')
                return
            }

            if (password !== passwordConfirm) {
                alert('Passwords do not match. Check them again.')
                return
            }

            var picture_path
            const formData = new FormData()
            if (picture != 'default.png') {
                formData.append('file', picture)

                await this.$axios.post(this.$api_link + '/upload', formData)
                    .then(response => {
                        picture_path = response.data.file_url
                    })
                    .catch(error => {
                        alert('An error occurred while uploading your picture. Please try again later.')
                    })

            } else {
                picture_path = '/static/images/default.png'
            }

            const formData2 = {
                name: name,
                username: username,
                password: password,
                email: email,
                picture: picture_path,
                user_type: user_type,
                validated: user_type === 'admin' ? false : null
            }

            await this.$axios.post(this.$api_link + '/register', formData2)
                .then(response => {
                    if (response.status === 200) {
                        if (user_type === 'admin') {
                            alert('You have successfully registered. Your account will be validated by an existing Teacher user.')
                        } else {
                            alert('You have successfully registered. You can now login.')
                        }
                        this.$router.push({ name: 'home' })
                    } else {
                        alert('An error occurred while registering. Please try again later.')
                    }
                })
                .catch(error => {
                    alert('An error occurred while registering. Please try again later.')
                })
        }

    },
    components: {}
}
</script>

<template>
    <div>
        <div class="row" style="text-align: center; justify-content: center;">
            <img src="../assets/pictures/logo.png" style="width: 600px; margin-top: 30px;" />
        </div>
        <div class="row" style="justify-content: center; margin-top: 30px">
            <h2 style="text-align: center;">Register</h2>
        </div>
        <div class="row" style="justify-content: center;">
            <form style="width: 55%;">
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Name" />
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" aria-describedby="usernameHelp"
                        placeholder="username">
                    <small id="usernameHelp" class="form-text text-muted" style="font-size: 10px;">A username may be an
                        e-mail.</small>
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="password">Password</label>
                    <div class="row">
                        <div class="col">
                            <input type="password" class="form-control" id="password" placeholder="Password">
                        </div>
                        <div class="col">
                            <input type="password" class="form-control" id="password-confirm"
                                placeholder="Confirm Password">
                        </div>
                    </div>
                    <small id="passwordHelp" class="form-text text-muted" style="font-size: 10px;">We'll never share
                        your password with anyone
                        else.</small>
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="email">E-mail</label>
                    <input type="email" class="form-control" id="email" placeholder="E-mail address" />
                    <small id="emailHelp" class="form-text text-muted" style="font-size: 10px;">We'll never share your
                        e-mail with anyone
                        else. Make sure it's reachable.</small>
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="name">Photo</label>
                    <input type="file" class="form-control" id="picture" placeholder="Picture"
                        accept="image/png, image/jpeg, image/jpg" />
                    <small id="pictureHelp" class="form-text text-muted" style="font-size: 10px;">We only accept
                        JPG/JPEG and PNG files.</small>
                </div>
                <div class="form-group" style="margin-top: 10px;">
                    
                    <label for="name">User Type</label><br/>
                    <div class="row" style="display: grid; grid-template-columns: 50% 50%; grid-gap: 10px; --bs-gutter-x: 0px;">
                        <input type="radio" class="btn-check" name="options-outlined" style="width: 50%" id="btn-radio-student" value="player" checked />
                        <label class="btn btn-outline-primary" for="btn-radio-student">Student</label>
                        <input type="radio" class="btn-check" name="options-outlined" style="width: 50%" id="btn-radio-teacher" value="admin" />
                        <label class="btn btn-outline-primary" for="btn-radio-teacher">Teacher</label>
                    </div>
                    <small id="pictureHelp" class="form-text text-muted" style="font-size: 10px;">
                        A new Teacher account must be validated by an existing Teacher user.
                    </small>
                </div>

                <div class="form-group" style="justify-content: center; margin-top: 20px;">
                    <button type="submit" id="register-button" class="btn btn-primary" style="width: 100%;"
                        @click="register($event)">Register</button>
                </div>
            </form>
        </div>

    </div>
</template>
