<template>
  <div
    id="flyingContextContainer"
    :class="{visible}"
  >
    <div class="closeButton">
      <v-btn
        fab
        x-small
        color="gray"
        target="_blank"
        title="Schließen"
        @click.prevent="hide"
      >
        <v-icon>
          $closeIcon
        </v-icon>
      </v-btn>
    </div>

    <div id="flyingContextContainer__children" />
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { FlyingContextEvent } from '@a-vue/events'
import { getZIndex } from 'vuetify/lib/util/helpers'

@Component({
  props: []
})
export default class FlyingContextContainer extends Vue {
  visible = false
  oldOverflowY = null
  isClosing = false
  lastScrollbarWidth = 0

  mounted () {
    const mutationWatcher = new MutationObserver(this.domChanged)
    mutationWatcher.observe(this.getChildrenContainer(), { childList: true })

    window.addEventListener('mousedown', this.onClickOutside)

    const sizeWatcher = new ResizeObserver(this.sizeChanged)
    sizeWatcher.observe(this.getChildrenContainer())
  }

  getScrollbarWidth () {
    const el = document.documentElement
    const overflowY = getComputedStyle(el)['overflow-y']
    if (overflowY === 'scroll' || (overflowY === 'auto' && el.scrollHeight > el.clientHeight)) {
      // measure scrollbar width https://stackoverflow.com/a/55278118
      const scrollbox = document.createElement('div')
      scrollbox.style.overflow = 'scroll'
      document.body.appendChild(scrollbox)
      const scrollBarWidth = scrollbox.offsetWidth - scrollbox.clientWidth
      document.body.removeChild(scrollbox)
      return scrollBarWidth
    }
    return 0
  }

  sizeChanged () {
    if (this.visible && !this.isClosing) { // do not set size if it is already closing
      this.$nextTick(() => {
        const el = document.documentElement
        const newSize = el.offsetWidth - this.$el.offsetWidth + this.lastScrollbarWidth
        this.$el.style.left = newSize + 'px'
      })
    }
  }

  domChanged ([...mutationRecords]) {
    const container = this.getChildrenContainer()

    this.visible = !!container.children.length
    const isOpening = mutationRecords.length === 1 && mutationRecords[0].addedNodes.length === 1 // only 1 record ... and this one is 'added'

    const el = document.documentElement

    if (isOpening) {
      const style = getComputedStyle(el)
      this.oldOverflowY = style.overflowY
      this.lastScrollbarWidth = this.getScrollbarWidth()
    }

    if (this.visible) {
      setTimeout(() => {
        el.style.overflowY = 'hidden'
        el.style.marginRight = this.lastScrollbarWidth + 'px'
      }, 100)

      this.$el.style.left = (el.offsetWidth - this.$el.offsetWidth + this.lastScrollbarWidth) + 'px'
    } else {
      el.style.overflowY = this.oldOverflowY
      el.style.marginRight = 0

      this.$el.style.left = '101vw' // set this if closing from outside e.g. via esc, which does not call this.hide()
    }
    this.isClosing = false
  }

  hide () {
    if (this.visible) {
      this.$el.style.left = '101vw'
      this.isClosing = true
      setTimeout(() => { // fade in then hide contents
        this.$events.dispatch(new FlyingContextEvent(FlyingContextEvent.HIDE_ALL))
      }, 200)
    }
  }

  getChildrenContainer () {
    return this.$el.querySelector('#flyingContextContainer__children')
  }

  onClickOutside (e) {
    if (!this.visible) {
      return
    }

    // check if trigger is clicked
    let parent = e.target
    while (parent) {
      if (parent.classList.contains('flyingContextTrigger')) {
        return
      }
      parent = parent.parentElement
    }

    // popup clicked
    const targetIndex = getZIndex(e.target)
    if (targetIndex > 200) {
      return
    }

    // check if flying context ist clicked
    if (!this.$el.contains(e.target)) {
      this.hide()
    }
  }
}
</script>


<style lang="scss" scoped>
#flyingContextContainer {
  position: fixed;
  z-index: 200;
  height: 100%;
  width: auto;
  min-width: 400px;
  max-width: calc(100vw - 100px);
  top: 0;
  background: white;
  transition: left .2s;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 0 0 17px #00000033;
  border-left: 1px solid #DDDDDD;

  &:not(.visible) {
    left: 101vw;
  }

  .closeButton {
    margin: -1rem 0 2rem -1rem;
  }
}
</style>
