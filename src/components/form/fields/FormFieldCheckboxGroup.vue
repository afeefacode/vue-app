<template>
  <a-checkbox-group
    v-model="model[name]"
    :label="label"
    :options="_options"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldCheckboxGroup extends Mixins(FormFieldMixin) {
  options = null

  created () {
    if (this.fieldHasOptionsRequest() || this.fieldHasOptions()) {
      this.options = this.getSelectOptions()
    }
  }

  get _addNullOption () {
    return false
  }

  get _options () {
    return this.$attrs.options || this.options || []
  }
}
</script>
