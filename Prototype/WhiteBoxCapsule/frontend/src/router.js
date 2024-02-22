import { createRouter, createWebHashHistory } from 'vue-router'

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
    { name: 'register', path: '/register', component: () => import('./pages/Register.vue') }
];

export const Router = createRouter({
    history: createWebHashHistory(),
    routes
});