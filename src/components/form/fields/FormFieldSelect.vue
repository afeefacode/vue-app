<template>
  <a-select
    v-model="model[name]"
    :label="label || name"

    :items="items"
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
  asyncItems = null

  created () {
    if (this.fieldHasOptionsRequest()) {
      this.asyncItems = this.getSelectOptions()
    }
  }

  get items () {
    return this.$attrs.items || this.asyncItems
  }
}
</script>
