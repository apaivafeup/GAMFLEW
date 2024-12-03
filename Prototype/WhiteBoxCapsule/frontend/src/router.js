import { createRouter, createWebHashHistory } from 'vue-router'
import Error from './pages/Error.vue'
import StaticError from './pages/StaticError.vue'

const routes = [
    { name: 'home', path: '/', component: () => import('./pages/Home.vue') },
    { name: 'how-to', path: '/how-to', component: () => import('./pages/HowToPlay.vue') },
    { name: 'credits', path: '/about', component: () => import('./pages/GameCredits.vue') },
    { name: 'challenges', path: '/challenges', component: () => import('./pages/ChallengesMenu.vue') },
    { name: 'challenge', path: '/challenge/:id', component: () => import('./pages/Challenge.vue'), props: true },
    { name: 'challenge-creator', path: '/challenge-creator', component: () => import('./pages/ChallengeCreator.vue') },
    { name: 'challenge-manager', path: '/challenge-manager', component: () => import('./pages/ChallengeEditor.vue') },
    { name: 'challenge-editor', path: '/challenge-editor/:id', component: () => import('./components/ChallengeEditor.vue'), props: true },
    { name: 'register', path: '/register', component: () => import('./pages/Register.vue'), props: false },
    { name: 'error', path: '/:code:afterCode(_):message', component: Error, props: true },
    { name: 'wildcard', path: '/:pathMatch(.*)*', component: StaticError },
    { name: 'loading', path: '/loading', component: () => import('./pages/Loading.vue') },
    { name: 'multiplayer', path: '/multiplayer', component: () => import('./pages/MultiplayerRooms.vue') },
    { name: 'multiplayer-room', path: '/multiplayer/:id', component: () => import('./pages/MultiplayerRoom.vue'), props: true },
    { name: 'user-export', path: '/user-export', component: () => import('./pages/UserExport.vue'), props: false },
    { name: 'manage-users', path: '/manage-users/', component: () => import('./pages/ManageUsers.vue'), props: false },
    { name: 'challenge-comments', path: '/challenges/:id/comments', component: () => import('./pages/ChallengeComments.vue'), props: true },
    { name: 'check-user-submissions', path: '/user-submissions', component: () => import('./pages/CheckUserSubmissions.vue'), props: false },
    { name: 'leaderboard', path: '/leaderboard', component: () => import('./pages/Leaderboard.vue'), props: false },
    { name: 'edit-user', path: '/edit-user/:id/', component: () => import('./pages/EditUser.vue'), props: true },
    { name: 'achievements', path: '/achievements', component: () => import('./pages/Achievements.vue'), props: false },
    { name: 'class-manager', path:'/class-manager', component: () => import('./pages/ClassManager.vue'), props: false },
];

const container = document.querySelector('#app')
let scrollOffset = { x: container.scrollTop, y: container.scrollLeft }

export const Router = createRouter({
    history: createWebHashHistory(),
    routes,
    // scrollBehavior(to, from, savedPosition) {
    //     console.log('scrolling!')
    //     if (savedPosition) {
    //         console.log('saved')
    //         return savedPosition
    //     } else if (to.hash) {
    //         console.log('to hash')
    //         return {
    //             el: to.hash,
    //             behavior: 'smooth',
    //         }
    //     } else {
    //         return scrollOffset
    //     }
    // }
});