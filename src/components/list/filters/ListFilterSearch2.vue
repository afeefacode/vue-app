<template>
  <a-row gap="4">
    <a-text-field
      ref="input"
      v-model="filter.value"
      :maxWidth="$attrs.maxWidth || maxWidth_"
      :label="label_"
      :debounce="500"
      v-bind="$attrs"
      clearable
      hide-details
      @keyup.esc="clearValue"
      v-on="$listeners"
    />

    <a-radio-group
      v-model="filters.qfield.value"
      :options="qFieldOptions"
      row
      hide-details
    />
  </a-row>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'

@Component
export default class ListFilterSearch2 extends Mixins(ListFilterMixin) {
  name_ = 'q'
  maxWidth_ = 200

  clearValue (e) {
    if (this.filter.value) {
      e.stopPropagation()
      this.filter.value = null
    }
  }

  setFocus (force) {
    this.$refs.input.setFocus(force)
  }

  hasQFieldOptions () {
    return this.filters.qfield && this.filters.qfield.hasOptions()
  }

  get qFieldOptions () {
    return this.filters.qfield.options.map(o => ({
      ...o,
      itemText: o.title,
      itemValue: o.value
    }))
  }

  get label_ () {
    const label = this.label || 'Suche'

    if (this.hasQFieldOptions() && !this.filters.qfield.hasDefaultValueSet()) {
      const selected = this.qFieldOptions.filter(o => o.value === this.filters.qfield.value)[0]
      if (selected) {
        return `${label} (${selected.title})`
      }
    }

    return label
  }
}
</script>


<style lang="scss" scoped>
::v-deep() {
  .v-radio {
    margin-right: 14px !important;
    margin-top: -4px;
  }

  .v-input--selection-controls__input {
    margin-right: 3px;
  }
}
</style>
