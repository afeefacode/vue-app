<template>
  <div :class="['a-table-header', getFontSizeCssClass, {border: hasBorder}]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['small']
})
export default class ATableHeader extends Vue {
  get table () {
    let parent = this.$parent
    while (parent) {
      if (parent.A_TABLE) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  get hasBorder () {
    return this.table.$has.border
  }

  get getFontSizeCssClass () {
    if (this.small !== undefined) {
      return 'small'
    }
  }
}
</script>


<style scoped lang="scss">
.a-table-header {
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999999;
  font-size: .9rem;

  > * {
    padding: .4rem 0;
    padding-right: 1rem;
    &:last-child {
      padding-right: 0;
    }
  }

  &.border {
    border-bottom: 1px solid #EEEEEE;
    > * {
      padding-left: .5rem;
      padding-right: 1rem;
      padding-bottom: .2rem;
      &:last-child {
        padding-right: .2rem;
      }
    }
  }

  &.small {
    > * {
      font-size: .85rem;
    }

    &.border {
      > * {
        padding-bottom: .2rem;
      }
    }
  }
}
</style>
