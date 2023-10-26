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
    const mutationWatcher = new MutationObserver(this.domChanged)
    mutationWatcher.observe(this.getChildrenContainer(), { childList: true })
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
  background: white;
  padding: 0;

  &:not(.visible) {
    display: none;
  }

  &__children {
    width: 100%;
  }
}

#stickyFooterContainer__children {
  background: #F5F5F5;
  padding: 1rem;
}
</style>
