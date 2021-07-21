<template>
  <a-row
    v-if="numPages > 1"
    gap="8"
  >
    <a-pagination
      v-if="count"
      v-model="filter.value"
      :length="numPages"
      :total-visible="_totalVisible"
    >
      <template v-if="$has.page_number">
        {{ filter.value }} / {{ numPages }}
      </template>
    </a-pagination>

    <a-select
      v-if="$has.page_size"
      v-model="pageSizeFilter.value"
      :label="label || 'Anzahl'"
      :items="pageSizeFilter.options"
      :defaultValue="pageSizeFilter.defaultValue"
      :clearable="!pageSizeFilter.hasDefaultValue()"
    />
  </a-row>
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListFilterMixin } from '../ListFilterMixin'

@Component({
  props: ['totalVisible']
})
export default class ListFilterPage extends Mixins(ListFilterMixin) {
  $hasOptions = ['page_size', {page_number: false}]

  name_ = 'page'

  get pageSizeFilter () {
    return this.filters.page_size
  }

  get _totalVisible () {
    return this.totalVisible === undefined ? 7 : this.totalVisible // allow 0 for totalVisible
  }

  get numPages () {
    return Math.ceil(this.count / this.pageSizeFilter.value)
  }
}
</script>


<style lang="scss" scoped>
.v-select {
  max-width: 100px;
}
</style>
