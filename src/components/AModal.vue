<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :width="cwm_width"
    :maxWidth="cwm_maxWidth"
    v-bind="$attrs"
    :contentClass="modalId"
    transition="v-fade-transition"
    persistent
    no-click-animation
    @click:outside="cancel"
  >
    <template #activator="{ on }">
      <div
        style="width: max-content;"
        :class="[activatorClass, triggerClass]"
        v-on="on"
      >
        <slot name="activator" />
      </div>
    </template>

    <v-card v-if="modal">
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Mixins, Watch } from '@a-vue'
import { PositionConfig } from '../services/PositionService'
import { UsesPositionServiceMixin } from '@a-vue/services/position/UsesPositionServiceMixin'
import { randomCssClass } from '../utils/random'
import { getZIndex } from 'vuetify/lib/util/helpers'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'

@Component({
  props: ['show', 'title', 'beforeClose', 'triggerClass', 'anchorPosition']
})
export default class ADialog extends Mixins(UsesPositionServiceMixin, ComponentWidthMixin, CancelOnEscMixin) {
  modalId = randomCssClass(10)

  modal = false
  position = null

  cwm_maxWidth_ = 600

  created () {
    this.modal = this.show
  }

  get activatorClass () {
    return this.modalId + '-activator'
  }

  get transientAnchorClass () {
    return this.modalId + '-anchor'
  }

  mounted () {
    // monkey patch onFocusin to allow non vuetify-popups to receive focus
    const dialog = this.$refs.dialog
    const onFocusin = dialog.onFocusin
    dialog.onFocusin = e => {
      const dialogIndex = getZIndex(document.querySelector('.' + this.modalId))
      const targetIndex = getZIndex(e.target)
      if (targetIndex > dialogIndex) {
        return
      }
      onFocusin(e)
    }
  }

  coe_cancelOnEsc () {
    this.cancel()
    return false // stop esc propagation
  }

  /**
   * visiblility changes from outside
   * this will trigger the modal watcher
   * and emit a visibility event
   */
  @Watch('show')
  async showChanged () {
    // check if a modal is allowed to be closed
    if (this.modal && !this.show && this.beforeClose) {
      const result = await this.beforeClose()
      if (!result) {
        return
      }
    }

    this.modal = this.show
  }

  /**
   * visiblility changes from inside
   */
  @Watch('modal')
  modalChanged () {
    if (this.modal) {
      this.setPosition()
    } else {
      this.removeTransientAnchor()
    }

    // register for esc
    if (this.modal) {
      this.coe_watchCancel()
    } else {
      this.coe_unwatchCancel()
    }

    this.$emit('update:show', this.modal)
  }

  setPosition () {
    let anchor

    if (this.anchorPosition) {
      this.createTransientAnchor()
      anchor = [document.documentElement, '.' + this.transientAnchorClass]
    } else {
      this.removeTransientAnchor()
      anchor = [document.documentElement, '.' + this.activatorClass]
    }

    this.position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(document, '.' + this.modalId)
      .diffY('-2rem')
      .margin('2rem')

    this.urp_unregisterPositionWatchers()
    this.urp_registerPositionWatcher(this.position)
  }

  async cancel () {
    // check if a modal is allowed to be closed
    if (this.modal && this.beforeClose) {
      const result = await this.beforeClose()
      if (!result) {
        return
      }
    }

    this.modal = false
  }

  createTransientAnchor () {
    let transientAnchorEl = document.querySelector('.' + this.transientAnchorClass)
    if (!transientAnchorEl) {
      transientAnchorEl = document.createElement('div')
      transientAnchorEl.classList.add(this.transientAnchorClass)
      transientAnchorEl.style.position = 'absolute'
      transientAnchorEl.style.left = `${this.anchorPosition.x}px`
      transientAnchorEl.style.top = `${this.anchorPosition.y}px`
      document.body.appendChild(transientAnchorEl)
    }
  }

  removeTransientAnchor () {
    const transientAnchorEl = document.querySelector('.' + this.transientAnchorClass)
    if (transientAnchorEl && document.body.contains(transientAnchorEl)) {
      document.body.removeChild(transientAnchorEl)
    }
  }
}
</script>


<style lang="scss" scoped>
.v-card__title {
  background: #EEEEEE;
  padding: .6rem 1rem .3rem !important;
}

.v-card__text {
  padding: .8rem 1rem !important;
  color: inherit !important;
}

:deep(.v-dialog) {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;

  transition: none;

  &.v-fade-transition {
    &-enter-active, &-leave, &-leave-to {
      transition: opacity .3s ease;
    }

    &-enter, &-leave-to {
      opacity: 0;
    }
  }
}
</style>
