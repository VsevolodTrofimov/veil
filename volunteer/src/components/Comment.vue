<template>
    <div class="card">
        <div v-if="user" class="user"> {{user}} </div>
        <div class="content"> {{text}} </div>
    </div>
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
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
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