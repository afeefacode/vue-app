<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        ref="input"
        :value="formattedDate"
        :label="label"
        :style="cwm_widthStyle"
        v-bind="{...$attrs, ...attrs}"
        :rules="validationRules"
        :error-messages="errorMessages"
        :readonly="type === 'month'"
        v-on="on"
        @input="dateInputChanged"
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
  errorMessages = []

  created () {
    if (this.value) {
      this.value_ = this.value
    } else {
      this.value_Changed() // force validation if date is null
    }
    this.$emit('input', this.value_)
  }

  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }
    this.$refs.input.validate(true)
  }

  @Watch('value')
  valueChanged () {
    this.value_ = this.value
  }

  @Watch('value_')
  value_Changed () { // validate on any change
    this.errorMessages = []
    if (this.validator) {
      const rules = this.validator.getRules(this.label)
      for (const rule of rules) {
        const message = rule(this.value_)
        if (typeof message === 'string') {
          this.errorMessages.push(message)
          break
        }
      }
    }
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

  isDate (value) {
    return value && value.match(/^(3[01]|[12][0-9]|0?[1-9]).(1[012]|0?[1-9]).((?:19|20)\d{2})$/)
  }

  dateInputChanged (value) {
    if (!value) {
      this.dateChanged(null)
    } else if (this.isDate(value)) {
      const [day, month, year] = value.split('.')
      this.dateChanged(new Date(year + '-' + month + '-' + day))
    }
  }

  dateChanged (date) {
    this.menu = false
    this.value_ = date ? new Date(date) : null
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
    if (this.type !== 'month') {
      const dateFormat = v => {
        if (v && !this.isDate(v)) {
          return 'Das Datum sollte das Format TT.MM.JJJJ haben.'
        }
        return true
      }
      return [dateFormat]
    }
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
