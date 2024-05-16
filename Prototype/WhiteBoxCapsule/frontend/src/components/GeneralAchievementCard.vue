<template>
    <div class="card" v-if="unlocked" style="height: 100px;">
        <div class="card-body">
            <span style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin-bottom: 10px;">
                <h4 class="card-title" style="margin-bottom: 0px; text-align: left; font-size: 16px; margin-right: 7.5px;">
                    {{ general_achievement.name }}
                </h4>
                <div class="circle" style="text-align: center; display: flex; justify-content: center; align-items: center;">
                    <font-awesome-icon icon="check" color="white" />
                </div>
            </span>
            <p class="card-text disabled" style="font-style: italic; text-align: center; font-size: 12px;">{{ general_achievement.hint }}</p>
        </div>  
    </div>
    <div class="card locked" v-else style="opacity: 0.5; height: 100px; text-align: center; display: flex; justify-content: center; align-content: center; background-color: rgb(169, 89, 255); color: rgb(169, 89, 255);">
        {{ general_achievement.hint }}
    </div>
</template>

<style>
.card.locked:hover {
    color: white !important;
}

</style>

<script>
import { Challenge } from '../store/models/Challenge.js'

export default {
    components: {},

    props: {
        general_achievement: Object,
        unlocked: Boolean
    }
}
</script>