<template>
    <md-card class="card">
        <div v-if="user" class="user"> {{user}} </div>
        <div class="content"> {{text}} </div>
    </md-card>
</template>

<script>
    export default {
        name: 'app',
        props: ['text', 'user']
    }
</script>

<style scoped>
    .user {
        font-size: 24px;
        font-weight: bold;
        border-right: 1px solid grey;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
    }

    .card {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .content {
        padding: 16px;
    }
</style>