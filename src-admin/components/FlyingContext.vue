<template>
  <div class="flyingContext">
    <div :class="contextId">
      <slot v-if="isVisible" />
    </div>
  </div>
</template>

<script>
import { Component, Watch, Vue } from '@a-vue'
import { FlyingContextEvent } from '@a-vue/events'
import { randomCssClass } from '@a-vue/utils/random'

@Component({
  props: [{show: false}]
})
export default class FlyingContext extends Vue {
  isVisible = false
  contextId = randomCssClass(10)

  created () {
    this.$events.on(FlyingContextEvent.HIDE_ALL, this.onHide)
  }

  mounted () {
    if (this.show) {
      this.showChanged()
    }
  }

  @Watch('show')
  showChanged () {
    if (this.isVisible === this.show) {
      return
    }

    this.isVisible = this.show
    const el = this.getContent()

    if (!el) {
      return // hmr reload removes dom element but keeps this instance
    }

    if (this.isVisible) {
      const container = this.getSidebarContainer()
      container.appendChild(el)
    } else {
      this.$el.appendChild(el)
    }
  }

  destroyed () {
    const container = this.getSidebarContainer()
    const el = this.getContent()
    if (container.contains(el)) {
      container.removeChild(el)
    }

    this.$events.off(FlyingContextEvent.HIDE_ALL, this.onHide)
  }

  onHide () {
    if (this.isVisible) {
      this.$el.appendChild(this.getContent())
      this.isVisible = false
      this.$emit('hide')
    }
  }

  getContent () {
    return document.querySelector('.' + this.contextId)
  }

  getSidebarContainer () {
    return document.getElementById('flyingContextContainer__children')
  }
}
</script>


<style lang="scss" scoped>
</style>
