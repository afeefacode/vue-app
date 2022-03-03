<template>
  <div>
    <a-search-select
      :listConfig="listConfig"
      :q="q"
      v-on="$listeners"
    >
      <template #activator>
        <slot name="activator" />
      </template>

      <template #filters="{filters, count}">
        <slot
          name="filters"
          :filters="filters"
          :count="count"
        />
      </template>

      <template #row="{ model, on }">
        <slot
          name="row"
          :model="model"
          :on="on"
        />
      </template>
    </a-search-select>

    <v-input
      ref="input"
      v-model="model[name]"
      :rules="validationRules"
    />
  </div>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'

@Component({
  props: ['value', 'q', 'listConfig']
})
export default class FormFieldSearchSelect extends Mixins(FormFieldMixin) {
  mounted () {
    if (this.validator) {
      this.$refs.input.validate(true)
    }
  }
}
</script>
