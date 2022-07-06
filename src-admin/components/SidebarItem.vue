<template>
  <div class="sidebarItem">
    <div :class="contextId">
      <slot />
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { randomCssClass } from '@a-vue/utils/random'

@Component({
  props: [
    {
      top: true,
      bottom: false
    }
  ]
})
export default class SidebarItem extends Vue {
  contextId = randomCssClass(10)

  mounted () {
    const container = this.getSidebarContainer()
    console.log(container)
    container.appendChild(this.getContent())
  }

  destroyed () {
    const container = this.getSidebarContainer()
    const el = this.getContent()
    if (container.contains(el)) {
      container.removeChild(el)
    }
  }

  getContent () {
    return document.querySelector('.' + this.contextId)
  }

  getSidebarContainer () {
    console.log('toporbottom', this.$props)
    return document.querySelector('#sidebar__children > .' + this.position)
  }

  get position () {
    if (this.bottom) {
      return 'bottom'
    } else {
      return 'top'
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
