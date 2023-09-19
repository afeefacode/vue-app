<template>
  <div :class="['a-table', widthClass, fixedClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['width', 'fixed']
})
export default class ATable extends Vue {
  $hasOptions = ['border'] // consumed by a-table-row and a-table-header

  A_TABLE = true

  get widthClass () {
    if (this.width === 'auto') {
      return 'width-auto'
    }
  }

  get fixedClass () {
    if (this.fixed !== undefined) {
      return 'fixed'
    }
  }
}
</script>


<style scoped lang="scss">
.a-table {
  display: table;
  border-collapse: separate;
  width: 100%;

  &.width-auto {
    width: auto;
  }

  &.fixed {
    table-layout: fixed;
  }

  > * {
    display: table-row;

    > :deep(*) {
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
