<template>
  <v-navigation-drawer
    id="sidebar"
    v-model="visible"
    app
    right
    disable-resize-watcher
    width="220"
  >
    <div id="sidebar__children">
      <div class="top" />
      <div class="bottom" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: []
})
export default class Sidebar extends Vue {
  visible = false

  mounted () {
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.$el.querySelector('#sidebar__children > .top'), { childList: true })
    this.mutationWatcher.observe(this.$el.querySelector('#sidebar__children > .bottom'), { childList: true })

    this.domChanged()
  }

  domChanged () {
    this.visible = this.hasSidebarItems()
  }

  getChildrenContainer () {
    return this.$el.querySelector('#sidebar__children')
  }

  hasSidebarItems () {
    return !!(this.$el.querySelector('#sidebar__children .top').children.length +
      this.$el.querySelector('#sidebar__children .bottom').children.length)
  }
}
</script>


<style lang="scss" scoped>
#sidebar {
  &__children {
    width: 100%;
  }
}

::v-deep .v-navigation-drawer__border {
  display: none;
}

#sidebar__children {
  height: 100%;
  padding: 2rem;
  // padding-left: 4rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
