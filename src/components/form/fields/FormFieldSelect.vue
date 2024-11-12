<template>
  <a-select
    v-model="model[name]"
    :label="label || name"

    :items="_items"
    item-text="itemText"
    item-value="itemValue"

    :clearable="clearable && !!model[name]"

    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldSelect extends Mixins(FormFieldMixin) {
  items = null

  created () {
    this.reloadOptions()
  }

  reloadOptions () {
    if (this.fieldHasOptionsRequest()) {
      this.items = this.getSelectOptions()
    } else if (this.fieldHasOptions()) {
      this.items = this.getSelectOptions()
    }
  }

  get clearable () {
    if (this.validator && this.validator.getParam('filled')) {
      return false
    }
    return true
  }

  get _items () {
    return this.$attrs.items || this.items || []
  }
}
</script>
