<template>
    <div id="app">
        <md-toolbar>
            <h1 class="md-title">Оценка оскорбительности</h1>
        </md-toolbar>
        
        <md-layout md-gutter 
                   md-vertical-align='center'
                   md-column
                   class="content">
            <CommentRank v-if="stage==='comment'" />
            <DiscussionRank v-else/>
        </md-layout>
    </div>
</template>

<script>
    import store from '~/store/index'
    import CommentRank from '~/components/CommentRank.vue'
    import DiscussionRank from '~/components/DiscussionRank.vue'

    export default {
        name: 'app',
        computed: {
            stage: () => store.state.stage
        },
        components: {
            CommentRank,
            DiscussionRank
        }
    }
</script>

<style scoped>
    #app {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }

    .content {
        padding: 16px;
        flex: 1;
    }
</style>