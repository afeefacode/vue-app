<template>
  <a-date-picker
    ref="datePicker"
    v-model="filter.value"
    :defaultValue="filter.defaultValue"
    :clearable="filter.hasDefaultValue() && !filter.hasDefaultValueSet()"
    :label="label || name"
    hide-details
    v-bind="$attrs"
    v-on="$listeners"
    @change="dateChanged"
  />
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'
import { formatDate } from '@a-vue/utils/format-date'

@Component
export default class ListFilterDate extends Mixins(ListFilterMixin) {
  created () {
    this.displayValue = formatDate(this.filter.value)
  }

  dateChanged (formattedDate) {
    this.displayValue = formatDate(formattedDate)
  }
}
</script>
