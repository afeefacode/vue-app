<template>
  <a-row gap="4">
    <a-text-field
      ref="input"
      v-model="filter.value"
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

@Component({
  props: [{
    translateOption: {
      default: () => title => title
    }
  }]
})
export default class ListFilterSearch2 extends Mixins(ListFilterMixin) {
  name_ = 'q'

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
      itemText: this.translateOption(o.title),
      itemValue: o.value
    }))
  }

  get label_ () {
    const label = this.label || 'Suche'

    if (this.hasQFieldOptions() && !this.filters.qfield.hasDefaultValueSet()) {
      const selected = this.qFieldOptions.filter(o => o.value === this.filters.qfield.value)[0]
      if (selected) {
        const qFieldTitle = this.translateOption(selected.title)
        return `${label} (${qFieldTitle})`
      }
    }

    return label
  }
}
</script>


<style lang="scss" scoped>
::v-deep() {
  .v-text-field .v-label {
    max-width: unset;
  }

  .v-input--radio-group__input {
    gap: 8px;
  }

  .v-radio {
    margin-right: 6px !important;
  }

  .v-input--selection-controls__input {
    margin-right: 3px;
  }
}
</style>
