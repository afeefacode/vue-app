<template>
  <div class="itemRenderer">
    <div
      class="border"
      :style="{background: color}"
    />
    <div class="content">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['item']
})
export default class ItemRenderer extends Vue {
  get color () {
    return this.item.color || 'gray'
  }
}
</script>

<style lang="scss" scoped>
.itemRenderer {
  min-width: 200px;
  line-height: 1.2;
  display: flex;
  font-size: .9rem;

  .border {
    flex: 0 0 4px;
    margin-right: .5rem;
  }

  .content {
    padding: .2rem .2rem;
  }
}
</style>
