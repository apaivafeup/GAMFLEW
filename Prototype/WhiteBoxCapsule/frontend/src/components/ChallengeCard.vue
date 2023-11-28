<template>
    <div class="card challenge-card" @click="goToChallenge(challenge.id)" >
        <div class="card-body" style="">
            <div class="row" style="display: flex; justify-content: space-between;">
                <div style="width: 90%;">
                    <h5 class="card-title">{{challenge.name.split(':')[0]}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{challenge.name.split(':')[1]}}</h6>
                </div>
                <div style="width: 10%; display: flex; flex-direction: column; padding-right: 25px;">
                    <div class="row" style="align-items: center; font-size: 15px; justify-content: end;">
                        <font-awesome-icon icon="fa-clock" style="width: auto;" />
                        {{ challenge.timer + 's' }}
                    </div>
                    <div class="row" style="align-items: center; text-align: right; font-size: 12px; font-style: italic; justify-content: end; ">
                        {{ challenge.passing_criteria.type }}
                    </div>
                </div>
            </div>
          <p class="card-text">{{challenge.description}}</p>
        </div>
      </div>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
    props: {
        challenge: {}
    },

    methods: {
        goToChallenge(id) {
            this.$router.push('/challenge/' + id)
        },
    }
})
</script>
