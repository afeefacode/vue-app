<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-combobox
        ref="input"
        :value="formattedDate"
        :label="label"
        :style="cwm_widthStyle"
        readonly
        v-bind="{...$attrs, ...attrs}"
        :rules="validationRules"
        v-on="on"
        @click:clear="clearDate"
        @click.native="on.click"
      />
    </template>

    <v-date-picker
      v-if="menu"
      :value="date"
      no-title
      :type="type"
      v-bind="$attrs"
      @input="dateChanged"
    />
  </v-menu>
</template>


<script>
import { Component, Mixins, Watch } from '@a-vue'
import { formatDate } from '@a-vue/utils/format-date'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['value', 'validator', 'type']
})
export default class ADatePicker extends Mixins(ComponentWidthMixin) {
  value_ = null
  menu = false

  created () {
    if (this.value) {
      this.value_ = this.value
    }
    this.$emit('input', this.value_)
  }

  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }
  }

  @Watch('value')
  valueChanged () {
    this.value_ = this.value
  }

  get date () {
    return this.value_
      ? this.value_.toISOString().substr(0, this.type === 'month' ? 7 : 10)
      : null
  }

  get label () {
    return this.$attrs.label
  }

  clearDate () {
    this.value_ = null
    this.$emit('input', this.value_)
  }

  dateChanged (date) {
    this.menu = false
    this.value_ = new Date(date)
    this.$emit('input', this.value_)
  }

  get formattedDate () {
    const date = this.value_
    if (!date) {
      return null
    }
    if (this.type === 'month') {
      const monthName = date.toLocaleString('default', { month: 'long' })
      return monthName + ' ' + date.getFullYear()
    }
    return formatDate(new Date(date))
  }

  get validationRules () {
    return (this.validator && this.validator.getRules(this.label)) || []
  }
}
</script>


<style lang="scss" scoped>
::v-deep .v-select__slot {
  cursor: pointer;
  input {
    cursor: pointer;
  }
}
</style>
