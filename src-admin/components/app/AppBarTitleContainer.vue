<template>
  <div id="appBarTitleContainer" />
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component
export default class AppBarTitleContainer extends Vue {
}
</script>

<style lang="scss" scoped>
#appBarTitleContainer {
  min-width: 0; // https://stackoverflow.com/questions/38657688/text-overflow-ellipsis-not-working-in-a-nested-flex-container
}
</style>
