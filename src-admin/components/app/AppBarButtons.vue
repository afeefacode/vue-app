<template>
  <div
    id="appBarButtons"
    class="d-flex align-center justify-end gap-3"
  />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppBarButtons extends Vue {
}
</script>


<style lang="scss" scoped>
#appBarButtons:empty {
  display: none !important;
}
</style>
