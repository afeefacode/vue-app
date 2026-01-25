<template>
  <div>
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
    >
      <template
        v-if="hasQFieldOptions()"
        #append
      >
        <a-context-menu>
          <template #activator>
            <!-- click.prevent brings hand cursor -->
            <!-- mousedown.stop will prevent the input focused -->
            <a-icon
              @click.prevent
              @mousedown.stop
            >
              {{ appendIcon }}
            </a-icon>
          </template>

          <a-context-menu-item
            v-for="option in qFieldOptions"
            :key="option.title"
            @click="filters.qfield.value = option.value"
          >
            <a-icon :class="{selected: filters.qfield.value === option.value}">
              $checkIcon
            </a-icon>
            {{ option.title }}
          </a-context-menu-item>
        </a-context-menu>
      </template>
    </a-text-field>
  </div>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'

@Component
export default class ListFilterSearch extends Mixins(ListFilterMixin) {
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

  get appendIcon () {
    if (this.hasQFieldOptions()) {
      return '$filterIcon'
    }
  }

  hasQFieldOptions () {
    return this.filters.qfield && this.filters.qfield.hasOptions()
  }

  get qFieldOptions () {
    return this.filters.qfield.options
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
.contextMenuItem > *:not(.selected) {
  opacity: 0;
}
</style>
