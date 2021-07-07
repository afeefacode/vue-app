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
        :value="formattedDate"
        :label="label"
        :style="widthStyle"
        readonly
        v-bind="attrs"
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
import { Component, Vue } from 'vue-property-decorator'
import { formatDate } from '@a-vue/utils/format-date'

@Component({
  props: ['value', 'validator', 'width']
})
export default class ADatePicker extends Vue {
  value_ = new Date()
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

  get widthStyle () {
    if (this.width) {
      let width = this.width
      if (!isNaN(width)) {
        width = width + 'px'
      }
      return `max-width: ${width};`
    }
  }

  get date () {
    return this.value_
      ? this.value_.toISOString().substr(0, 10)
      : null
  }

  get label () {
    return this.$attrs.label
  }

  dateChanged (date) {
    this.menu = false
    this.value_ = new Date(date)
    this.$emit('input', this.value_)
  }

  get formattedDate () {
    const date = this.value_
    return formatDate(date ? new Date(date) : null)
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
