<template>
  <div
    id="stickyHeader"
    :class="{visible}"
  >
    <a-row class="topbar">
      <v-app-bar-nav-icon
        v-if="sidebarIconVisible"
        class="mr-2 ml-3"
        title="Menu öffnen"
        @click="openSidebar"
      />

      <a-breadcrumbs />
    </a-row>

    <div :class="['d-flex align-center gap-8 mt-2']">
      <app-bar-title-container class="appBarTitle flex-grow-1" />
      <app-bar-buttons class="appBarButtons mr-2" />
    </div>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import AppBarButtons from './app/AppBarButtons'
import AppBarTitleContainer from './app/AppBarTitleContainer'
import { SidebarEvent } from '@a-admin/events'
import { sidebarService } from './sidebar/SidebarService'

@Component({
  components: {
    AppBarButtons,
    AppBarTitleContainer
  }
})
export default class StickyHeader extends Vue {
  visible = false

  sidebarIconVisible = false

  created () {
    this.$events.on(SidebarEvent.STATUS, ({payload: {navigation, mobile}}) => (this.sidebarIconVisible = !navigation || mobile))
  }

  mounted () {
    // watch mutation
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.$el.querySelector('.appBarTitle'), { childList: true })
    this.mutationWatcher.observe(this.$el.querySelector('.appBarButtons'), { childList: true })

    // watch intersection
    const el = document.querySelector('#stickyHeader')
    const observer = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle('is-pinned', e.intersectionRatio < 1)
      },
      { threshold: 1 }
    )
    observer.observe(el)

    this.domChanged()
  }

  domChanged () {
    this.visible = this.hasItems()
  }

  hasItems () {
    return !!(this.$el.querySelector('.appBarTitle').children.length +
      this.$el.querySelector('.appBarButtons').children.length)
  }

  openSidebar () {
    sidebarService.setNavigation(true)
  }
}
</script>


<style lang="scss" scoped>
#stickyHeader {
  position: sticky;
  left: 0;
  top: -32px;
  padding: .75rem 2rem;
  background-color: white;

  &:not(.visible) {
    display: none !important;
  }

  &.is-pinned {
    background: white;
    z-index: 2;
    box-shadow: 0 0 7px #00000033;
    border-bottom: 1px solid #EEEEEE;
  }

  .topbar {
    margin-left: -18px;
    margin-top: -18px;
    height:40px;
  }
}
</style>
