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
        :class="activatorClass"
        v-on="on"
      >
        <slot name="activator" />
      </div>
    </template>

    <v-card v-if="modal">
      <v-card-title
        v-if="title"
        :style="{ cursor: draggable ? 'move' : 'default' }"
        @mousedown="startDrag"
      >
        <v-icon
          v-if="icon"
          :color="icon.color"
          class="mr-2"
          size="1.5rem"
        >
          {{ icon.icon }}
        </v-icon>

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
  props: ['show', 'icon', 'title', 'beforeClose', 'anchorPosition', 'screenCentered', {draggable: true}]
})
export default class ADialog extends Mixins(UsesPositionServiceMixin, ComponentWidthMixin, CancelOnEscMixin) {
  modalId = randomCssClass(10)

  modal = false
  position = null

  dragStartX = 0
  dragStartY = 0
  initialLeft = 0
  initialTop = 0

  cwm_maxWidth_ = 1000

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

    // catch click events if activator's first element is set to be disabled
    const activator = document.getElementsByClassName(this.activatorClass)[0]
    activator.addEventListener('click', e => {
      if (activator.children[0]?.getAttribute('disabled')) {
        e.stopPropagation()
      }
    }, true) // capture phase, stop event before v-dialog receives it
  }

  startDrag (event) {
    if (!this.draggable) {
      return
    }

    this.dragStartX = event.clientX
    this.dragStartY = event.clientY

    const dialog = document.querySelector('.' + this.modalId)
    const rect = dialog.getBoundingClientRect()
    this.initialLeft = rect.left
    this.initialTop = rect.top

    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.stopDrag)
  }

  onDrag (event) {
    const deltaX = event.clientX - this.dragStartX
    const deltaY = event.clientY - this.dragStartY

    const dialog = document.querySelector('.' + this.modalId)
    if (dialog) {
      dialog.style.left = `${this.initialLeft + deltaX}px`
      dialog.style.top = `${this.initialTop + deltaY}px`
    }
  }

  stopDrag () {
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.stopDrag)

    // remove from position watching if has been dragged once
    this.urp_unregisterPositionWatchers()
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
      if (!this.screenCentered) {
        this.setPosition()
      }
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

    if (!this.modal) {
      setTimeout(() => { // allow client to conditionally remove <edit-modal> using v-if not before inner dialog has been removed from dom
        this.$emit('destroyed')
      }, 100)
    }
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
  padding: .8rem 1rem !important;
}

.v-card__text {
  padding: .5rem 1.2rem 1rem !important;
  color: inherit !important;
}

:deep(.v-dialog) {
  position: absolute;
  margin: 0;
  border-radius: 5px;

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
