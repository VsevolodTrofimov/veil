<template>
  <md-card class="content"> {{text}} </md-card>
</template>

<script>
export default {
  name: 'app',
  props: ['text']
}
</script>

<style scoped>
    .content {
        padding: 16px;
    }
</style>