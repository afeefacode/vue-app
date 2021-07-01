<template>
  <a-text-field
    v-model="model[name]"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
  />
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldText extends Mixins(FormFieldMixin) {
}
</script>
