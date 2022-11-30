<template>
  <div class="flyingContext">
    <div :class="contextId">
      <slot v-if="isVisible" />
    </div>
  </div>
</template>

<script>
import { Component, Watch, Mixins } from '@a-vue'
import { FlyingContextEvent } from '@a-vue/events'
import { randomCssClass } from '@a-vue/utils/random'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'

@Component({
  props: [{show: false}, 'beforeClose']
})
export default class FlyingContext extends Mixins(CancelOnEscMixin) {
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
      this.coe_watchCancel() // show context -> watch esc
    } else {
      this.$el.appendChild(el)
      this.coe_unwatchCancel() // hide context -> do not watch esc any more
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

  async onHide () {
    if (this.isVisible) {
      if (this.beforeClose) {
        const result = await this.beforeClose()
        if (!result) {
          return
        }
      }

      this.$el.appendChild(this.getContent())
      this.coe_unwatchCancel() // hide context -> do not watch esc any more
      this.isVisible = false
      this.$emit('hide')
    }
  }

  coe_cancelOnEsc () {
    this.onHide()
    return false // stop esc propagation
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
