<template>
  <a-autocomplete
    v-model="model[name]"
    :label="label || name"
    :style="cwm_widthStyle"

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
import { ComponentWidthMixin } from '../../mixins/ComponentWidthMixin'

@Component
export default class FormFieldSelect2 extends Mixins(FormFieldMixin, ComponentWidthMixin) {
  asyncItems = null

  created () {
    if (this.fieldHasOptionsRequest()) {
      this.asyncItems = q => this.getSelectOptions({q})
    }
  }

  get items () {
    return this.$attrs.items || this.asyncItems
  }
}
</script>
