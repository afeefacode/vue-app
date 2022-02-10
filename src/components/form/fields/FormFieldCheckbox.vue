<template>
  <a-checkbox
    v-model="model[name]"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldCheckbox extends Mixins(FormFieldMixin) {
}
</script>
