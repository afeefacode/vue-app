<template>
  <div :class="['a-row', widthClass, alignClass, gapClass, directionClass, justifyClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['fullWidth', 'gap', 'start', 'stretch', 'center', 'vertical', 'right']
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
