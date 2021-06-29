<template>
  <div
    v-if="numPages > 1"
    class="d-flex align-center gap-8"
  >
    <v-pagination
      v-if="count"
      v-model="filter.value"
      :length="numPages"
      :total-visible="8"
    />

    <a-select
      v-model="pageSizeFilter.value"
      :label="label || 'Anzahl'"
      :items="pageSizeFilter.options"
      :defaultValue="pageSizeFilter.defaultValue"
      :clearable="!pageSizeFilter.hasDefaultValue()"
    />
  </div>
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import ListFilterMixin from '../ListFilterMixin'

@Component({
  props: ['pageSizeLabel']
})
export default class ListFilter extends Mixins(ListFilterMixin) {
  name_ = 'page'

  get pageSizeFilter () {
    return this.filters.page_size
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

::v-deep .v-pagination__navigation {
  margin: 0;
}
</style>
