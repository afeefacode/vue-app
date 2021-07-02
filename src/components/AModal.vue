<template>
  <v-dialog
    v-model="modal"
    :maxWidth="maxWidth"
    :contentClass="id"
    transition="v-fade-transition"
    v-bind="$attrs"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
    </template>

    <v-card>
      <v-card-title v-if="title">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot :isOpen="!!modal" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { PositionConfig } from '../services/PositionService'
import { UsesPositionServiceMixin } from '@a-vue/services/position/UsesPositionServiceMixin'
import { randomCssClass } from '../utils/random'

@Component({
  props: ['show', 'anchor', 'title']
})
export default class ADialog extends Mixins(UsesPositionServiceMixin) {
  id = randomCssClass(10)

  modal = false
  position = null

  created () {
    this.modal = this.show

    let anchor = this.anchor
    if (!Array.isArray(anchor)) {
      if (typeof anchor === 'string') {
        anchor = [document.documentElement, anchor]
      } else {
        anchor = [document.documentElement]
      }
    }

    this.position = new PositionConfig()
      .setAnchor(...anchor)
      .setTarget(document, '.' + this.id)
      .diffY('-2rem')
      .margin('2rem')
  }

  @Watch('show')
  showChanged () {
    this.modal = this.show
  }

  @Watch('modal')
  modalChanged () {
    if (this.modal) {
      this.setPosition(this.anchor)
    }
  }

  get maxWidth () {
    const margin = this.position.targetMargin || 0
    return `min(600px, 100vw - 2 * ${margin})`
  }

  setPosition () {
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
