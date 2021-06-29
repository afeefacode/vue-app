<template>
  <div :class="['a-row', gapClass]">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['gap']
})
export default class ARow extends Vue {
  get gapClass () {
    if (this.gap) {
      return 'gap-' + this.gap
    }
  }
}
</script>


<style scoped lang="scss">
.a-row {
  display: flex;
  align-items: center;
}
</style>
