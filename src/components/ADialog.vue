<template>
  <v-dialog
    v-model="dialog"
    :maxWidth="maxWidth"
    :contentClass="_dialogId"
    transition="v-fade-transition"
    v-bind="$attrs"
    persistent
    no-click-animation
    @click:outside="cancel"
  >
    <template #activator="{ on }">
      <div v-on="on">
        <slot name="activator" />
      </div>
    </template>

    <v-card
      v-if="dialog"
      class="pb-1"
    >
      <v-card-title class="pa-3">
        {{ title }}
      </v-card-title>

      <v-card-text v-if="message">
        <span v-html="message" />
      </v-card-text>

      <v-card-text v-if="$slots.default">
        <slot :props="props" />
      </v-card-text>

      <v-card-actions class="gap-1 mr-1 mb-1">
        <v-spacer />

        <v-btn
          small
          @click="cancel"
        >
          {{ cancelButton || 'Abbrechen' }}
        </v-btn>

        <v-btn
          small
          :color="yesColor || 'green white--text'"
          :disabled="!_active"
          @click="ok"
        >
          {{ yesButton || 'Ja' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Mixins, Watch } from '@a-vue'
import { DialogEvent } from './dialog/DialogEvent'
import { PositionConfig } from '../services/PositionService'
import { UsesPositionServiceMixin } from '../services/position/UsesPositionServiceMixin'
import { randomCssClass } from '../utils/random'
import { CancelOnEscMixin } from '@a-vue/services/escape/CancelOnEscMixin'

@Component({
  props: ['id', 'anchor', 'active', 'payload']
})
export default class ADialog extends Mixins(UsesPositionServiceMixin, CancelOnEscMixin) {
  dialogId = randomCssClass(10)

  title = null
  message = null
  yesButton = null
  yesColor = null
  cancelButton = null

  dialog = false
  dialogEvent = null

  calledViaEvent = false
  position = null

  props = {}

  created () {
    this.$events.on(DialogEvent.SHOW, this.show)
  }

  destroyed () {
    this.$events.off(DialogEvent.SHOW, this.show)
  }

  coe_cancelOnEsc () {
    this.cancel()
    return false // stop esc propagation
  }

  @Watch('dialog')
  dialogChanged () {
    // called without event from activator
    if (this.dialog && !this.calledViaEvent) {
      this.setPosition(this.anchor)

      this.title = this.payload.title
      this.message = this.payload.message
      this.yesButton = this.payload.yesButton
      this.yesColor = this.payload.yesColor
      this.cancelButton = this.payload.cancelButton
      this.props = this.payload.props

      this.dialogEvent = null

      this.calledViaEvent = false
    }

    // register for esc
    if (this.dialog) {
      this.coe_watchCancel()
    } else {
      this.coe_unwatchCancel()
    }
  }

  get _dialogId () {
    return this.id || this.dialogId
  }

  get _active () {
    if (this.active !== undefined) {
      return this.active
    }
    return true
  }

  get maxWidth () {
    if (!this.position) {
      return
    }
    const margin = this.position.targetMargin || 0
    return `min(400px, 100vw - 2 * ${margin})`
  }

  setPosition (anchor) {
    this.urp_unregisterPositionWatchers()

    if (!Array.isArray(anchor)) {
      if (typeof anchor === 'string') {
        anchor = [document.documentElement, anchor]
      } else if (typeof anchor === 'object') { // dom element or vue ref
        anchor = [anchor]
      } else {
        anchor = [document.documentElement]
      }
    }

    this.position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(document, '.' + this._dialogId)
      .diffY('-2rem')
      .margin('2rem')

    this.urp_registerPositionWatcher(this.position)
  }

  show (dialogEvent) {
    // listens on all events but shows up only if targeted by its id
    // if no id provided, the global app dialog will be used
    const id = dialogEvent.payload.id || 'app'
    if (id !== this._dialogId) {
      return
    }

    if (dialogEvent.payload.anchor) {
      this.setPosition(dialogEvent.payload.anchor)
    } else {
      this.setPosition(this.anchor)
    }

    this.title = dialogEvent.payload.title
    this.message = dialogEvent.payload.message
    this.yesButton = dialogEvent.payload.yesButton
    this.yesColor = dialogEvent.payload.yesColor
    this.cancelButton = dialogEvent.payload.cancelButton
    this.props = dialogEvent.payload.props

    this.dialogEvent = dialogEvent

    this.calledViaEvent = true
    this.dialog = true
  }

  ok () {
    if (this.dialogEvent) {
      this.dialogEvent.resolve(DialogEvent.RESULT_YES)
    }
    this.dialog = false
  }

  cancel () {
    if (this.dialogEvent) {
      this.dialogEvent.resolve(DialogEvent.RESULT_CANCEL)
    }
    this.dialog = false
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
}

::v-deep .v-dialog {
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
