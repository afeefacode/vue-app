<template>
  <a-row gap="8">
    <component
      :is="paginationComponent"
      v-if="$has.page && count && numPages > 1"
      v-model="filter.value"
      :length="numPages"
      :totalVisible="_totalVisible"
    >
      <template v-if="$has.page_number">
        <span class="pageNumber">{{ filter.value }} / {{ numPages }}</span>
      </template>
      <span class="countLabel">{{ count }}</span>
    </component>

    <span
      v-if="$has.page && count && numPages <= 1"
      class="countLabel countLabelStandalone"
    >{{ count }}</span>

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
import APagination from '../../APagination'
import APagination2 from '../../APagination2'

@Component({
  props: ['totalVisible', { v2: false }],
  components: { APagination, APagination2 }
})
export default class ListFilterPage extends Mixins(ListFilterMixin) {
  $hasOptions = ['page', 'page_size', {page_number: false}]

  name_ = 'page'

  get paginationComponent () {
    return this.v2 ? APagination2 : APagination
  }

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

.countLabel {
  white-space: nowrap;
  color: #999999;
  font-size: .85rem;
}

.countLabelStandalone {
  margin-left: .5rem;
  margin-top: .5rem;
}
</style>
