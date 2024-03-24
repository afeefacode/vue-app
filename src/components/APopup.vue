<template>
  <div class="popup">
    <slot />
  </div>
</template>

<script>
import { Component, Mixins, Watch } from '@a-vue'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { positionService, PositionConfig } from '../services/PositionService'

@Component({
  props: ['position']
})
export default class APopup extends Mixins(CancelOnEscMixin, UsesPositionServiceMixin) {
  popupTrigger = null
  currentPosition = null

  created () {
    window.addEventListener('mousedown', this.onClickOutside)
    window.addEventListener('wheel', this.onScroll, {passive: false})
    window.addEventListener('touchmove', this.onScroll)
    window.addEventListener('keydown', this.onScroll)

    this.currentPosition = (this.position || new PositionConfig())
      .setTarget(this)
      .onAnchorEl(anchorEl => {
        this.popupTrigger = anchorEl
      })

    this.urp_registerPositionWatcher(this.currentPosition)

    this.coe_watchCancel()
  }

  mounted () {
    this.getContainer().appendChild(this.$el)
  }

  destroyed () {
    window.removeEventListener('mousedown', this.onClickOutside)
    window.removeEventListener('wheel', this.onScroll)
    window.removeEventListener('touchmove', this.onScroll)
    window.removeEventListener('keydown', this.onScroll)

    const container = this.getContainer()
    if (container.contains(this.$el)) {
      container.removeChild(this.$el)
    }
  }

  @Watch('position')
  positionChanged () {
    this.currentPosition.update(this.position)
  }

  getContainer () {
    return document.getElementById('popupContainer')
  }

  coe_cancelOnEsc () {
    this.close()
    return false
  }

  onScroll (event) {
    // ignore esc event
    if (event instanceof KeyboardEvent) {
      const key = event.key || event.keyCode
      if (key === 'Escape' || key === 'Esc' || key === 27) {
        return
      }
    }

    // ignore child popup scroll / event
    if (this.targetIsIncludedPopup(event.target)) {
      return
    }

    if (this.$el.contains(event.target)) {
      if (!(event instanceof KeyboardEvent)) { // no keydown, must be wheel/touchmove
        const scrollParent = positionService.getScrollParent(event.target, true)
        if (!this.$el.contains(scrollParent)) { // do not scroll at all if target is not scrollable
          event.preventDefault()
        }
      }
      return
    }

    this.close()
  }

  targetIsIncludedPopup (target) {
    const popups = this.getContainer().children
    let foundMyself = false
    for (const popup of popups) {
      if (foundMyself) {
        if (popup.contains(target)) {
          return true
        }
      }
      foundMyself = popup === this.$el
    }
    return false
  }

  close () {
    this.$emit('close')
  }

  onClickOutside (e) {
    // popup clicked
    if (this.$el.contains(e.target)) {
      return
    }

    // trigger clicked
    if (this.popupTrigger.contains(e.target)) {
      return
    }

    // check included popup clicked
    if (this.targetIsIncludedPopup(e.target)) {
      return
    }

    this.close()
  }
}
</script>

<style lang="scss" scoped>
.popup {
  position: absolute;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .2), 0 2px 10px 0 rgba(0, 0, 0, .2);
}
</style>
