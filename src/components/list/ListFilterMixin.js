import { Component, Vue, Watch } from '@a-vue'
import { ListFilterEvent } from '@a-vue/events'

@Component({
  props: ['name', 'label', 'optionRequestParams']
})
export class ListFilterMixin extends Vue {
  displayValue = null
  name_ = null

  @Watch('displayValue')
  displayValueChanged () {
    this.$events.dispatch(new ListFilterEvent(ListFilterEvent.CHANGE, {
      name: this.name,
      label: this.label,
      value: this.displayValue
    }))
  }

  get _name () {
    return this.name || this.name_
  }

  get listView () {
    let parent = this.$parent
    while (parent) {
      if (parent.LIST_VIEW) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  get filters () {
    return this.listView.filters
  }

  get filter () {
    const filter = this.filters[this._name]
    if (!filter) {
      console.warn(`Filter "${this._name}" not found`)
    }
    return filter
  }

  get count () {
    return this.listView.count
  }
}
