<template>
    <md-theme md-name="binary" class='host'>
    <md-layout md-column md-align='center' md-vertical-align='center'>
        <md-card class="card">
            <Discussion v-bind:comments='discComments' />
        </md-card>
    </md-layout>

    <md-layout md-row md-align='center' md-vertical-align='center'>
        <md-button class="md-raised md-warn"
                   v-on:click="makeVerdict('offensive')"> Оскорбительный </md-button>
    
        <md-button class="md-raised md-primary"
                   v-on:click="makeVerdict('ok')"> Ничего плохого </md-button>
    </md-layout>
    
    </md-theme>
</template>

<script>
    import store from '~/store/index'
    import Discussion from '~/components/Discussion.vue'

    export default {
        name: 'DiscussionRank',
        computed: {
            discComments: () => {
                return store.getters.currentDiscussion.comments || []
            }
        },
        methods: {
            makeVerdict: verdict => {
                store.dispatch('verdictDiscussion', verdict)
            }
        },
        components: {
            Discussion
        }
    }
</script>

<style scoped>
    .host {
        width: 100%;
    }
    .card {
        width: 100%;
        margin-bottom: 16px;
        max-width: 660px;
    }
</style>
