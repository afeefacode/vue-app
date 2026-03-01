<template>
  <div :class="['a-table2', {border: hasBorder}]" :style="gridStyle">
    <slot />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [{border: false}, 'columns'],
  provide () {
    return {
      table2Border: this.hasBorder
    }
  }
})
export default class ATable2 extends Vue {
  get hasBorder () {
    return this.border !== false && this.border !== undefined
  }

  get gridStyle () {
    const columns = this.columns || []
    return {
      'grid-template-columns': columns.join(' ')
    }
  }
}
</script>


<style lang="scss" scoped>
.a-table2 {
  display: grid;
  width: 100%;
}
</style>
