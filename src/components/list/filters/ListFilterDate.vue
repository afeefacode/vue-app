<template>
  <a-date-picker
    ref="datePicker"
    v-model="filter.value"
    :defaultValue="filter.defaultValue"
    :clearable="filter.hasDefaultValue() && !filter.hasDefaultValueSet()"
    :label="label || name"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'

@Component
export default class ListFilterDate extends Mixins(ListFilterMixin) {
}
</script>
