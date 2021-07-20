<template>
  <a-radio-group
    v-model="model[name]"
    :label="label || name"
    :options="_options"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldRadioGroup extends Mixins(FormFieldMixin) {
  options = null

  created () {
    if (this.fieldHasOptionsRequest()) {
      this.options = this.getSelectOptions()
    } else if (this.fieldHasOptions()) {
      this.options = this.getSelectOptions()
    }
  }

  get _options () {
    return this.$attrs.options || this.options || []
  }
}
</script>
