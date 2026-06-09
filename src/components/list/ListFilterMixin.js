import { Component, Vue, Watch } from '@a-vue'
import { ListFilterEvent } from '@a-vue/events'

@Component({
  props: ['name', 'label', 'optionRequestParams']
})
export class ListFilterMixin extends Vue {
  displayValue = null
  // Optionaler vollständiger Tooltip-Text für den Bar-Chip (Hover) — der Chip
  // selbst zeigt den gekürzten `displayValue`. Filter, die das nicht setzen,
  // bekommen keinen Tooltip. Mehrere Einträge bricht man mit \n um.
  displayTitle = null
  name_ = null

  // Nur auf displayValue lauschen — displayTitle wird immer GEMEINSAM mit
  // displayValue gesetzt (s. ListFilterSelect2), ein eigener Watcher darauf würde
  // dasselbe Event nur ein zweites Mal feuern. Der title wird hier mitgelesen.
  @Watch('displayValue')
  displayValueChanged () {
    this.$events.dispatch(new ListFilterEvent(ListFilterEvent.CHANGE, {
      name: this.name,
      label: this.label,
      value: this.displayValue,
      title: this.displayTitle
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
