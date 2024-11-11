<template>
  <a-select
    v-model="filter.value"
    :label="label || name"
    :items="_items"
    itemText="itemTitle"
    itemValue="itemValue"
    :clearable="filter.hasDefaultValue() && !filter.hasDefaultValueSet()"
    :defaultValue="filter.defaultValue"
    hide-details
    v-bind="$attrs"
  />
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['itemTitle', 'itemValue']
})
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

  async loadRequestOptions () {
    const {models} = await ListAction
      .fromRequest(this.filter.createOptionsRequest())
      .load()

    return [
      ...this.getOptions(),
      ...models.map(model => {
        let itemValue
        if (this.itemValue) {
          itemValue = this.itemValue(model)
        } else if (model.value !== undefined) {
          itemValue = model.value
        } else {
          itemValue = model.id
        }
        return {
          itemTitle: (this.itemTitle && this.itemTitle(model)) || model.name || model.title,
          itemValue
        }
      }),
      ...this.getOptions(true)
    ]
  }

  getOptions (prepend = false) {
    return [
      ...this.filter.options
        .filter(o => !!o.prepend === prepend)
        .map(o => {
          return {
            itemTitle: o.title,
            itemValue: o.value
          }
        })
    ]
  }
}
</script>
