<template>
    <md-theme md-name="binary">
    <md-layout md-row md-align='center' md-vertical-align='center'>
        <md-button class="md-raised md-warn"
                   v-on:click="makeVerdict('offensive')"> Оскорбительный </md-button>
    
        <Comment v-bind:text=commentText />

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
                return store.getters.currentComment
            }
        },
        methods: {
            makeVerdict: verdict => {
                store.dispatch('verdict', verdict)
            }
        },
        components: {
            Comment
        },
        mounted: () => {
            store.dispatch('getDiscussions')
        }
    }
</script>