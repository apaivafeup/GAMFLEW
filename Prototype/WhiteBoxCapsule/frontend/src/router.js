import { createRouter, createWebHashHistory } from 'vue-router'
import Error from './pages/Error.vue'
import StaticError from './pages/StaticError.vue'

const routes = [
    { name: 'home', path: '/', component: () => import('./pages/Home.vue') },
    { name: 'how-to', path: '/how-to', component: () => import('./pages/HowToPlay.vue') },
    { name: 'credits', path: '/about', component: () => import('./pages/GameCredits.vue') },
    { name: 'challenges', path: '/challenges', component: () => import('./pages/ChallengesMenu.vue') },
    { name: 'challenge', path: '/challenge/:id', component: () => import('./pages/Challenge.vue'), props: true },
    { name: 'challenge-content-creator', path: '/content-creator', component: () => import('./pages/ChallengeContentCreator.vue') },
    { name: 'challenge-manager', path: '/challenge-manager', component: () => import('./pages/ChallengeManager.vue')},
    { name: 'challenge-creator', path: '/challenge-creator', component: () => import('./pages/ChallengeCreatorEditor.vue'), props: false },
    { name: 'challenge-editor', path: '/challenge-editor/:id', component: () => import('./pages/ChallengeCreatorEditor.vue'), props: true },
    { name: 'register', path: '/register', component: () => import('./pages/Register.vue'), props: false },
    { name: 'error', path: '/:code:afterCode(_):message', component: Error, props: true },
    { name: 'wildcard', path: '/:pathMatch(.*)*', component: StaticError},
    { name: 'loading', path: '/loading', component: () => import('./pages/Loading.vue')},
    { name: 'multiplayer', path: '/multiplayer', component: () => import('./pages/MultiplayerRooms.vue')},
    { name: 'multiplayer-room', path: '/multiplayer/:id', component: () => import('./pages/MultiplayerRoom.vue'), props: true},
    { name: 'user-export', path: '/user-export', component: () => import('./pages/UserExport.vue'), props: false},
    { name: 'validate-admin', path: '/validate-admin', component: () => import('./pages/ValidateAdmin.vue'), props: false},
    { name: 'challenge-comments', path: '/challenges/:id/comments', component: () => import('./pages/ChallengeComments.vue'), props: true},
    { name: 'check-user-submissions', path: '/user-submissions', component: () => import('./pages/CheckUserSubmissions.vue'), props: false},
];

export const Router = createRouter({
    history: createWebHashHistory(),
    routes
});