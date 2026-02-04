<template>
  <div class="contextEditor">
    <!-- click.stop prevents possible surrounding v-input to focus -->
    <div
      v-if="!customAnchor"
      class="activator"
      @click.stop="open"
    >
      <slot name="activator">
        <a-icon class="contextButton">
          {{ triggerIcon || '$dotsHorizontalIcon' }}
        </a-icon>
      </slot>
    </div>

    <div :class="popUpCssClass">
      <div
        v-if="isOpen"
        class="popUpContent elevation-6"
      >
        <div :class="['nose', { right: nosePosition === 'right' }]" />

        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Mixins, Watch } from '@a-vue'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { Positions, PositionConfig } from '../services/PositionService'
import { randomCssClass } from '../utils/random'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'

@Component({
  props: ['contentHeight', 'repositionWatchKey', 'triggerIcon', 'customAnchor']
})
export default class AContextMenu extends Mixins(UsesPositionServiceMixin, CancelOnEscMixin) {
  CONTEXT_MENU = true
  menuId = randomCssClass(10)
  nosePosition = 'left'
  isOpen = false

  get popUpCssClass () {
    return 'popUp-' + this.menuId
  }

  mounted () {
    if (this.customAnchor) {
      this.open()
    }
  }

  positionize () {
    let anchor = this.customAnchor || [this, '.activator']

    if (!Array.isArray(anchor)) {
      if (typeof anchor === 'string') {
        anchor = [document.documentElement, anchor]
      } else if (typeof anchor === 'object') { // dom element or vue ref
        anchor = [anchor]
      } else {
        anchor = [document.documentElement]
      }
    }

    const position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(
        document.documentElement,
        '.' + this.popUpCssClass + ' .popUpContent'
      )
      .targetLeft()
      .anchorRight()
      .diffX(20)
      .autoCorrect(
        Positions.AUTO_CORRECT_TYPE_SCROLL_INTO_VIEW,
        this.contentHeight
      )
      .alternativeX((p) => {
        p.targetRight().anchorLeft().diffX(-20)
      })
      .onPosition((config) => {
        this.nosePosition = config.alternativePositionX ? 'right' : 'left'
      })

    this.urp_registerPositionWatcher(position)
  }

  open () {
    window.addEventListener('mousedown', this.onClickOutside)
    window.addEventListener('wheel', this.close)
    window.addEventListener('touchmove', this.close)
    window.addEventListener('keydown', this.onKeyDown)

    const container = this.getContainer()
    container.appendChild(this.popUp)

    this.positionize()

    this.isOpen = true

    this.coe_watchCancel()

    this.$emit('open')
  }

  close () {
    this.urp_unregisterPositionWatchers()

    window.removeEventListener('mousedown', this.onClickOutside)
    window.removeEventListener('wheel', this.close)
    window.removeEventListener('touchmove', this.close)
    window.removeEventListener('keydown', this.onKeyDown)

    this.$el.appendChild(this.popUp)

    this.isOpen = false

    this.coe_unwatchCancel()

    this.$emit('close')
  }

  @Watch('repositionWatchKey')
  repositionWatchKeyChanged () {
    this.urp_update()
  }

  @Watch('customAnchor')
  customAnchorChanged () {
    if (this.customAnchor && !this.isOpen) {
      this.open()
    }
  }

  getContainer () {
    return document.querySelector('.v-application')
  }

  get popUp () {
    const container = this.getContainer()
    return container.querySelector('.' + this.popUpCssClass)
  }

  coe_cancelOnEsc () {
    this.close()
    return false // stop esc propagation
  }

  onKeyDown (e) {
    if (e.key !== 'Escape') {
      this.close()
    }
  }

  onClickOutside (e) {
    const popUp = this.popUp

    // no popup present
    if (!popUp) {
      return
    }

    // popup clicked
    if (popUp.contains(e.target)) {
      return
    }

    // activator clicked
    if (this.$el.contains(e.target)) {
      return
    }

    this.close()
  }
}
</script>


<style lang="scss" scoped>
.popUpContent {
  min-height: 2.2rem;
  position: absolute;
  z-index: 400;
  display: block;
  background-color: white;
  padding: .5rem;
  transition: left .2s;

  .nose {
    position: absolute;
    width: 1.5em;
    height: 1.5em;
    left: 0;
    top: 50%;
    z-index: -1;
    transform-origin: top left;
    transform: translateY(-70%) rotate(45deg);
    background-color: white;
    box-shadow: -1px 1px 1px 0 rgba(0, 0, 0, .15);

    &.right {
      left: 100%;
      box-shadow: 1px -1px 1px 0 rgba(0, 0, 0, .15);
    }
  }

  hr {
    border: none;
    border-top: 1px solid #DDDDDD;
    margin: .3rem 0;
  }
}

.activator {
  display: inline-block;
}

.contextButton {
  cursor: pointer;
}
</style>
