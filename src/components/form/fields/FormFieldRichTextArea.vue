<template>
  <a-rich-text-area
    v-model="model[name]"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldRichTextArea extends Mixins(FormFieldMixin) {
}
</script>
