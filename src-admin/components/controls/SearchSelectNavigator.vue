<template>
  <a-search-select
    ref="select"
    :listAction="listAction"
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
        readonly
        :label="label"
        placeholder="Mausklick oder Space/↓-Taste zum Auswählen"
        :clearable="false"
        appendIcon="$dropdown"
        @keydown.space.prevent="open"
        @keydown.down.prevent="open"
        @keydown.enter.prevent="open"
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
import { Component, Vue } from '@a-vue'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: [
    'modelType',
    'label',
    'fields',
    {
      getTitle: {type: Function, default: m => m.getTitle()},
      getSubtitle: {type: Function, default: m => m.getSubtitle()}
    }]
})
export default class SearchSelectNavigator extends Vue {
  $hasOptions = ['icon']

  calculateSelectorSize () {
    const input = this.$refs.input.$el
    const inputWidth = input.offsetWidth
    this.$refs.select.setWidth(`calc(${inputWidth}px + 1rem)`)
  }

  get listAction () {
    return new ListAction()
      .action({
        resourceType: this.modelType,
        actionName: 'list'
      })
      .filters()
      .fields(this.fields)
  }

  itemSelected (model) {
    this.$router.push(model.getLink('detail'))
  }

  focusInput () {
    this.$refs.input.setFocus(true)
  }
}
</script>


<style lang="scss" scoped>
.selectedItem,
:deep(.a-table-row) {
  cursor: pointer;
}
</style>
