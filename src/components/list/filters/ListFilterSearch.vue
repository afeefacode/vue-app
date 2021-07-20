<template>
  <a-text-field
    v-model="filter.value"
    :maxWidth="$attrs.maxWidth || maxWidth_"
    :label="label || 'Suche'"
    :debounce="500"
    v-bind="$attrs"
    clearable
    @keyup.esc="clearValue"
  />
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListFilterMixin } from '../ListFilterMixin'

@Component
export default class ListFilterSearch extends Mixins(ListFilterMixin) {
  name_ = 'q'
  maxWidth_ = 200

  clearValue (e) {
    if (this.filter.value) {
      e.stopPropagation()
      this.filter.value = null
    }
  }
}
</script>
