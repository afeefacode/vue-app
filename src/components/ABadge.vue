<template>
  <v-badge
    :content="internalContent"
    v-bind="$attrs"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['content']
})
export default class ABadge extends Vue {
  internalContent = ''

  created () {
    this.init()
  }

  @Watch('content')
  contentChanged () {
    this.init()
  }

  async init () {
    if (this.content instanceof Promise) {
      this.internalContent = await this.content
    } else {
      this.internalContent = this.content
    }
  }
}
</script>


<style scoped lang="scss">
::v-deep .v-badge__badge {
  color: #666666;
}
</style>
