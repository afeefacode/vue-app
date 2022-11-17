<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="model[name]"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="model[name]"
        :label="label || name"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        dense
        outlined
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-time-picker
      v-if="menu"
      ref="timePicker"
      v-model="model[name]"
      :validator="validator"
      v-bind="$attrs"
      full-width
      scrollable
      format="24hr"
      v-on="$listeners"
      @click:minute="$refs.menu.save(model[name])"
    />
  </v-menu>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component
export default class FormFieldTime extends Mixins(FormFieldMixin) {
  menu = false
  validate () {
    this.$refs.timePicker.validate()
  }
}
</script>
