<template>
  <div :class="['a-table']">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ATable extends Vue {
  $hasOptions = ['border']

  A_TABLE = true
}
</script>


<style scoped lang="scss">
.a-table {
  display: table;
  border-collapse: collapse;
  width: 100%;

  > * {
    display: table-row;

    > ::v-deep * {
      display: table-cell;

      white-space: nowrap;
      vertical-align: middle;

      &.info {
        background: none !important;
        color: #888888;
      }
    }
  }
}
</style>
