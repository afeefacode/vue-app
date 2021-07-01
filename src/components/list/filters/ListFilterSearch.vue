<template>
  <a-text-field
    v-model="filter.value"
    :style="widthStyle"
    :label="label || 'Suche'"
    :debounce="500"
    clearable
  />
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListFilterMixin } from '../ListFilterMixin'

@Component
export default class ListFilterSearch extends Mixins(ListFilterMixin) {
  name_ = 'q'
  width_ = 200
}
</script>
