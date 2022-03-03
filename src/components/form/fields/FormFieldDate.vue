<template>
  <a-date-picker
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
export default class FormFieldDate extends Mixins(FormFieldMixin) {
}
</script>
