<template>
  <v-select
    ref="select"
    :rules="validationRules"
    :items="items_"
    :valueComparator="compareValues"
    :style="cwm_widthStyle"
    :multiple="multiple"
    v-bind="{...$attrs, dense, outlined}"
    v-on="$listeners"
    @change="selectedItemTitleChanged"
  />
</template>


<script>
import { Component, Mixins, Watch } from '@a-vue'
import { Model } from '@afeefa/api-resources-client'
import { ComponentWidthMixin } from './mixins/ComponentWidthMixin'

@Component({
  props: ['validator', 'defaultValue', 'items', {dense: true, outlined: true, multiple: false}]
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
        if (this.multiple) {
          value = this.defaultValue || []
        } else {
          value = this.defaultValue || null
        }
      }
      setValue(value)
    }

    this.init()
  }

  @Watch('$attrs.value')
  selectedItemTitleChanged () {
    this.$nextTick(() => {
      const title = this.$refs.select?.selectedItems[0]?.itemTitle
      this.$emit('selectedItemTitleChanged', title)
    })
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

    this.selectedItemTitleChanged()

    if (this.validator) {
      this.$nextTick(() => {
        const valid = this.select.validate(true)
        const value = this.select.value

        if (value && !valid) {
          this.select.selectedItems = [{
            itemTitle: 'Ungültiger Wert'
          }]

          this.selectedItemTitleChanged()
        }
      })
    }
  }
}
</script>


<style lang="scss">
.v-application .v-select-list .v-list-item__action {
  margin: 0;
  margin-right: .5rem;
}
</style>

<style lang="scss" scoped>
.v-select {
  flex: unset;
}

.v-text-field :deep(.v-input__icon--clear) { // always show clear icon, https://github.com/vuetifyjs/vuetify/pull/15876
  opacity: 1;
}
</style>
