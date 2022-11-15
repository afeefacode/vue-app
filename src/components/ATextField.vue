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
    v-on="listeners"
  />
</template>


<script>
import { Component, Watch, Mixins, Inject } from '@a-vue'
import { debounce } from '@a-vue/utils/debounce'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['value', 'debounce', 'validator', 'rules', {dense: true, outlined: true, focus: false, number: false}]
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
  }

  @Watch('value')
  valueChanged () {
    this.setInternalValue(this.value)
  }

  get listeners () {
    // remove input from nested listening
    // let clients listend to only THIS component
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
    return attrs
  }

  clear () {
    if (this.$attrs.clearable || this.escClearable) {
      this.setInternalValue('')
      this.validate()
      this.$emit('input', this.emptyValue)
    }
  }

  inputChanged () {
    this.$emit('input:internal', this.internalValue)

    const valid = this.validate()

    if (!valid) {
      return
    }

    const value = this.stringToNumber(this.internalValue)

    // NaN means: wrong numerical value but no validator present
    if (isNaN(value)) {
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

  stringToNumber (value) {
    if (this.treatAsNumericValue) {
      if (!value) {
        value = null
      } else {
        value = this.internalValue.match(/^\d*(.\d+)?$/) ? parseFloat(this.internalValue) : NaN
      }
    }
    return value
  }

  get type () {
    return this.$attrs.type || 'text'
  }

  get treatAsNumericValue () {
    return this.type === 'number' || this.number
  }

  validate () {
    const rules = this.validationRules
    let errorMessage = null
    for (const rule of rules) {
      const value = this.stringToNumber(this.internalValue)
      const result = rule(value)
      if (result !== true) {
        errorMessage = result
        break
      }
    }

    this.errorMessages = [errorMessage].filter(e => e)
    return !this.errorMessages.length
  }

  @Watch('focus')
  focusChanged () {
    this.setFocus()
  }

  setFocus () {
    const focus = this.focus || false
    if (focus) {
      // if run in a v-dialog, the dialog background would
      // steal the focus without requestAnimationFrame
      requestAnimationFrame(() => {
        this.$el.querySelector('input').focus()
      })
    }
  }

  get validationRules () {
    if (this.$attrs.rules) {
      return this.$attrs.rules
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

  get emptyValue () {
    if (this.validator) {
      return this.validator.getEmptyValue()
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
