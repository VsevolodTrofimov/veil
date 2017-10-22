<template>
    <md-list class='discussion'>
        <md-list-item v-for="(comment, idx) in comments" v-bind:key="idx">
            <div v-bind:class="{dark: idx % 2, item: true}">
                <Comment v-bind="comment" />
            </div>
        </md-list-item>
    </md-list>
</template>

<script>
    import store from '~/store/index'
    import Comment from '~/components/Comment.vue'

    export default {
        name: 'Discussion',
        name: 'app',
        props: ['comments'],
        components: {
            Comment
        },
    }
</script>

<style scoped>
    .discussion {
        background: white;
        flex: 1;
    }
    .dark {
        background: #eee;
    }
    .item {
        width: 100%;
    }
</style>