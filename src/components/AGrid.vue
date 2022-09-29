<template>
  <div :class="['a-grid', colsClass, gapClass, evenClass, breakMobileClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['gap', 'hGap', 'vGap', 'cols', {even: false}, 'breakMobile']
})
export default class AGrid extends Mixins(ComponentWidthMixin) {
  get breakMobileClass () {
    if (this.breakMobile !== undefined) {
      return 'breakMobile'
    }
  }

  get colsClass () {
    const cols = this.cols || 2
    return 'cols-' + cols
  }

  get evenClass () {
    if (this.even) {
      return 'even'
    }
  }

  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }

    const classes = []

    if (this.hGap) {
      classes.push('h-gap-' + this.hGap)
    }

    if (this.vGap) {
      classes.push('v-gap-' + this.vGap)
    }

    return classes.join(' ') || null
  }
}
</script>


<style scoped lang="scss">
.a-grid {
  display: grid;

  @for $i from 1 through 8 {
    &.cols-#{$i} {
      grid-template-columns: repeat(#{$i}, auto);
      &.even {
        grid-template-columns: repeat(#{$i}, 1fr);
      }
    }
  }

  &.breakMobile {
    @media (max-width: 900px), (orientation : portrait) {
      grid-template-columns: 1fr;
      &.even {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
