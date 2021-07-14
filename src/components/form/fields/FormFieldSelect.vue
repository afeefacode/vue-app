<template>
  <a-select
    v-model="model[name]"
    :label="label || name"

    :items="_items"
    item-text="itemText"
    item-value="itemValue"

    :validator="validator"
    v-bind="$attrs"
  />
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldSelect extends Mixins(FormFieldMixin) {
  items = null

  created () {
    if (this.fieldHasOptionsRequest()) {
      this.items = this.getSelectOptions()
    } else if (this.fieldHasOptions()) {
      this.items = this.getSelectOptions()
    }
  }

  get _items () {
    return this.$attrs.items || this.items || []
  }
}
</script>
