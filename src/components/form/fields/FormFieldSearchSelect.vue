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
        :clearable="!!selectedItems.length"
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
      <v-icon
        :color="model.getIcon().color"
        size="1.5rem"
        class="mr-2"
        v-on="on"
        v-text="model.getIcon().icon"
      />

      <div
        style="width:100%;"
        v-on="on"
      >
        {{ model.getTitle() }}
      </div>
    </template>
  </a-search-select>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['value', 'q', 'listConfig']
})
export default class FormFieldSearchSelect extends Mixins(FormFieldMixin) {
  mounted () {
    if (this.validator) {
      this.$refs.input.validate()
    }
  }

  get inputModel () {
    return (this.model[this.name] && this.model[this.name].getTitle()) || null
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
    return ListAction.fromRequest(this.field.getOptionsRequest())
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
