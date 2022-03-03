import { Component, Vue } from '@a-vue'

@Component({
  props: ['name', 'label']
})
export class ListFilterMixin extends Vue {
  name_ = null
  maxWidth_ = null

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
