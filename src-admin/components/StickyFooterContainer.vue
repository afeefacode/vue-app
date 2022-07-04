<template>
  <v-footer
    id="stickyFooterContainer"
    fixed
    app
    inset
    :class="{visible}"
  >
    <div id="stickyFooterContainer__children" />
  </v-footer>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: []
})
export default class StickyFooterContainer extends Vue {
  visible = false

  mounted () {
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.getChildrenContainer(), { childList: true })
  }

  domChanged () {
    const container = this.getChildrenContainer()
    this.visible = !!container.children.length

    this.$nextTick(() => {
      const mainStyle = document.getElementById('v-main').style
      if (this.visible) {
        mainStyle.paddingBottom = this.$el.offsetHeight + 'px'
      } else {
        mainStyle.paddingBottom = '0px'
      }
    })
  }

  getChildrenContainer () {
    return this.$el.querySelector('#stickyFooterContainer__children')
  }
}
</script>


<style lang="scss" scoped>
#stickyFooterContainer {
  padding: 1rem;

  &:not(.visible) {
    display: none;
  }

  &__children {
    width: 100%;
  }
}
</style>
