<template>
  <div :class="['a-grid', widthClass, colsClass, gapClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['fullWidth', 'gap', 'hGap', 'cols']
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
  }

  &.cols-3 {
    grid-template-columns: auto auto auto;
  }

  &.cols-4 {
    grid-template-columns: repeat(4, auto);
  }

  &.cols-5 {
    grid-template-columns: repeat(5, auto);
  }
}
</style>
