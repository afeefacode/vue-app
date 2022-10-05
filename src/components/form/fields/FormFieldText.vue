<template>
  <a-text-field
    :value="internalValue"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
    @input="textFieldValueChanged"
    @blur="onBlur"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component({
  props: [{emptyNull: false}]
})
export default class FormFieldText extends Mixins(FormFieldMixin) {
  internalValue = ''

  created () {
    this.setInternalValue(this.model[this.name])
    this.$watch(() => this.model[this.name], value => {
      this.setInternalValue(value)
    })
  }

  onBlur () {
    this.setInternalValue(this.model[this.name], true)
  }

  textFieldValueChanged (value) {
    this.internalValue = value

    // cast to number
    if (this.isNumber) {
      value = Number(value)
      if (isNaN(value)) {
        return // do not set anything to the model
      }
    }

    // set model value to null if empty
    if (this.emptyNull) {
      if (this.isNumber) {
        if (value === 0) {
          value = null
        }
      } else {
        if (!value) {
          value = null
        }
      }
    }

    this.model[this.name] = value
    this.$emit('input', value)
  }

  setInternalValue (value, reset = false) {
    if (this.isNumber) {
      // reset text field if value is null but keep leading 0 (allows for copy and paste)
      if (value === null) {
        if (!reset && this.internalValue === '0') {
          value = '0'
        } else {
          value = ''
        }
      }
    } else { // null string should be ''
      if (!value) {
        value = ''
      }
    }
    this.internalValue = value
  }

  get isNumber () {
    return this.$attrs.number === ''
  }
}
</script>
