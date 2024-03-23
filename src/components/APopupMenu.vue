<template>
  <div class="popupMenu">
    <div
      class="trigger"
      @click="open"
    >
      <slot />
    </div>

    <popup-menu-list
      v-if="visible"
      :items="items"
      :position="position"
      v-bind="$attrs"
      @close="close"
      @click="click"
    >
      <template #item="{ item }">
        <component
          :is="itemRenderer || ItemRenderer"
          :item="item"
        />
      </template>
    </popup-menu-list>
  </div>
</template>


<script>
import { PositionConfig } from '../services/PositionService'
import { Component, Vue } from '@a-vue'
import PopupMenuList from './popup-menu/PopupMenuList'
import ItemRenderer from './popup-menu/ItemRenderer'

@Component({
  props: ['items', 'itemRenderer'],
  components: {
    PopupMenuList
  }
})
export default class APopupMenu extends Vue {
  visible = false
  ItemRenderer = ItemRenderer

  open () {
    this.visible = true
  }

  click (item) {
    this.$emit('select', item)
    this.close()
  }

  close () {
    this.visible = false
  }

  get position () {
    const position = new PositionConfig()
      .setAnchor(this, '.trigger')
      .targetLeft().anchorRight()
      .targetMiddle().anchorMiddle()
    return position
  }
}
</script>


<style lang="scss" scoped>
#popupContainer .selectPopup {
  padding: .5rem;
}

.trigger {
  display: inline-block;
}
</style>
