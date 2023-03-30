<template>
  <div :class="{time}">
    <a-date-picker
      ref="datePicker"
      v-model="model[name]"
      :label="label || name"
      :validator="validator"
      v-bind="$attrs"
      v-on="$listeners"
    />

    <a-time-picker
      v-if="time"
      ref="timePicker"
      v-model="model[name]"
      class="timePicker"
      :label="label || name"
      :validator="validator"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component({
  props: [{ time: false }]
})
export default class FormFieldDate extends Mixins(FormFieldMixin) {
  validate () {
    this.$refs.datePicker.validate()
  }
}
</script>


<style lang="scss" scoped>
.time {
  display: flex;
  align-items: center;
  gap: .7rem;
}

.timePicker {
  margin-top: -28px;
}
</style>
