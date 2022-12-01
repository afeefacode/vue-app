<template>
  <a-text-field
    ref="input"
    v-model="filter.value"
    :maxWidth="$attrs.maxWidth || maxWidth_"
    :label="label || 'Suche'"
    :debounce="500"
    v-bind="$attrs"
    clearable
    hide-details
    @keyup.esc="clearValue"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Mixins } from '@a-vue'
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

  setFocus (force) {
    this.$refs.input.setFocus(force)
  }
}
</script>
