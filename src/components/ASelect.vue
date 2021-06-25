<template>
  <v-select
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
  props: ['validator', 'defaultValue', 'items']
})
export default class ASelect extends Vue {
  items_ = []

  mounted () {
    // monkey patch v-select setting 'undefined' on clearable
    const setValue = this.$refs.select.setValue
    this.$refs.select.setValue = value => {
      if (!value && value !== false) { // if undefined alike
        value = this.defaultValue || null
      }
      setValue(value)
    }

    this.init()
  }

  @Watch('items')
  itemsChanged (newItems, oldItems) {
    // console.log('items changed', newItems, oldItems)
    this.init()
  }

  compareValues (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
  }

  get validationRules () {
    return (this.validator && this.validator.getRules()) || []
  }

  async init () {
    if (this.items instanceof Promise) {
      this.items_ = await this.items
    } else {
      this.items_ = this.items
    }

    if (this.validator) {
      this.$nextTick(() => {
        const valid = this.$refs.select.validate(true)
        const value = this.$refs.select.value

        if (value && !valid) {
          this.$refs.select.selectedItems = [{
            itemTitle: 'Ungültiger Wert'
          }]
        }
      })
    }
  }
}
</script>
