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

  get showNullOption () {
    // either null is a selectable option, than it should be shown in the list
    // or the default is null, so the list should offer a 'null' option for the unselected state
    return this.filter.nullIsOption || this.filter.defaultValue === null
  }

  createOptions () {
    const options = []

    if (this.filter.allIsOption) {
      options.push({
        itemTitle: 'Alle',
        itemValue: 'all'
      })
    } else if (this.showNullOption) {
      options.push({
        itemTitle: 'Alle',
        itemValue: null
      })
    }

    if (this.filter.noneIsOption) {
      options.push({
        itemTitle: 'Keine',
        itemValue: 'none'
      })
    }

    return options
  }

  async loadRequestOptions () {
    const {models} = await ListAction
      .fromRequest(this.filter.createOptionsRequest())
      .load()

    return [
      ...this.createOptions(),
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
      })
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
