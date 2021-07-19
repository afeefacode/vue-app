<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :maxWidth="maxWidth"
    v-bind="$attrs"
    :contentClass="modalId"
    transition="v-fade-transition"
    @click:outside="cancel"
    @keydown.esc="cancel"
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
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { PositionConfig } from '../services/PositionService'
import { UsesPositionServiceMixin } from '@a-vue/services/position/UsesPositionServiceMixin'
import { randomCssClass } from '../utils/random'
import { getZIndex } from 'vuetify/lib/util/helpers'

@Component({
  props: ['show', 'title']
})
export default class ADialog extends Mixins(UsesPositionServiceMixin) {
  modalId = randomCssClass(10)

  modal = false
  position = null

  created () {
    this.modal = this.show
  }

  get activatorClass () {
    return this.modalId + '-activator'
  }

  mounted () {
    // monkey patch onFousin to allow non vuetify-popups to receive focus
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

  /**
   * visiblility changes from outside
   * this will trigger the modal watcher
   * and emit a visibility event
   */
  @Watch('show')
  showChanged () {
    this.modal = this.show
  }

  /**
   * visiblility changes from inside
   */
  @Watch('modal')
  modalChanged () {
    if (this.modal) {
      this.setPosition()
    }
    this.$emit('update:show', this.modal)
  }

  get maxWidth () {
    if (this.position) {
      const margin = this.position.targetMargin || 0
      return `min(600px, 100vw - 2 * ${margin})`
    }
  }

  setPosition () {
    const anchor = [document.documentElement, '.' + this.activatorClass]

    this.position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(document, '.' + this.modalId)
      .diffY('-2rem')
      .margin('2rem')

    this.urp_unregisterPositionWatchers()
    this.urp_registerPositionWatcher(this.position)
  }

  cancel () {
    this.modal = false
  }
}
</script>


<style lang="scss" scoped>
.v-card__title {
  background: #EEEEEE;
  padding: .3rem 1rem !important;
}

.v-card__text {
  padding: .5rem 1rem !important;
  color: inherit !important;
}

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
