<template>
  <v-select
    ref="select"
    :rules="validationRules"
    :items="items_"
    :valueComparator="compareValues"
    :style="widthStyle"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Model } from '@afeefa/api-resources-client'

@Component({
  props: ['validator', 'defaultValue', 'items', 'width']
})
export default class ASelect extends Vue {
  items_ = []

  mounted () {
    // monkey patch v-select setting 'undefined' on clearable
    const setValue = this.select.setValue
    this.select.setValue = value => {
      if (!value && value !== false) { // if undefined alike
        value = this.defaultValue || null
      }
      setValue(value)
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
      return a.id === b.id && a.type === b.type
    }

    return JSON.stringify(a) === JSON.stringify(b)
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

  get validationRules () {
    return (this.validator && this.validator.getRules()) || []
  }

  get valueComparator () {
    return this.$attrs.valueComparator
  }

  get select () {
    return this.$refs.select
  }

  async init () {
    const items = typeof this.items === 'function' ? this.items() : this.items

    if (items instanceof Promise) {
      this.items_ = await items
    } else {
      this.items_ = items
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
