<template>
  <div :class="['a-row', gapClass, directionClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['gap', 'vertical']
})
export default class ARow extends Vue {
  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }
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
  align-items: center;

  &.vertical {
    flex-direction: column;
  }
}
</style>
