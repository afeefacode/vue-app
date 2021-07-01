<template>
  <a-text-area
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
export default class FormFieldTextArea extends Mixins(FormFieldMixin) {
}
</script>
