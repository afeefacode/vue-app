<template>
  <a-date-input
    v-model="model[name]"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

  @Component
export default class FormFieldDateInput extends Mixins(FormFieldMixin) {
  }
</script>

