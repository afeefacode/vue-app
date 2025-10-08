<template>
  <a-row gap="8">
    <a-pagination
      v-if="$has.page && count && numPages > 1"
      v-model="filter.value"
      :length="numPages"
      :totalVisible="_totalVisible"
    >
      <template v-if="$has.page_number">
        <span class="pageNumber">{{ filter.value }} / {{ numPages }}</span>
      </template>
    </a-pagination>

    <a-select
      v-if="$has.page_size"
      v-model="pageSizeFilter.value"
      class="pageSizeSelect"
      :label="label || 'Anzahl'"
      :items="pageSizeFilter.options"
      :defaultValue="pageSizeFilter.defaultValue"
      :clearable="!pageSizeFilter.hasDefaultValueSet()"
      hide-details
    />
  </a-row>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'

@Component({
  props: ['totalVisible']
})
export default class ListFilterPage extends Mixins(ListFilterMixin) {
  $hasOptions = ['page', 'page_size', {page_number: false}]

  name_ = 'page'

  get pageSizeFilter () {
    return this.filters.page_size
  }

  get _totalVisible () {
    return this.totalVisible === undefined ? 11 : this.totalVisible // allow 0 for totalVisible
  }

  get numPages () {
    return Math.ceil(this.count / this.pageSizeFilter.value)
  }
}
</script>


<style lang="scss" scoped>
.v-select {
  max-width: 150px;
}

.pageNumber {
  white-space: nowrap;
}
</style>
