<template>
  <a-time-picker
    v-model="model[name]"
    class="timePicker"
    :label="label || name"
    :validator="validator"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldTime extends Mixins(FormFieldMixin) {
}
</script>
