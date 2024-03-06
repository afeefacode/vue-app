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
        placeholder="Mausklick oder Space/↓-Taste zum Auswählen"
        :clearable="!!selectedItems.length"
        appendIcon="$dropdown"
        hide-details
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
        {{ model.getTitle() }}
      </div>
    </template>
  </a-search-select>
</template>


<script>
import { Component, Mixins } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['itemTitle', 'itemValue']
})
export default class ListFilterSearchSelect extends Mixins(ListFilterMixin) {
  $hasOptions = ['icon']

  items = []
  inputModel = 'Alle'

  async created () {
    if (this.filter.value) {
      const {models} = await this.createListAction()
        .params({
          [this.filter.name]: this.filter.value
        })
        .load()
      if (models.length) {
        this.inputModel = models[0].getTitle()
      }
    }
  }

  calculateSelectorSize () {
    const input = this.$refs.input.$el
    const inputWidth = input.offsetWidth
    this.$refs.select.setWidth(`calc(${inputWidth}px + 1rem)`)
  }

  get selectedItems () {
    return [this.filter.value].filter(a => a)
  }

  get listAction () {
    return this.createListAction()
  }

  createListAction () {
    const request = this.filter
      .createOptionsRequest()
    return ListAction.fromRequest(request)
  }

  itemSelected (model) {
    if (model) {
      this.filter.value = model.id
      this.inputModel = model.getTitle()
    } else {
      this.filter.value = null
    }
    this.$emit('select', model)
  }

  focusInput () {
    this.$refs.input.setFocus(true)
  }

  clear () {
    this.itemSelected(null)

    setTimeout(() => { // input clear sets internal model to ''
      this.inputModel = 'Alle'
    }, 100)
  }
}
</script>
