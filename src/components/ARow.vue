<template>
  <div
    :style="cwm_widthStyle + ' ' + displayStyle"
    :class="['a-row', directionClass, gapClass, classes]"
  >
    <slot />
  </div>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: [
    { vertical: false, inline: false },
    'gap'
  ]
})
export default class ARow extends Mixins(ComponentWidthMixin) {
  get classes () {
    const classes = {}
    Object.keys(this.$attrs).forEach(cssClass => {
      classes[cssClass] = true
    })
    return classes
  }

  get displayStyle () {
    return 'display: ' + (this.inline ? 'inline-flex' : 'flex') + ';'
  }

  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }
  }

  get directionClass () {
    if (this.vertical) {
      return 'vertical'
    }
  }
}
</script>


<style scoped lang="scss">
.a-row {
  align-items: center;

  &.vertical {
    flex-direction: column;
    align-items: start;
  }

  &.even > * {
    flex: 1;
  }
}
</style>
