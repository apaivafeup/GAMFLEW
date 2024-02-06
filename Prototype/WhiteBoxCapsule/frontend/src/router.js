import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { name: 'home', path: '/', component: () => import('./pages/Home.vue') },
    { name: 'how-to', path: '/how-to', component: () => import('./pages/HowToPlay.vue') },
    { name: 'credits', path: '/about', component: () => import('./pages/GameCredits.vue') },
    { name: 'challenges', path: '/challenges', component: () => import('./pages/ChallengesMenu.vue') },
    { name: 'challenge', path: '/challenge/:id', component: () => import('./pages/Challenge.vue'), props: true },
    { name: 'challenge-content-creator', path: '/content-creator', component: () => import('./pages/ChallengeContentCreator.vue') },
];

export const Router = createRouter({
    history: createWebHashHistory(),
    routes
});