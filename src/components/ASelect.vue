<template>
  <v-select
    ref="select"
    :rules="validationRules"
    :items="items_"
    :valueComparator="compareValues"
    :style="cwm_widthStyle"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Mixins, Watch } from '@a-vue'
import { Model } from '@afeefa/api-resources-client'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['validator', 'defaultValue', 'items']
})
export default class ASelect extends Mixins(ComponentWidthMixin) {
  items_ = []

  mounted () {
    // monkey patch v-select to set default value on clear
    const clearableCallback = this.select.clearableCallback
    this.select.clearableCallback = () => {
      this.select.isClear = true
      clearableCallback()
      this.select.isClear = false
    }

    const setValue = this.select.setValue
    this.select.setValue = value => {
      if (this.select.isClear) {
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

  get validationRules () {
    const label = this.$attrs.label
    return (this.validator && this.validator.getRules(label)) || []
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
