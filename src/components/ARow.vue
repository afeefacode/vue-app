<template>
  <div
    :class="['a-row', alignClass, gapClass, directionClass, justifyClass]"
    :style="cwm_widthStyle"
  >
    <slot />
  </div>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: [
    'gap',
    'start',
    'stretch',
    'center',
    'vertical',
    'right'
  ]
})
export default class ARow extends Mixins(ComponentWidthMixin) {
  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }
  }

  get alignClass () {
    if (this.start !== undefined) {
      return 'start'
    }

    if (this.stretch !== undefined) {
      return 'stretch'
    }

    if (this.vertical !== undefined) {
      return this.center !== undefined ? 'center' : 'start'
    }

    return 'center'
  }

  get directionClass () {
    if (this.vertical !== undefined) {
      return 'vertical'
    }
  }

  get justifyClass () {
    if (this.right !== undefined) {
      return 'right'
    }
  }
}
</script>


<style scoped lang="scss">
.a-row {
  display: flex;

  &.full {
    width: 100%;
  }

  &.vertical {
    flex-direction: column;
  }

  &.center {
    align-items: center;
  }

  &.start {
    align-items: flex-start;
  }

  &.stretch {
    align-items: stretch;
  }

  &.right {
    justify-content: flex-end;
  }
}
</style>
