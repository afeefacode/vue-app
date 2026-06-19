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
import { Component, Mixins, Watch } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldSelect extends Mixins(FormFieldMixin) {
  items = null

  created () {
    this.reloadOptions()
  }

  // Beim Recycling der Komponente (z.B. ein v-if-Block mit Select wird durch
  // einen anderen v-if-Block mit Select an gleicher Position ersetzt) läuft
  // created() nicht erneut. Ändert sich dabei das angebundene Feld (name) oder
  // dessen optionRequestParams, müssen die Options neu geladen werden – sonst
  // zeigt das Select die Optionen des vorherigen Felds.
  @Watch('name')
  @Watch('optionRequestParams')
  onFieldChanged () {
    this.reloadOptions()
  }

  reloadOptions () {
    if (this.fieldHasOptionsRequest() || this.fieldHasOptions()) {
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
