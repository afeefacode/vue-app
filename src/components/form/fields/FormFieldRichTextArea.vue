<template>
  <a-rich-text-area
    v-model="model[name]"
    v-bind="$attrs"
    :validator="validator"
    :label="label"
    v-on="$listeners"
  >
    <template #buttons>
      <slot name="buttons" />
    </template>
  </a-rich-text-area>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldRichTextArea extends Mixins(FormFieldMixin) {
}
</script>
