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
#appBarTitleContainer:empty {
  display: none;
}
</style>
