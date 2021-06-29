<template>
  <v-badge
    :content="content_"
    v-bind="$attrs"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['content']
})
export default class ABadge extends Vue {
  content_ = ''

  created () {
    this.init()
  }

  @Watch('content')
  contentChanged () {
    this.init()
  }

  async init () {
    if (this.content instanceof Promise) {
      this.content_ = await this.content
    } else {
      this.content_ = this.content
    }
  }
}
</script>


<style scoped lang="scss">
::v-deep .v-badge__badge {
  color: #666666;
}
</style>
