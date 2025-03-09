<template>
  <a-text-field
    ref="input"
    v-model="model[name]"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #append>
      <slot name="append" />
    </template>
  </a-text-field>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldText extends Mixins(FormFieldMixin) {
  setFocus () {
    this.$refs.input.setFocus(true)
  }
}
</script>
