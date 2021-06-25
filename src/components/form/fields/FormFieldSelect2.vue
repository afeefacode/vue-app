<template>
  <a-autocomplete
    v-model="model[name]"
    :label="label || name"

    :no-data-text="noDataText"
    :search-input.sync="q"
    :loading="isLoading"

    no-filter

    :items="items_"
    item-text="itemText"
    item-value="itemValue"
    :selectedText="item => item.getTitle()"

    :validator="validator"
    v-bind="$attrs"
  />
</template>

<script>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import FormFieldMixin from '../FormFieldMixin'

@Component({
  props: ['items']
})
export default class FormFieldSelect2 extends Mixins(FormFieldMixin) {
  isLoading = false
  items_ = []
  q = null

  @Watch('q')
  async keywordChanged () {
    this.isLoading = true
    if (this.q && this.q.length) {
      this.items_ = await this.items(this.q)
    } else {
      this.items_ = []
    }
    this.isLoading = false
  }

  get noDataText () {
    if (this.q && this.q.length) {
      return 'Nichts gefunden'
    }
    return 'Tippen, um zu suchen'
  }

  created () {
    if (this.model[this.name]) {
      this.q = this.model[this.name].getTitle()
    }
  }
}
</script>
