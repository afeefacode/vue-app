<template>
  <div>
    <slot v-if="visible" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['title', 'icon']
})
export default class ATab extends Vue {
  visible = false

  show () {
    this.visible = true
  }

  hide () {
    this.visible = false
  }
}
</script>

<style lang="scss" scoped>
</style>
