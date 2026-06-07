<template>
  <a-select2
    :optionsRequest="optionsRequest"
    :value="value"
    :label="label"
    :placeholder="placeholder"
    :multiple="multiple"
    clearable
    v-bind="$attrs"
    @change="onChange"
  >
    <template
      v-if="$scopedSlots.row"
      #row="slotProps"
    >
      <slot
        name="row"
        v-bind="slotProps"
      />
    </template>
  </a-select2>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

// Form-Hülle für ASelect2. Arbeitet direkt mit Models (linkOne/linkMany):
// `model[name]` ist ein Model (Einfach) bzw. ein Array von Models (Mehrfach).
// Polarität gibt es im Formular nicht — Relationen sind reine Zuordnungen.
@Component({
  props: ['placeholder', {
    multiple: false
  }]
})
export default class FormFieldSelect2 extends Mixins(FormFieldMixin) {
  // ASelect2-Außenwert: Model (Einfach) bzw. Model[] (Mehrfach).
  get value () {
    const current = this.model[this.name]
    if (this.multiple) {
      return Array.isArray(current) ? current : []
    }
    return current || null
  }

  optionsRequest () {
    return this.field
      .createOptionsRequest()
      .addParams(this.optionRequestParams || {})
  }

  onChange (value) {
    this.model[this.name] = value
    this.$emit('change', value)
  }
}
</script>
