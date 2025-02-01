<template>
  <a-search-select
    ref="select"
    :listAction="listAction"
    :selectedItems="selectedItems"
    :getSearchInput="() => $refs.searchInput"
    diffXControls="-.5rem"
    diffYControls="-.5rem"
    v-bind="$attrs"
    @select="itemSelected"
    @close="focusInput"
    @beforeOpen="calculateSelectorSize"
  >
    <template #activator="{open}">
      <a-text-field
        ref="input"
        :value="inputModel"
        readonly
        :label="label"
        :rules="validationRules"
        placeholder="Mausklick oder Space/↓-Taste zum Auswählen"
        :clearable="clearable && !!selectedItems.length"
        appendIcon="$dropdown"
        @keydown.space.prevent="open"
        @keydown.down.prevent="open"
        @keydown.enter.prevent="open"
        @clear="clear"
      />
    </template>

    <template #filters="{onSearchInputKey}">
      <a-row gap="4">
        <list-filter-search
          ref="searchInput"
          :focus="true"
          tabindex="1"
          maxWidth="100%"
          :label="'Suche ' + label"
          v-on="onSearchInputKey"
        />

        <list-filter-page
          :has="{page_size: false, page_number: true}"
          :totalVisible="0"
        />
      </a-row>
    </template>

    <template #row="{ model, on }">
      <div
        v-if="$has.icon"
        class="pr-0"
      >
        <v-icon
          :color="model.getIcon().color"
          size="1.5rem"
          class="mr-2"
          v-on="on"
          v-text="model.getIcon().icon"
        />
      </div>

      <div
        style="width:100%;"
        v-on="on"
      >
        {{ getTitle(model) }}
        <div
          v-if="getSubtitle(model)"
          class="grey--text mt-n1"
        >
          {{ getSubtitle(model) }}
        </div>
      </div>
    </template>
  </a-search-select>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['value', 'q', {
    getTitle: {type: Function, default: m => m.getTitle()},
    getSubtitle: {type: Function, default: m => m.getSubtitle()}
  }]
})
export default class FormFieldSearchSelect extends Mixins(FormFieldMixin) {
  $hasOptions = ['icon']

  mounted () {
    if (this.validator) {
      this.$refs.input.validate()
    }
  }

  get inputModel () {
    return (this.model[this.name] && this.model[this.name].getTitle()) || null
  }

  get clearable () {
    if (this.validator && this.validator.getParam('filled')) {
      return false
    }
    return true
  }

  calculateSelectorSize () {
    const input = this.$refs.input.$el
    const inputWidth = input.offsetWidth
    this.$refs.select.setWidth(`calc(${inputWidth}px + 1rem)`)
  }

  get selectedItems () {
    return [this.model[this.name]].filter(a => a)
  }

  get listAction () {
    const request = this.field
      .createOptionsRequest()
      .addParams(this.optionRequestParams || {})
    return ListAction.fromRequest(request)
  }

  itemSelected (model) {
    this.model[this.name] = model
    this.$emit('select', model)
  }

  focusInput () {
    this.$refs.input.setFocus(true)
  }

  clear () {
    this.itemSelected(null)
  }
}
</script>


<style lang="scss" scoped>
.selectedItem,
:deep(.a-table-row) {
  cursor: pointer;
}
</style>
