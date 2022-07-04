<template>
  <div class="stickyFooter">
    <div :class="contextId">
      <slot />
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { randomCssClass } from '@a-vue/utils/random'

@Component
export default class StickyFooter extends Vue {
  contextId = randomCssClass(10)

  mounted () {
    const container = this.getFooterContainer()
    container.appendChild(this.getContent())
  }

  destroyed () {
    const container = this.getFooterContainer()
    const el = this.getContent()
    if (container.contains(el)) {
      container.removeChild(el)
    }
  }

  getContent () {
    return document.querySelector('.' + this.contextId)
  }

  getFooterContainer () {
    return document.getElementById('stickyFooterContainer__children')
  }
}
</script>


<style lang="scss" scoped>
</style>
