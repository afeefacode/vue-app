<template>
  <a-select
    v-model="filter.value"
    :label="label || name"
    :items="_items"
    itemText="itemTitle"
    itemValue="itemValue"
    :clearable="filter.value !== null"
    v-bind="$attrs"
  />
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListFilterMixin } from '../ListFilterMixin'

@Component({
  props: ['totalVisible']
})
export default class ListFilterSelect extends Mixins(ListFilterMixin) {
  items = null

  created () {
    if (this.hasOptions()) {
      this.items = this.getOptions()
    }
  }

  get _items () {
    return this.$attrs.items || this.items || []
  }

  hasOptions () {
    return this.filter.options
  }

  getOptions () {
    return [
      {
        itemTitle: 'Alle',
        itemValue: null
      },
      ...this.filter.options.map(o => ({
        itemTitle: o ? 'Ja' : 'Nein',
        itemValue: o
      }))
    ]
  }
}
</script>
