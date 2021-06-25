<template>
  <v-autocomplete
    ref="select"
    :rules="validationRules"
    :items="items_"
    :value-comparator="compareValues"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  props: ['validator', 'defaultValue', 'items', 'selectedText']
})
export default class AAutocomplete extends Vue {
  items_ = []

  mounted () {
    const select = this.select

    // monkey patch v-select setting 'undefined' on clearable
    const setValue = select.setValue
    select.setValue = value => {
      if (!value && value !== false) { // if undefined alike
        value = this.defaultValue || null
      }
      setValue(value)
    }

    // monkey patch v-select to set intial items while items not being loaded yet
    // const setSelectedItems = select.setSelectedItems
    // select.setSelectedItems = () => {
    //   setSelectedItems()
    //   const value = select.value
    //   if (value && !select.selectedItems.length) {
    //     select.selectedItems = [
    //       {
    //         itemText: this.selectedText(value),
    //         itemValue: value
    //       }
    //     ]
    //   }
    // }

    this.init()
  }

  @Watch('items')
  itemsChanged () {
    this.init()
  }

  compareValues (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  get validationRules () {
    return (this.validator && this.validator.getRules()) || []
  }

  get select () {
    return this.$refs.select
  }

  async init () {
    if (this.items instanceof Promise) {
      this.items_ = await this.items
    } else {
      this.items_ = this.items
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
