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
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['totalVisible']
})
export default class ListFilterSelect extends Mixins(ListFilterMixin) {
  items = null

  created () {
    if (this.hasOptionsRequest()) {
      this.items = this.loadRequestOptions()
    } else if (this.hasOptions()) {
      this.items = this.getOptions()
    }
  }

  get _items () {
    return this.$attrs.items || this.items || []
  }

  hasOptions () {
    return this.filter.options
  }

  hasOptionsRequest () {
    return this.filter.request
  }

  async loadRequestOptions () {
    const {models} = await new ListAction()
      .setRequest(this.filter.request)
      .noEvents()
      .load()

    return [
      {
        itemTitle: 'Alle',
        itemValue: null
      },
      ...models.map(model => ({
        itemTitle: model.name,
        itemValue: model.id
      }))

    ]
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
