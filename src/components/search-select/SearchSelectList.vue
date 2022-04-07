<template>
  <div :class="['searchSelectList', {isLoading}]">
    <template v-if="models_.length">
      <a-table v-bind="$attrs">
        <a-table-header
          v-if="hasHeader"
          small
        >
          <slot name="header" />
        </a-table-header>

        <a-table-row
          v-for="model in models_"
          :key="model.id"
          small
          :class="{selected: isSelected(model)}"
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
  get hasHeader () {
    return this.$slots.header && this.$slots.header.length > 1
  }

  get showNotFound () {
    if (!this.models_.length && !this.isLoading) {
      if (this._loadOnlyIfKeyword && !this.filters.q.value) {
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
    this.$emit('update:filters', this.filters)
  }
}
</script>


<style scoped lang="scss">
.isLoading {
  opacity: .6;
}

.notFound {
  padding: 0 .5rem .3rem;
}
</style>
