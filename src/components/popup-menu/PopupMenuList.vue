<template>
  <a-popup
    :class="['popupMenuList', 'level-' + nestLevel]"
    :position="position"
    @close="$emit('close')"
  >
    <template v-if="parent">
      <div
        :class="['item parent', {selected: selectedItem === parent}]"
        @click="click(parent)"
      >
        <div class="content">
          <slot
            name="item"
            :item="parent"
          />
        </div>
      </div>

      <hr>
    </template>

    <a-text-field
      v-if="!nestLevel && numItemsWithChildren > 8"
      v-model="filterTerm"
      class="mt-1 mb-2"
      type="text"
      placeholder="Filtern"
      focus
      hide-details
    />

    <div
      v-for="item in filteredItems"
      :key="item.id"
      @click="click(item)"
    >
      <div
        :class="['item', {isFolder: item.children?.length, selected: selectedItem === item}]"
        :data-id="item.id"
      >
        <div class="content">
          <slot
            name="item"
            :item="item"
          />
        </div>

        <a-icon
          v-if="item.children?.length"
          icon="chevron-right"
          class="more"
        >
          $chevronRightIcon
        </a-icon>
      </div>

      <popup-menu-list
        v-if="item.children?.length && selectedItem === item"
        :parent="canSelectParent && item"
        :parentFilterTerm="filterTerm"
        :items="item.children"
        :level="nestLevel + 1"
        :position="getPosition(item)"
        @close="closeNested"
        @click="clickNested"
      >
        <template #item="{ item: subItem }">
          <slot
            name="item"
            :item="subItem"
          />
        </template>
      </popup-menu-list>
    </div>
    <p
      v-if="filteredItems.length === 0"
      class="noItems"
    >
      Keine Einträge gefunden
    </p>
  </a-popup>
</template>


<script>
import { Component, Vue } from '@a-vue'
import { PositionConfig } from '../../services/PositionService'

@Component({
  props: ['items', 'parent', 'level', 'position', {canSelectParent: true}, 'parentFilterTerm'],
  name: 'popup-menu-list'
})
export default class PopupMenuList extends Vue {
  selectedItem = null
  filterTerm = ''

  get nestLevel () {
    return this.level || 0
  }

  get filteredItems () {
    const filterTerm = this.parentFilterTerm || this.filterTerm
    if (!filterTerm) {
      return this.items
    } else {
      return this.items.filter(item => {
        // find parent only if it has no children
        const itemFound = item.title.toLowerCase().includes(filterTerm.toLowerCase())
        if (itemFound && !item.children?.length) {
          return true
        }

        // find a child
        const childFound = item.children?.some(item => {
          return item.title.toLowerCase().includes(filterTerm.toLowerCase())
        })
        return childFound
      })
    }
  }

  get numItemsWithChildren () {
    return this.items.reduce((num, i) => {
      return num + 1 + (i.children?.length || 0)
    }, 0)
  }

  click (item) {
    if (item === this.parent) { // parent item
      this.$emit('click', item)
    } else if (item.children?.length) { // container
      this.openNested(item)
    } else { // single item
      this.$emit('click', item)
    }
  }

  clickNested (item) {
    this.$emit('click', item)
  }

  openNested (item) {
    this.selectedItem = item
  }

  closeNested () {
    this.selectedItem = null
  }

  getPosition (item) {
    // console.log('getPosition this.' + `.item[data-id="${item.id}"]`)
    const position = new PositionConfig()
      .setAnchor(this, `.item[data-id="${item.id}"]`)
      .targetLeft().anchorRight()
      .targetMiddle().anchorMiddle()
      .diffX('.2rem')
    return position
  }
}
</script>


<style lang="scss" scoped>
#popupContainer .popupMenuList {
  padding: .3rem .5rem;
  max-height: 600px;
  overflow-y: auto;
}

.noItems {
  font-size: .9rem;
  margin: .2rem;
  white-space: nowrap;
}

.item {
  display: flex;
  align-items: center;
  margin: .2rem 0;

  cursor: pointer;
  user-select: none;

  &:hover,
  &.selected {
    background-color: #ECECEC;
  }

  &.isFolder {
    color: #666666;
  }

  .more {
    text-align: right;
    margin-left: 1rem;
    color: #999999;
    font-size: .8rem;
  }
}

hr {
  border: none;
  border-top: 1px solid #DDDDDD;
}
</style>
