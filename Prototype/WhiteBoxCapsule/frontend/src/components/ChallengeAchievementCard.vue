<template>
    <div class="card" style="height: 150px; padding: 10px;">
        <div class="card-body">
            <span style="display: flex; flex-direction: row; justify-content: center; align-items: center; margin-bottom: 10px;">
                <h2 class="card-title" style="margin-bottom: 0px; text-align: left; font-size: 18px; margin-right: 7.5px;">
                    {{ challenge.name.split(':')[0] }}
                </h2>
                <div v-if="unlocked" class="circle" style="text-align: center; display: flex; justify-content: center; align-items: center;">
                    <font-awesome-icon icon="check" color="white" />
                </div>
                <div v-else class="circle disabled" style="text-align: center; display: flex; justify-content: center; align-items: center; opacity: 35%;">
                    <font-awesome-icon icon="check" color="white" />
                </div>
            </span>
            <p class="card-text" style="font-style: italic; text-align: justify; font-size: 13px;">{{ challenge.achievement_hint }}</p>
        </div>
        
    </div>
</template>

<script>
import { Challenge } from '../store/models/Challenge.js'

export default {
    components: {},

    props: {
        challenge: Object,
        unlocked: Boolean
    }
}
</script>