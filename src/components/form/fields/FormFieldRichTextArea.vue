<template>
  <a-rich-text-area v-model="model[name]">
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
