<template>
  <div :class="['a-table', widthClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['width']
})
export default class ATable extends Vue {
  $hasOptions = ['border'] // consumed by a-table-row and a-table-header

  A_TABLE = true

  get widthClass () {
    if (this.width === 'auto') {
      return 'width-auto'
    }
  }
}
</script>


<style scoped lang="scss">
.a-table {
  display: table;
  border-collapse: collapse;
  width: 100%;

  &.width-auto {
    width: auto;
  }

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
