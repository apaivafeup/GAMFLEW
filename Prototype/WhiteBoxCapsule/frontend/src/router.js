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
    { name: 'wildcard', path: '/:pathMatch(.*)*', component: StaticError}
];

export const Router = createRouter({
    history: createWebHashHistory(),
    routes
});