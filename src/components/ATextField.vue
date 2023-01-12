<template>
  <v-text-field
    ref="input"
    v-model="internalValue"
    :counter="counter"
    :style="cwm_widthStyle"
    :error-messages="errorMessages"
    v-bind="attrs"
    @input="inputChanged"
    @keyup.esc="clear"
    @click:clear="clear"
    @blur="sanitizeInternalValue"
    v-on="listeners"
  >
    <template #append>
      <slot name="append" />
    </template>
  </v-text-field>
</template>


<script>
import { Component, Watch, Mixins, Inject } from '@a-vue'
import { debounce } from '@a-vue/utils/debounce'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['value', 'debounce', 'validator', 'rules', {dense: true, outlined: true, clearable: false, focus: false, number: false}]
})
export default class ATextField extends Mixins(ComponentWidthMixin) {
  $hasOptions = ['counter']

  @Inject({ from: 'form', default: null }) form

  internalValue = null
  errorMessages = []
  debounceInputFunction = null

  created () {
    this.form && this.form.register(this)

    this.setInternalValue(this.value)
  }

  mounted () {
    this.setFocus()

    this.$emit('input:internal', this.internalValue)
    this.validate()
  }

  setInternalValue (value) {
    if (typeof value === 'number') {
      value = value.toString()
    }
    this.internalValue = value || ''
    this.validate()
  }

  @Watch('value')
  valueChanged () {
    const value = this.textFieldValueToModelValue()
    if (value === this.value) {
      // return if sanitized textfield value === model value
      return
    }
    this.setInternalValue(this.value)
  }

  get listeners () {
    // remove @input from nested listening
    // let clients listen to only THIS component
    const listeners = {...this.$listeners}
    delete listeners.input
    return listeners
  }

  get attrs () {
    // remove 'rules' from being passed to v-text-field
    const attrs = {...this.$attrs}
    delete attrs.rules

    attrs.dense = this.dense
    attrs.outlined = this.outlined
    attrs.clearable = this.clearable
    return attrs
  }

  clear (event) {
    if (this.clearable) {
      // empty value if value exists
      if (this.internalValue) {
        event.stopPropagation() // break propagation chain, do not close popups e.g.
      }
      this.setInternalValue('')

      this.$emit('input:internal', '')

      if (this.debounceInputFunction) {
        this.debounceInputFunction(this.internalValue)
      } else {
        this.$emit('input', this.emptyModelValue)
      }

      this.$emit('clear')
    }
  }

  inputChanged () {
    this.$emit('input:internal', this.internalValue)

    const valid = this.validate()
    if (!valid) {
      return
    }

    const value = this.textFieldValueToModelValue()

    // value === NaN means: wrong numerical value AND no validator present
    // otherwise validator would return validate() -> false
    if (Number.isNaN(value)) {
      return
    }

    if (this.debounce) {
      if (!this.debounceInputFunction) {
        this.debounceInputFunction = debounce(value => {
          this.$emit('input', value)
        }, this.debounce, value => value) // fire immediately if !value (click clearable-x)
      }
      this.debounceInputFunction(value)
    } else {
      this.$emit('input', value)
    }
  }

  validate () {
    const value = this.textFieldValueToModelValue()
    const rules = this.validationRules
    let errorMessage = null
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errorMessage = result
        break
      }
    }

    this.errorMessages = [errorMessage].filter(e => e)
    this.$emit('update:valid', !this.errorMessages.length)
    return !this.errorMessages.length
  }

  @Watch('focus')
  focusChanged () {
    this.setFocus()
  }

  sanitizeInternalValue () {
    const sanitizedValue = this.getSanitizedInternalValue()
    this.setInternalValue(sanitizedValue)
  }

  getSanitizedInternalValue () {
    return this.getSanitizedValue(this.internalValue)
  }

  getSanitizedValue (value) {
    if (this.validator) {
      const sanitizers = this.validator.getSanitizers()
      for (const sanitizer of sanitizers) {
        value = sanitizer(value)
      }
    }
    return value
  }

  textFieldValueToModelValue () {
    const sanitizedValue = this.getSanitizedInternalValue()
    return this.stringToNumber(sanitizedValue)
  }

  stringToNumber (value) {
    const textFieldType = this.$attrs.type || 'text'
    const treatAsNumericValue = textFieldType === 'number' || this.number

    if (treatAsNumericValue) {
      if (!value) {
        value = null
      } else {
        value = this.internalValue.match(/^-?\d*(\.\d+)?$/) ? parseFloat(this.internalValue) : NaN
      }
    } else {
      if (!value) {
        value = this.emptyModelValue
      }
    }

    return value
  }

  setFocus (force = false) {
    const focus = this.focus || force // set focus if this.focus or else if forced from outside
    if (focus) {
      // if run in a v-dialog, the dialog background would
      // steal the focus without requestAnimationFrame
      requestAnimationFrame(() => {
        this.$el.querySelector('input').focus()
      })
    }
  }

  get validationRules () {
    if (this.rules) {
      return this.rules
    }
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }

  get counter () {
    if (!this.$has.counter) {
      return null
    }

    if (!this.validator) {
      return null
    }

    return this.validator.getMaxValueLength()
  }

  get emptyModelValue () {
    if (this.validator) {
      return this.getSanitizedValue('')
    }
    return null
  }
}
</script>


<style lang="scss" scoped>
.v-input:not(.v-input--is-focused) :deep(.v-counter) { // hide counter when not focused
  display: none;
}

.v-text-field :deep(.v-input__icon--clear) { // always show clear icon, https://github.com/vuetifyjs/vuetify/pull/15876
  opacity: 1;
}
</style>
