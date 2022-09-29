<template>
  <div
    :class="['a-row', directionClass, gapClass, classes]"
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
    { vertical: false },
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
  display: flex;
  align-items: center;

  &.vertical {
    flex-direction: column;
    align-items: start;
  }
}
</style>
