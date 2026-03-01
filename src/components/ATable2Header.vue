<template>
  <div :class="['a-table2-header', {small: hasSmall, border: table2Border}]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['small'],
  inject: {
    table2Border: { default: false }
  }
})
export default class ATable2Header extends Vue {
  get hasSmall () {
    return this.small !== undefined && this.small !== false
  }
}
</script>


<style lang="scss" scoped>
.a-table2-header {
  display: contents;

  > :deep(*) {
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999999;
    font-size: .9rem;
    padding: .4rem 1.5rem .4rem 0;

    &:last-child {
      padding-right: 0;
    }
  }

  &.border > :deep(*) {
    border-bottom: 1px solid #EEEEEE;
    padding-left: .5rem;
    padding-bottom: .6rem;

    &:last-child {
      padding-right: .2rem;
    }
  }

  &.small > :deep(*) {
    font-size: .85rem;
  }

  &.small.border > :deep(*) {
    padding-bottom: .2rem;
  }
}
</style>
