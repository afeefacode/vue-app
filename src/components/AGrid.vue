<template>
  <div :class="['a-grid', widthClass, colsClass, gapClass, evenClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['fullWidth', 'gap', 'hGap', 'cols', 'even']
})
export default class AGrid extends Vue {
  get widthClass () {
    if (this.fullWidth !== undefined) {
      return 'full'
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
}
</style>
