<template>
    <md-theme md-name="binary">
    <md-layout md-row md-align='center' md-vertical-align='center'>
        <md-button class="md-raised md-warn"
                   v-on:click="makeVerdict('offensive')"> Оскорбительный </md-button>
    
        <md-card class='card'> <Comment v-bind="commentText" /> </md-card>

        <md-button class="md-raised md-primary"
                   v-on:click="makeVerdict('ok')"> Ничего плохого </md-button>
    </md-layout>
    </md-theme>
</template>

<script>
    import store from '~/store/index'
    import Comment from '~/components/Comment.vue'

    export default {
        name: 'CommentRank',
        computed: {
            commentText() {
                return store.getters.currentComment || 'Loading'
            }
        },
        methods: {
            makeVerdict: verdict => {
                store.dispatch('verdict', verdict)
            }
        },
        components: {
            Comment
        }
    }
</script>

<style scoped>
    .card {
        width: 660px;
    }

    @media (max-width: 600px) {
        .card {
            width: 100%;
        }
    }
</style>
