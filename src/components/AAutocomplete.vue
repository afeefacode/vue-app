<template>
  <v-autocomplete
    ref="select"
    :items="items_"
    :valueComparator="compareValues"

    :noDataText="noDataText"
    :searchInput.sync="q"
    :loading="isLoading"

    no-filter

    :rules="validationRules"
    v-bind="{...$attrs, dense, outlined}"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'
import { Model } from '@afeefa/api-resources-client'
import { debounce } from '@a-vue/utils/debounce'

@Component({
  props: ['items', 'validator', 'defaultValue', 'selectedItemText', 'debounce', {dense: true, outlined: true}]
})
export default class AAutocomplete extends Vue {
  isLoading = false
  items_ = []
  q = null
  debounceFunction = null

  mounted () {
    // monkey patch v-select setting 'undefined' on clearable
    const setValue = this.select.setValue
    this.select.setValue = value => {
      if (!value && value !== false) { // if undefined alike
        value = this.defaultValue || null
      }
      setValue(value)
    }

    // monkey patch v-select to set selected items while list items not being loaded yet
    const setSelectedItems = this.select.setSelectedItems
    this.select.setSelectedItems = () => {
      setSelectedItems()
      const value = this.select.value
      if (value && !this.select.selectedItems.length) {
        this.select.selectedItems = [
          {
            itemText: this.selectedItemText(value),
            itemValue: value
          }
        ]
      }
    }

    this.init()
  }

  @Watch('items')
  itemsChanged () {
    this.init()
  }

  compareValues (a, b) {
    if (this.valueComparator) {
      return this.valueComparator(a, b)
    }

    if (a instanceof Model && b instanceof Model) {
      return a.equals(b)
    }

    return JSON.stringify(a) === JSON.stringify(b)
  }

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
  }

  get value () {
    return this.$attrs.value
  }

  get valueComparator () {
    return this.$attrs.valueComparator
  }

  get select () {
    return this.$refs.select
  }

  get noDataText () {
    if (this.q && this.q.length) {
      return 'Nichts gefunden'
    }
    return 'Tippen, um zu suchen'
  }

  @Watch('q')
  async keywordChanged () {
    if (this.debounce !== false) {
      const delay = this.debounce || true
      if (!this.debounceFunction) {
        this.debounceFunction = debounce(() => {
          this.load(this.q)
        }, delay, () => this.q)
      }
      this.debounceFunction()
    } else {
      this.load(this.q)
    }
  }

  async load (q) {
    this.isLoading = true

    const items = typeof this.items === 'function' ? this.items(q) : this.items
    if (items instanceof Promise) {
      this.items_ = await items
    } else {
      this.items_ = items
    }

    this.isLoading = false
  }

  async init () {
    // load initial items only if no selected value
    if (!this.select.value) {
      this.items_ = await this.load()
    } else {
      // reset items array to trigger setSelectedItems() function
      // in order to set our current item
      this.items_ = []
    }

    if (this.validator) {
      this.$nextTick(() => {
        const valid = this.select.validate(true)
        const value = this.select.value

        if (value && !valid) {
          this.select.selectedItems = [{
            itemTitle: 'Ungültiger Wert'
          }]
        }
      })
    }
  }
}
</script>
