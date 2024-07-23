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
                <div class="accordion-item" v-for="student_class in student_classes">
                    <h2 class="accordion-header" :id="'heading-' + student_class.id"
                        v-if="student_class.teacher == auth.user_id"
                        style="display: grid; grid-template-columns: 80% 15%;">
                        <button :id="'accordion-button-' + student_class.id" class="accordion-button collapsed"
                            type="button" @click="toggleAccordion(student_class.id)">
                            {{ student_class.name }}
                        </button>
                        <button :id="'accordion-delete-button-' + student_class.id" class="menu-button" type="button"
                            style="margin: 20px; font-size: 12px; border-radius: 15px; "
                            @click="deleteStudentClass(code_file.id)">
                            Delete
                        </button>
                    </h2>
                    <div class="accordion-body accordion-collapse collapse" :id="'collapse-' + student_class.id"
                        data-bs-parent="studentClassList">
                        <ul class="list-group"
                            style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-gap: 10px;">
                            <li class="list-group-item" v-for="user in student_classes_users[student_class.id]"
                                :key="challenge.id">
                                <div style="display: flex; justify-content: space-between;">
                                    <p>{{ user.username }}</p>

                                    <button class="menu-button"
                                        @click="removeStudentFromClass(student_class, user)">Remove</button>
                                </div>
                            </li>
                            <li class="list-group-item" v-for="user in users" v-if="users != []">
                                <div style="display: flex; justify-content: space-between;">
                                    <p>{{ user.username }}</p>
                                    <button class="menu-button"
                                        @click="addStudentToClass(student_class, selectedStudent)">Add</button>
                                </div>
                            </li>
                        </ul>
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
    },

    data() {
        return {
            student_classes: [],
            student_classes_users: {},
            users: []
        }
    },

    props: {
        placeholder: String
    },

    methods: {
        async getUsers() {
            await this.$axios.get(this.$api_link + '/users/', this.auth.config).then((response) => {
                this.users = response.data
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
            }).catch((error) => {
                console.log(error)
            })
        },

        async removeStudentFromClass(student_class, student) {
            await this.$axios.delete(this.$api_link + '/student-class/' + student_class.id + '/remove-student/' + student.id, {}, this.auth.config).then((response) => {
                this.getStudentClasses()
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