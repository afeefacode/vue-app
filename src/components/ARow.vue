<template>
  <div :class="['a-row', widthClass, alignClass, gapClass, directionClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['fullWidth', 'gap', 'start', 'vertical']
})
export default class ARow extends Vue {
  get widthClass () {
    if (this.fullWidth !== undefined) {
      return 'full'
    }
  }

  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }
  }

  get alignClass () {
    if (this.start !== undefined) {
      return 'left'
    }
    return this.vertical !== undefined ? 'left' : 'center'
  }

  get directionClass () {
    if (this.vertical !== undefined) {
      return 'vertical'
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

  &.left {
    align-items: flex-start;
  }
}
</style>
