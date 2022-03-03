<template>
  <div :class="['a-grid', widthClass, colsClass, gapClass, evenClass, breakMobileClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['fullWidth', 'gap', 'hGap', 'vGap', 'cols', 'even', 'breakMobile']
})
export default class AGrid extends Vue {
  get widthClass () {
    if (this.fullWidth !== undefined) {
      return 'full'
    }
  }

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
    if (this.even !== undefined) {
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

  &.full {
    width: 100%;
  }

  &.cols-2 {
    grid-template-columns: auto auto;
    &.even {
      grid-template-columns: 1fr 1fr;
    }
  }

  &.cols-3 {
    grid-template-columns: auto auto auto;
    &.even {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &.cols-4 {
    grid-template-columns: repeat(4, auto);
    &.even {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &.cols-5 {
    grid-template-columns: repeat(5, auto);
    &.even {
      grid-template-columns: repeat(5, 1fr);
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
