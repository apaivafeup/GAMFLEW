<script setup>
import 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.css'
</script>

<template>
    <div v-if="this.auth.user.user_type != 'student'">
        <ClassModal />
        <h2 class="modal-title" style="text-align: center; margin-bottom: 7.5px;">Class Manager</h2>
        <div class="row" style="display: flex; justify-content: center;">
            <button class="admin-menu-button" data-bs-target="#class-modal" data-bs-toggle="modal"
                style="width: 150px;">
                Create Class
            </button>
        </div>

        <div class="row" style="display: flex; justify-content: center;">
            <div class="accordion" id="studentClassList" style="width: 1400px;">
                <div class="accordion-item" v-for="student_class in student_classes" v-if="student_classes.length > 0">
                    <h2 class="accordion-header" :id="'heading-' + student_class.id">
                        <button :id="'accordion-button-' + student_class.id" class="accordion-button collapsed"
                            type="button" @click="toggleAccordion(student_class.id)">
                            {{ student_class.name }}
                        </button>
                    </h2>
                    <div class="accordion-body accordion-collapse collapse" :id="'collapse-' + student_class.id"
                        data-bs-parent="studentClassList">
                        <div class="row" style="display: grid; grid-template-columns: repeat(2, 1fr);">
                            <div class="col">
                                <h4>Students</h4>
                                <input type="text" id="search-user-input" class="form-control" placeholder="Search..."
                                    style="margin: 5px 0px; position: relative;" @input="searchUsers()">
                                <ul class="list-group"
                                    style="border: 1px solid var(--border-color) !important; overflow: scroll; height: 300px;">
                                    <li class="list-group-item" v-for="user in filtered_users" style="border-radius: 10px;" v-if="filtered_users != []">
                                        <div class="container badge" style="display: grid; grid-template-columns: 75% 25%; place-content: start; flex-direction: row; border: 1px solid var(--border-color) !important; margin: 5px 15px; max-width: 95% !important; padding: 15px;">
                                            <div class="col"
                                                style="display: flex; flex-direction: row; place-content: center;">
                                                <img :src="this.$api_link + user.picture"
                                                    style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                                                <div class="col"
                                                    style="display: flex; flex-direction: column; place-content: center; text-align: left;">
                                                    <h5 style="color: black; margin-bottom: 2.5px;">{{ user.name }}</h5>
                                                    <p class="text-muted" style="margin: 0px; font-style: italic;">{{
                                                        user.username }}</p>
                                                </div>
                                            </div>

                                            <div class="col" style="display: flex; place-content: end;">
                                                <button class="menu-button" style="width: 100px;" v-if="notInClass(user, student_class)"
                                                    @click="addStudentToClass(student_class, user)">Add</button>
                                                <button class="menu-button" style="width: 100px;" v-else
                                                    @click="removeStudentFromClass(student_class, user)">Remove</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div class="col">
                                <h4>Challenges</h4>
                                <div class="col" style="display: flex; flex-direction: column; place-content: center;">
                                <input type="text" id="search-challenge-input" class="form-control"
                                    placeholder="Search..." style="margin: 5px 0px; position: relative;"
                                    @input="searchChallenges()">
                                    <div style="display: inline-flex; flex-direction: row; justify-content: center;">

                                        <div class="form-check form-switch" style="padding: 0px 25px;">
                                        <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" value="statement" @change="addFilter('statement')">
                                        <label class="form-check-label" for="flexRadioDefault1">
                                          Statement
                                        </label>
                                      </div>
                                      <div class="form-check form-switch" style="padding: 0px 25px;">
                                        <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" value="decision" @change="addFilter('decision')">
                                        <label class="form-check-label" for="flexRadioDefault2">
                                          Decision
                                        </label>
                                      </div>
                                      <div class="form-check form-switch" style="padding: 0px 25px;">
                                        <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" value="condition" @change="addFilter('condition')">
                                        <label class="form-check-label" for="flexRadioDefault2">
                                          Condition
                                        </label>
                                      </div>
                                      <div class="form-check form-switch" style="padding: 0px 25px;">
                                        <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" value="condition/decision" @change="addFilter('condition/decision')">
                                        <label class="form-check-label" for="flexRadioDefault2">
                                          C/D
                                        </label>
                                      </div>
                                      <div class="form-check form-switch" style="padding: 0px 25px;">
                                        <input class="form-check-input" type="checkbox" name="flexRadioDefault" id="flexRadioDefault2" value="mcdc" @change="addFilter('mcdc')">
                                        <label class="form-check-label" for="flexRadioDefault2">
                                          MC/DC
                                        </label>
                                      </div>
                                    </div> 
                                </div>
                                <ul class="list-group"
                                    style="border: 1px solid var(--border-color) !important; overflow: scroll; height: 300px;">
                                    <li class="list-group-item" v-for="code_file in code_files">
                                        <div class="container badge"
                                            style="display: grid; grid-template-columns: 75% 25%; flex-direction: row; place-content: center; border: 1px solid var(--border-color) !important; margin: 5px 15px; max-width: 95% !important; padding: 15px;">
                                            <div class="col"
                                                style="display: flex; flex-direction: row; place-content: center;">
                                                <div class="col"
                                                    style="display: flex; flex-direction: column; place-content: center; text-align: left;">
                                                    <h5 style="color: black; margin-bottom: 2.5px;">{{
                                                        code_file.name.split(':')[0] }}</h5>
                                                    <p class="text-muted" style="margin: 0px; font-style: italic;">
                                                        {{ code_file.name.split(':')[1] }}</p>
                                                </div>
                                            </div>

                                            <div class="col" style="display: flex; place-content: end;">
                                                <div class="passed-badge visible-badge button" style="
                                                align-self: start;
                                                text-align: right;
                                                font-size: 15px;
                                                font-weight: bold;
                                                width: auto;
                                                display: flex;
                                                margin-top: 0px;
                                                flex-direction: row;
                                                padding: 15px;
                                                margin-bottom: 2.5px;
                                                height: 100% !important;
                                              " @click="toggleCodeFileVisibility(student_class, code_file, true)">
                                                    Visible
                                                </div>
                                                <div class="passed-badge invisible-badge button" style="
                                                align-self: start;
                                                text-align: right;
                                                font-size: 15px;
                                                font-weight: bold;
                                                width: auto;
                                                display: flex;
                                                margin-top: 0px;
                                                flex-direction: row;
                                                padding: 15px;
                                                margin-bottom: 2.5px;
                                              " @click="toggleCodeFileVisibility(student_class, code_file, false)">
                                                    Invisible
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-group-item" v-for="challenge in filtered_challenges"
                                        :key="challenge.id">
                                        <div class="container badge"
                                            style="display: grid; grid-template-columns: 75% 25%; flex-direction: row; place-content: center; border: 1px solid var(--border-color) !important; margin: 5px 15px; max-width: 95% !important; padding: 15px;">
                                            <div class="col"
                                                style="display: flex; flex-direction: row; place-content: center;">
                                                <div class="col"
                                                    style="display: flex; flex-direction: column; place-content: center; text-align: left;">
                                                    <h5 style="color: black; margin-bottom: 2.5px;">{{
                                                        challenge.name.split(':')[0] }}</h5>
                                                    <p class="text-muted" style="margin: 0px; font-style: italic;">
                                                        {{ challenge.name.split(':')[1] }}</p>
                                                </div>
                                            </div>

                                            <div class="col" style="display: flex; place-content: end;">
                                                <div v-if="isVisible(challenge, student_class)" class="passed-badge visible-badge button" style="
                                                align-self: start;
                                                text-align: right;
                                                font-size: 15px;
                                                font-weight: bold;
                                                width: auto;
                                                display: flex;
                                                margin-top: 0px;
                                                flex-direction: row;
                                                padding: 15px;
                                                margin-bottom: 2.5px;
                                                height: 100% !important;
                                              " @click="toggleChallengeVisibility(student_class, challenge)">
                                                    Visible
                                                </div>
                                                <div v-else class="passed-badge invisible-badge button" style="
                                                align-self: start;
                                                text-align: right;
                                                font-size: 15px;
                                                font-weight: bold;
                                                width: auto;
                                                display: flex;
                                                margin-top: 0px;
                                                flex-direction: row;
                                                padding: 15px;
                                                margin-bottom: 2.5px;
                                              " @click="toggleChallengeVisibility(student_class, challenge)">
                                                    Invisible
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { boardStore } from '../store/boardStore.js'
import { auxiliaryFunctions, auxiliaryFunctionsNames } from '../assets/js/auxiliary_functions.js'
import { authStore } from '../store/authStore.js'
import Prism from 'prismjs'
import ClassModal from '../components/modals/ClassModal.vue'

