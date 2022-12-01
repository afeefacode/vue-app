<template>
  <div
    :class="['searchSelectList', {isLoading}]"
    tabindex="0"
    @keydown.down.prevent="keydown"
    @keydown.up.prevent="keyup"
    @keydown.enter="keyenter"
    @keydown.tab.prevent.exact="keyenter"
    @keydown.space.prevent="keyenter"
    @keydown.tab.shift.prevent="$emit('backtab')"
  >
    <template v-if="models_.length">
      <a-table v-bind="$attrs">
        <a-table-header
          v-if="hasHeader"
          small
        >
          <slot name="header" />
        </a-table-header>

        <a-table-row
          v-for="(model, index) in models_"
          :key="model.id"
          small
          :class="['row-' + index, {selected: isSelected(model), active: activeModelIndex === index}]"
        >
          <slot
            name="row"
            :model="model"
          />
        </a-table-row>
      </a-table>
    </template>

    <div
      v-else-if="showNotFound"
      class="notFound"
    >
      <slot
        name="not-found"
        :filters="filters"
      >
        Nichts gefunden.
      </slot>
    </div>
  </div>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListViewMixin } from '@a-vue/components/list/ListViewMixin'

@Component({
  props: ['q', 'selectedItems']
})
export default class SearchSelectList extends Mixins(ListViewMixin) {
  activeModelIndex = -1

  get hasHeader () {
    return this.$slots.header && this.$slots.header.length > 1
  }

  get showNotFound () {
    if (!this.models_.length && !this.isLoading) {
      if (this.loadOnlyIfKeyword && !this.filters.q.value) {
        return false
      }
      return true
    }
  }

  isSelected (model) {
    return !!this.selectedItems.find(i => i.equals(model))
  }

  _filtersInitialized () {
    if (this.q) {
      this.filters.q.value = this.q
    }
  }

  setFocus () {
    this.$el.focus()

    if (this.models_.length) {
      this.activeModelIndex = Math.max(0, this.findActiveIndexForSelectedModel())
    }
  }

  keydown () {
    this.activeModelIndex++
    if (this.activeModelIndex > this.models_.length - 1) {
      this.activeModelIndex = 0
    }

    const row = this.$el.querySelector('.row-' + this.activeModelIndex)
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  keyup () {
    this.activeModelIndex--
    if (this.activeModelIndex < 0) {
      this.activeModelIndex = this.models_.length - 1
    }

    const row = this.$el.querySelector('.row-' + this.activeModelIndex)
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  keyenter () {
    const model = this.models_[this.activeModelIndex]
    if (model) {
      this.$emit('enter', model)
    }
  }

  _listLoaded () {
    this.activeModelIndex = this.findActiveIndexForSelectedModel()
  }

  findActiveIndexForSelectedModel () {
    for (const [index, model] of this.models_.entries()) {
      if (this.isSelected(model)) {
        return index
      }
    }
    return -1
  }
}
</script>


<style scoped lang="scss">
.searchSelectList {
  outline: none;
}

.isLoading {
  opacity: .6;
}

.notFound {
  padding: 0 .5rem .3rem;
}
</style>
