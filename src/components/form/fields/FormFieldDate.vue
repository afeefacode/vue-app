<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on }">
      <v-combobox
        :value="formattedDate"
        :label="label"
        readonly
        v-on="on"
      />
    </template>

    <v-date-picker
      :value="date"
      no-title
      @input="dateChanged"
    />
  </v-menu>
</template>

<script>
import { Component, Mixins } from 'vue-property-decorator'
import { FormFieldMixin } from '../FormFieldMixin'
import { formatDate } from '@a-vue/utils/format-date'

@Component
export default class FormFieldDate extends Mixins(FormFieldMixin) {
  menu = false

  get date () {
    const date = this.model[this.name]
    return date
      ? date.toISOString().substr(0, 10)
      : null
  }

  dateChanged (date) {
    this.menu = false
    this.model[this.name] = new Date(date)
  }

  get formattedDate () {
    const date = this.model[this.name]
    return formatDate(date ? new Date(date) : null)
  }
}
</script>