export default defineComponent({
    beforeMount() {
        this.tab = 'board'
        this.code_coverage = 'statement'
        this.teacher_view = 'challenge_content_creator'

        this.board = boardStore()
        this.auth = authStore()

        this.getStudentClasses()
        this.getStudentClassesByUser()
        this.getUsers()
        this.getChallenges()
        this.getChallengeVisibility()
        this.getCodeFiles()
    },

    data() {
        return {
            student_classes: [],
            student_classes_users: {},
            users: [],
            filtered_users: [],
            challenges: [],
            challenge_visibility: [],
            filtered_challenges: []
        }
    },

    props: {
        placeholder: String
    },

    methods: {
        toggleAccordion(id) {
            let button = document.getElementById('accordion-button-' + id)
            let collapse = document.getElementById('collapse-' + id)

            if (collapse.classList.contains('show')) {
                collapse.classList.remove('show')
                button.classList.add('collapsed')
            } else {
                collapse.classList.add('show')
                button.classList.remove('collapsed')
            }
        },

        isVisible(challenge, student_class) {
            if (this.challenge_visibility == undefined || this.challenge_visibility == [] || this.challenge_visibility.find(challenge_visibility => challenge_visibility.challenge_id == challenge.id && challenge_visibility.student_class_id == student_class.id) == undefined) {
                return false
            }
            return this.challenge_visibility.find(challenge_visibility => challenge_visibility.challenge_id == challenge.id && challenge_visibility.student_class_id == student_class.id).visible
        },

        getChallengeVisibility() {
            this.$axios.get(this.$api_link + '/student-classes/challenges/visibility', this.auth.config)
                .then((response) => {
                    this.challenge_visibility = response.data
                    this.$forceUpdate()
                })
        },

        notInClass(user, student_class) {
            if (this.student_classes_users[student_class.id] == undefined) {
                return true
            }
            return this.student_classes_users[student_class.id].find(student => student.id == user.id) == undefined
        },

        toggleChallengeVisibility(studentClass, challenge) {
            this.$axios.post(this.$api_link + '/student-class/' + studentClass.id + '/challenge/' + challenge.id + '/visible', {}, this.auth.config)
                .then((response) => {
                    if (response.status == 200) {
                        this.getChallengeVisibility()
                        this.$forceUpdate()
                    } else {
                        alert('There was an error toggling the challenge visibility. Please try again.')
                    }
                })
        },

        toggleCodeFileVisibility(studentClass, codeFile, visible) {
            this.$axios.post(this.$api_link + '/student-class/' + studentClass.id + '/code-file/' + codeFile.id + '/visible', {
                visible: visible
            }, this.auth.config)
                .then((response) => {
                    if (response.status == 200) {
                        this.getChallengeVisibility()
                        this.$forceUpdate()
                    } else {
                        alert('There was an error toggling the code file visibility. Please try again.')
                    }
                })
        },

        addFilter(filter) {
            var filters = document.querySelectorAll('input[type="checkbox"]:checked')

            if (filters.length == 0) {
                this.filtered_challenges = this.challenges
                return
            }

            var result = []
            for (var i = 0; i < filters.length; i++) {

                var filtered = this.challenges.filter((challenge) => challenge.challenge_type == filters[i].value)
                for (var j = 0; j < filtered.length; j++) {
                    if (!result.includes(filtered[j])) {
                        result.push(filtered[j])
                    }
                }
            }
            
            this.filtered_challenges = result.sort((a, b) => a.id - b.id)

            console.log(this.filtered_challenges)
        },

        searchUsers() {
            var search = document.getElementById('search-user-input').value
            this.filtered_users = this.users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.username.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.id - b.id)
        },

        searchChallenges() {
            var search = document.getElementById('search-challenge-input').value
            this.filtered_challenges = this.challenges.filter((challenge) => challenge.name.toLowerCase().includes(search.toLowerCase()))
        },

        async getChallenges() {
            await this.$axios.get(this.$api_link + '/challenges-by-code/', this.auth.config).then((response) => {
                for (var list in response.data) {
                    for (var challenge in response.data[list])
                        this.challenges.push(response.data[list][challenge])
                }

                this.challenges = this.challenges.sort((a, b) => a.id - b.id)
                this.filtered_challenges = this.challenges
            }).catch((error) => {
                console.log(error)
            })
        },

        async getCodeFiles() {
            await this.$axios.get(this.$api_link + '/code-files/', this.auth.config).then((response) => {
                this.code_files = response.data
            }).catch((error) => {
                console.log(error)
            })
        }, 

        async getUsers() {
            await this.$axios.get(this.$api_link + '/users/', this.auth.config).then((response) => {
                this.users = response.data

                this.filtered_users = this.users.sort((a, b) => a.id - b.id)
            }).catch((error) => {
                console.log(error)
            })
        },

        async getStudentClasses() {
            await this.$axios.get(this.$api_link + '/student-class/', this.auth.config).then((response) => {
                this.student_classes = response.data
            }).catch((error) => {
                console.log(error)
            })
        },

        async getStudentClassesByUser() {
            await this.$axios.get(this.$api_link + '/student-class/users/', this.auth.config).then((response) => {
                this.student_classes_users = response.data
            }).catch((error) => {
                console.log(error)
            })
        },

        async addStudentToClass(student_class, student) {
            await this.$axios.post(this.$api_link + '/student-class/' + student_class.id + '/add-student/' + student.id, {}, this.auth.config).then((response) => {
                this.getStudentClasses()
                this.getUsers()
                this.getStudentClassesByUser()
                this.$forceUpdate()
            }).catch((error) => {
                console.log(error)
            })
        },

        async removeStudentFromClass(student_class, student) {
            await this.$axios.post(this.$api_link + '/student-class/' + student_class.id + '/remove-student/' + student.id, {}, this.auth.config).then((response) => {
                this.getStudentClasses()
                this.getStudentClassesByUser()
                this.getUsers()
                this.$forceUpdate()
            }).catch((error) => {
                console.log(error)
            })
        }

    },

    components: {
        ClassModal
    }
})
</script>