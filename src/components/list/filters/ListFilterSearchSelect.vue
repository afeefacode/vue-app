<template>
  <a-search-select
    ref="select"
    :listAction="listAction"
    :specialItems="specialItems"
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
        :title="inputModel"
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
          :color="getIcon(model).color"
          size="1.5rem"
          class="mr-2"
          v-on="on"
          v-text="getIcon(model).icon"
        />
      </div>

      <div
        style="width:100%; white-space: normal;"
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
import { Component, Mixins, Watch } from '@a-vue'
import { ListFilterMixin } from '../ListFilterMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'
import { ApiAction } from '@a-vue/api-resources/ApiAction'
import { Category } from '@/models'

@Component({
  props: ['itemTitle', 'itemValue', 'optionRequestFilters', 'selectedItemRequestParams', {
    selectedKey: 'id',
    getTitle: {type: Function, default: m => m.getTitle()},
    getSubtitle: {type: Function, default: m => m.getSubtitle()},
    getIcon: {type: Function, default: m => m.getIcon()}
  }]
})
export default class ListFilterSearchSelect extends Mixins(ListFilterMixin) {
  $hasOptions = ['icon']

  items = []
  inputModel = 'Alle'
  filterChangedFromInside = false

  async created () {
    this.onFilterValueChanged()
  }

  @Watch('filter.value')
  async onFilterValueChanged () {
    if (this.filterChangedFromInside) {
      return
    }

    if (this.filter.value) {
      const request = this.createLoadSelectedItemRequest()
      const apiAction = ApiAction.fromRequest(request)

      const result = await apiAction.execute()

      // list or single
      const model = result.models ? result.models[0] : result

      if (model) {
        if (this.filter.value) {
          const selectedModel = model
          if (selectedModel) {
            this.inputModel = selectedModel.getTitle()
          }
        }
      } else {
        // wrong id tried to load
        if (request.getParams()?.id) {
          this.inputModel = 'ID ' + this.filter.value
        } else { // wrong filter or other param loaded
          this.inputModel = this.filter.value
        }
      }
    } else {
      this.inputModel = 'Alle'
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
    const request = this.filter
      .createOptionsRequest()
      .addFilters(this.optionRequestFilters || {})
    return ListAction.fromRequest(request)
  }


  get specialItems () {
    // make array-typed options to proper models in order to show them
    // alongside the other list items
    return this.filter.options.map(o => {
      return Category.defaults({
        id: o.value,
        title: o.title
      })
    })
  }

  createLoadSelectedItemRequest () {
    const request = this.filter.createOptionsRequest()

    const getAction = this.$apiResources.getAction({
      resourceType: request.getAction().getResource().getType(),
      actionName: this.selectedItemRequestParams?.actionName || 'get'
    })

    request.action(getAction)

    if (this.selectedItemRequestParams) {
      request.params(this.selectedItemRequestParams.params)
      request.filters(this.selectedItemRequestParams.filters)
    } else {
      request.params({[this.selectedKey]: this.filter.value})
    }

    return request
  }

  itemSelected (model) {
    this.filterChangedFromInside = true

    if (model) {
      this.filter.value = model.id
      this.inputModel = model.getTitle()
    } else {
      this.filter.value = null
    }

    this.$nextTick(() => {
      this.filterChangedFromInside = false
    })

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
