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
  //
  // Vergleich per Wert (nicht per Referenz): Ein als Inline-Objekt übergebenes
  // optionRequestParams (:optionRequestParams="{ key: value }") erzeugt bei
  // jedem Re-Render eine neue Referenz, obwohl sich der Inhalt nicht ändert.
  // Würde der Watch darauf neu laden, entstünde eine Endlosschleife
  // (reloadOptions → optionsLoaded → State-Änderung → Re-Render → neue Referenz).
  @Watch('name')
  @Watch('optionRequestParams')
  onFieldChanged (newValue, oldValue) {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return
    }
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
