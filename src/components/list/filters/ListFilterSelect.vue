<template>
  <a-select
    v-model="filter.value"
    :label="label || name"
    :items="_items"
    itemText="itemTitle"
    itemValue="itemValue"
    :clearable="filter.value !== filter.defaultValue"
    :defaultValue="filter.defaultValue"
    v-bind="$attrs"
  />
</template>


<script>
import { Component, Mixins } from 'vue-property-decorator'
import { ListFilterMixin } from '../ListFilterMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component
export default class ListFilterSelect extends Mixins(ListFilterMixin) {
  items = null

  created () {
    if (this.filter.hasOptionsRequest()) {
      this.items = this.loadRequestOptions()
    } else if (this.filter.hasOptions()) {
      this.items = this.getOptions()
    }
  }

  get _items () {
    return this.$attrs.items || this.items || []
  }

  get showNullOption () {
    // either null is a selectable option, than it should be shown in the list
    // or the default is null, so the list should offer a 'null' option for the unselected state
    return this.filter.nullIsOption || this.filter.defaultValue === null
  }

  createOptions () {
    const options = []

    if (this.showNullOption) {
      options.push({
        itemTitle: 'Alle',
        itemValue: null
      })
    }

    return options
  }

  async loadRequestOptions () {
    const {models} = await new ListAction()
      .setRequest(this.filter.createOptionsRequest())
      .noEvents()
      .load()

    return [
      ...this.createOptions(),
      ...models.map(model => ({
        itemTitle: model.name,
        itemValue: model.id
      }))
    ]
  }

  getOptions () {
    return [
      ...this.createOptions(),
      ...this.filter.options
        .filter(o => o !== null) // null is already set in options (if any)
        .map(o => ({
          itemTitle: o ? 'Ja' : 'Nein',
          itemValue: o
        }))
    ]
  }
}
</script>
