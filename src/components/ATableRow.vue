<template>
  <div :class="['a-table-row', getFontSizeCssClass, {border: hasBorder}]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['small']
})
export default class ATableRow extends Vue {
  $hasOptions = ['border']

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
    return this.$has.border && this.table.$has.border
  }

  get getFontSizeCssClass () {
    if (this.small !== undefined) {
      return 'small'
    }
  }
}
</script>


<style scoped lang="scss">
.a-table-row {
  > * {
    padding: .15rem;
    padding-right: 1.5rem;
    &:last-child {
      padding-right: .1rem;
    }
  }

  &.border {
    border-bottom: 1px solid #E5E5E5;
    > * {
      padding: .4rem;
      &:last-child {
        padding-right: .4rem;
      }
    }
  }

  &:hover {
    background: #F4F4F4;
  }

  &:last-child {
    border: none;
  }

  &.small {
    font-size: .9rem;
  }
}
</style>
