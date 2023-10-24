<template>
  <div
    v-show="visible"
    id="information-bar"
    :class="{mobile, rail}"
    :style="widthStyle"
  >
    <div :class="['toggleButton', {rail}]">
      <v-app-bar-nav-icon
        :title="'Menü ' + (rail ? 'ausklappen' : 'einklappen')"
        @click="toggleRail"
      >
        <v-icon>
          {{ rail ? openMenuIcon : closeMenuIcon }}
        </v-icon>
      </v-app-bar-nav-icon>
    </div>

    <div
      id="information-bar__children"
      :class="{rail}"
    >
      <div class="top" />

      <div class="bottom" />
    </div>
  </div>
</template>

<script>
import { Component, Vue, Watch } from '@a-vue'
import { mdiBackburger, mdiForwardburger } from '@mdi/js'
import { SidebarEvent } from '@a-admin/events'
import { sidebarService, SidebarState } from './sidebar/SidebarService'

@Component
export default class InformationBar extends Vue {
  openMenuIcon = mdiBackburger
  closeMenuIcon = mdiForwardburger

  visible = false
  mobile = false
  rail = false
  defaultWidth = 300
  width = this.defaultWidth

  created () {
    this.$events.on(SidebarEvent.STATUS, ({payload: {information, informationRailed, mobile}}) => {
      this.visible = information
      this.rail = informationRailed
      this.mobile = mobile
    })
  }

  mounted () {
    this.mutationWatcher = new MutationObserver(this.domChanged)
    this.mutationWatcher.observe(this.$el.querySelector('#information-bar__children > .top'), { childList: true })
    this.mutationWatcher.observe(this.$el.querySelector('#information-bar__children > .bottom'), { childList: true })

    this.domChanged()
  }

  /**
   * park sidebar children and attach - only for use with HMR which would remove all children on destroy 234567890
   */
  destroyed () {
    function moveChildren (from, to) {
      for (const child of from.children) {
        to.appendChild(child)
      }
    }

    const elTop = document.createElement('div')
    document.body.appendChild(elTop)
    moveChildren(this.getTopContainer(), elTop)

    const elBottom = document.createElement('div')
    document.body.appendChild(elBottom)
    moveChildren(this.getBottomContainer(), elBottom)

    this.$nextTick(() => {
      moveChildren(elTop, this.getTopContainer())
      moveChildren(elBottom, this.getBottomContainer())
      this.$nextTick(() => {
        this.$events.dispatch(new SidebarEvent(SidebarEvent.STATUS, new SidebarState(sidebarService)))
      })
    })
  }

  @Watch('rail')
  railChanged () {
    this.setRailMargin()
  }

  toggleRail () {
    sidebarService.setRailInformation(!this.rail)
  }

  setRailMargin () {
    if (this.rail) {
      const right = `calc(-${this.width}px - 3rem + 60px)`
      this.$el.style.marginRight = right
    } else {
      this.$el.style.marginRight = 0
    }
  }

  domChanged () {
    const old = this.visible
    const visible = this.hasSidebarItems()

    if (visible && !old) {
      this.width = this.getWidthFromItems() || this.defaultWidth
      this.setRailMargin()

      sidebarService.setInformation(true)
    }

    if (!visible && old) {
      sidebarService.setInformation(false)
    }
  }

  getChildrenContainer () {
    return this.$el.querySelector('#information-bar__children')
  }

  getTopContainer () {
    return document.querySelector('#information-bar__children .top')
  }

  getBottomContainer () {
    return document.querySelector('#information-bar__children .bottom')
  }

  hasSidebarItems () {
    return !!(this.$el.querySelector('#information-bar__children .top').children.length +
      this.$el.querySelector('#information-bar__children .bottom').children.length)
  }

  hideSidebar () {
    sidebarService.setInformation(false)
  }

  getWidthFromItems () {
    let width = 0

    Array.from(this.getTopContainer().children).forEach(c => {
      if (c.style.width !== 'auto') {
        const w = parseInt(c.style.width)
        width = Math.max(width, w)
      }
    })

    Array.from(this.getBottomContainer().children).forEach(c => {
      if (c.style.width !== 'auto') {
        const w = parseInt(c.style.width)
        width = Math.max(width, w)
      }
    })

    return width
  }

  get widthStyle () {
    return {
      flex: `0 0 calc(${this.width}px + 3rem)`,
      width: `calc(${this.width}px + 3rem)`
    }
  }
}
</script>


<style lang="scss" scoped>
#information-bar {
  position: relative;

  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  border-left: 1px solid rgba(0, 0, 0, .12);
  transition: all .2s;

  background: white;
  padding: 4rem 1.5rem 1.5rem;

  &.rail {
    padding: 4rem .8rem .8rem;
  }

  &.mobile {
    position: fixed;
    z-index: 299;
    right: 0;

    &:not(.rail) {
      border-left: none;
      box-shadow: 0 0 7px #00000066;
    }
  }
}

.toggleButton {
  position: absolute;
  top: 0;
  left: .3rem;
}

#information-bar__children {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.top, .bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .75rem;
}
</style>
