<template>
  <v-dialog
    v-model="dialog"
    :maxWidth="maxWidth"
    :contentClass="id"
    transition="v-fade-transition"
    v-bind="$attrs"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card class="pb-1">
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>

      <v-card-text v-if="message">
        <span v-html="message" />
      </v-card-text>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          small
          @click="ok"
        >
          {{ yesButton }}
        </v-btn>

        <v-btn
          small
          @click="cancel"
        >
          {{ cancelButton }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { DialogEvent } from './dialog/DialogEvent'
import { PositionConfig } from '../services/PositionService'
import { UsesPositionServiceMixin } from '@a-vue/services/position/UsesPositionServiceMixin'

@Component({
  props: ['id', 'anchor']
})
export default class ADialog extends Mixins(UsesPositionServiceMixin) {
  title = null
  message = null
  yesButton = null
  cancelButton = null

  dialog = false
  dialogEvent = null

  position = null

  created () {
    this.$events.on(DialogEvent.SHOW, this.show)

    this.setPosition(this.anchor)
  }

  get maxWidth () {
    const margin = this.position.targetMargin || 0
    return `min(500px, 100vw - 2 * ${margin})`
  }

  setPosition (anchor) {
    this.urp_unregisterPositionWatchers()

    anchor = anchor
      ? Array.isArray(anchor) ? anchor : [anchor]
      : [document.documentElement]

    this.position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(document, '.' + this.id)
      .diffY('-2rem')
      .margin('2rem')

    this.urp_registerPositionWatcher(this.position)
  }

  show (dialogEvent) {
    // listens on all events but shows up only if targeted by its id
    // if no id provided, the global app dialog will be used
    const id = dialogEvent.payload.id || 'app'
    if (id !== this.id) {
      return
    }

    if (dialogEvent.payload.anchor) {
      this.setPosition(dialogEvent.payload.anchor)
    } else {
      this.setPosition(this.anchor)
    }

    this.title = dialogEvent.payload.title
    this.message = dialogEvent.payload.message
    this.yesButton = dialogEvent.payload.yesButton || 'Ja'
    this.cancelButton = dialogEvent.payload.cancelButton || 'Abbrechen'

    this.dialogEvent = dialogEvent
    this.dialog = true
  }

  ok () {
    this.dialogEvent.resolve(DialogEvent.RESULT_YES)
    this.dialog = false
  }

  cancel () {
    this.dialogEvent.resolve(DialogEvent.RESULT_CANCEL)
    this.dialog = false
  }
}
</script>


<style lang="scss" scoped>
::v-deep .v-dialog {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;

  &.v-fade-transition {
    &-enter-active, &-leave, &-leave-to {
      transition: opacity .2s ease;
    }

    &-enter, &-leave-to {
      opacity: 0;
    }
  }
}
</style>
