<template>
    <div id="app">
        <md-toolbar>
            <h1 class="md-title">Оценка оскорбительности коммента</h1>
        </md-toolbar>

        
        <md-layout md-gutter 
                   md-vertical-align='center'
                   class="content">
            <CommentRank />
        </md-layout>
    </div>
</template>

<script>
    import CommentRank from '~/components/CommentRank.vue'

    export default {
        name: 'app',
        components: {
            CommentRank
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