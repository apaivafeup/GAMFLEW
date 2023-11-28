<template>
    <div class="col" style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <div class="accordion" id="accordionExample" style="width: 1000px;">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne">
                        Module 0: First Steps
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ul class="list-group">
                            <!--TODO: Make this organized by module. -->
                            <li class="list-group-item" v-for="challenge in challenges">
                                <ChallengeCard :challenge="challenge" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Module 1: TBD
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  Module 2: TBD
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                  
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'
import ChallengeCard from './ChallengeCard.vue'

export default defineComponent({
    components: { ChallengeCard },

    async beforeMount() {
        await axios.get('http://localhost:8000/challenges/')
            .then((response) => {
                this.challenges = response.data
            })
    },

    data() {
        return {
            challenges: []
        }
    },
})
</script>
