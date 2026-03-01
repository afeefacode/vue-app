<template>
  <div
    :class="['a-table2-row', {border: table2Border, small: hasSmall, tiny: hasTiny, selected, disabled}]"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{tiny: false, small: false}, 'selected', 'disabled'],
  inject: {
    table2Border: { default: false }
  }
})
export default class ATable2Row extends Vue {
  get hasSmall () {
    return this.small !== undefined && this.small !== false
  }

  get hasTiny () {
    return this.tiny !== undefined && this.tiny !== false
  }

  mounted () {
    this.applyColspan()
  }

  updated () {
    this.applyColspan()
  }

  applyColspan () {
    if (!this.$el || !this.$el.children) return
    for (const child of this.$el.children) {
      const colspan = child.dataset.colspan
      if (colspan) {
        child.style.gridColumn = `span ${colspan}`
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.a-table2-row {
  display: contents;

  > :deep(*) {
    padding: .15rem 1.5rem .15rem 0;
    vertical-align: top;

    &:last-child {
      padding-right: .1rem;
    }
  }

  &.border > :deep(*) {
    border-bottom: 1px solid #E5E5E5;
    padding: .4rem 1.5rem .4rem .4rem;

    &:last-child {
      padding-right: .4rem;
    }
  }

  &:hover > :deep(*) {
    background: #F4F4F4;
  }

  &.selected > :deep(*) {
    background: #F4F4F4;
  }

  &.disabled {
    pointer-events: none;
    opacity: .5;
  }

  // Small mode
  &.small > :deep(*) {
    font-size: .9rem;
  }

  &.small.border > :deep(*) {
    padding-top: .2rem;
    padding-bottom: .2rem;
  }

  // Tiny mode
  &.tiny > :deep(*) {
    font-size: .8rem;
  }

  &.tiny.border > :deep(*) {
    padding-top: .1rem;
    padding-bottom: .1rem;
  }

  // Text truncation utility
  :deep(.a-table-cell-truncate) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
