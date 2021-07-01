import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['name', 'label', 'width']
})
export class ListFilterMixin extends Vue {
  name_ = null
  width_ = 'auto'

  get _name () {
    return this.name || this.name_
  }

  get widthStyle () {
    const width = this.width || this.width_
    return `min-width: 100px; max-width: ${width}px;`
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
    return this.filters[this._name]
  }

  get count () {
    return this.listView.count
  }
}
