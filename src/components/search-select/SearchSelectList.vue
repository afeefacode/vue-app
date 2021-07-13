<template>
  <div class="searchSelectList">
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
      Nichts gefunden.
    </div>
  </div>
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListViewMixin } from '@a-vue/components/list/ListViewMixin'

@Component({
  props: ['q']
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

  _filtersInitialized () {
    if (this.q) {
      this.filters.q.value = this.q
    }
  }
}
</script>


<style scoped lang="scss">
.notFound {
  padding: 0 .5rem .3rem;
}
</style>