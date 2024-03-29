<template>
  <div>
    <a-table
      v-if="selectedItems.length"
      :style="selectedWidthStyle"
    >
      <a-table-header
        v-if="hasHeader"
        small
      >
        <div
          v-for="(column, index) in selectedColumns"
          :key="index"
        >
          {{ column.header }}
        </div>
      </a-table-header>

      <a-table-row
        v-for="(item, index) in selectedItems"
        :key="item.id"
        :selected="isClicked(item)"
      >
        <template v-for="(column, index2) in selectedColumns">
          <v-icon
            v-if="column.icon"
            :key="'icon' + index2"
            :color="column.icon.color"
            class="selectedIcon"
            size="1.5rem"
            v-text="column.icon.icon"
          />

          <div
            v-else
            :key="'text' + index2"
            class="selectedContent"
          >
            {{ column.text(item) }}
          </div>
        </template>

        <div>
          <a-context-menu
            :ref="'editItem' + index"
            @open="clickedItem = item"
            @close="clickedItem = null"
          >
            <a-context-menu-item @click="removeItem(item, index)">
              <v-icon>$trashCanIcon</v-icon>
              Löschen
            </a-context-menu-item>
          </a-context-menu>
        </div>
      </a-table-row>
    </a-table>

    <div v-else>
      {{ isEmptyText }}
    </div>

    <a-search-select
      :listAction="selectableConfig.listAction"
      :selectedItems="selectableSelectedItems"
      :width="selectableWidth"
      @select="addItem"
    >
      <template #activator>
        <a-icon-button
          small
          icon="$plusIcon"
          :text="selectableConfig.addButtonTitle || 'Hinzufügen'"
          class="mt-4"
        />
      </template>

      <template #filters>
        <a-row gap="4">
          <list-filter-search
            :focus="true"
            maxWidth="100%"
            label="Suche Berater:in"
          />

          <list-filter-page
            :has="{page_size: false, page_number: true}"
            :totalVisible="0"
          />
        </a-row>
      </template>

      <template #row="{ model, on }">
        <template
          v-for="(column, index) in selectableColumns"
          v-on="on"
        >
          <v-icon
            v-if="column.icon"
            :key="'icon' + index"
            :color="column.icon.color"
            class="selectableIcon"
            size="1.5rem"
            v-on="on"
            v-text="column.icon.icon"
          />

          <div
            v-else
            :key="'text' + index"
            class="selectableContent"
            v-on="on"
          >
            {{ column.text(model) }}
          </div>
        </template>
      </template>
    </a-search-select>
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: [
    'value',
    'selectedConfig',
    'selectedWidth',
    'selectableConfig',
    'selectableWidth'
  ]
})
export default class SearchSelectFormField extends Vue {
  clickedItem = null

  get hasHeader () {
    return this.selectedColumns.some(c => !!c.header)
  }

  get selectedItems () {
    return this.value
  }

  get selectableSelectedItems () {
    return this.value.map(this.selectedConfig.selectedToSelectableItem)
  }

  get isEmptyText () {
    return this.selectedConfig.isEmptyText
  }

  isClicked (selectedItem) {
    return selectedItem === this.clickedItem
  }

  get selectedColumns () {
    return this.selectedConfig.columns
  }

  get selectableColumns () {
    return this.selectableConfig.columns
  }

  addItem (selectableItem) {
    const selectedItem = this.selectedConfig.newSelectedItem(selectableItem)
    const selectedItems = [...this.value, selectedItem]
    if (this.$listeners.add) {
      this.$emit('add', selectedItems)
    } else {
      this.$emit('input', selectedItems)
    }
  }

  async removeItem (selectedItem, rowIndex) {
    const removeDialog = this.selectedConfig.removeDialog(selectedItem)
    const dialog = {
      anchor: this.$refs['editItem' + rowIndex], // is array [component]
      ...removeDialog,
      yesButton: 'Löschen',
      yesColor: 'red white--text'
    }

    const selectedItems = this.value.filter(i => i !== selectedItem)
    if (this.$listeners.remove) {
      this.$emit('remove', selectedItems, dialog)
    } else {
      this.$emit('input', selectedItems)
    }
  }

  get selectedWidthStyle () {
    if (!this.selectedWidth) {
      return ''
    }

    let width = this.selectedWidth
    if (!isNaN(width)) {
      width = width + 'px'
    }
    return `width: ${width};`
  }
}
</script>


<style scoped lang="scss">
.selectedIcon:deep() {
  padding-right: .3rem !important;
}

.selectableIcon:deep() {
  padding-right: 2rem !important;
}

.selectedContent:deep() {
  width: 100%;
}

.selectableContent:deep() {
  width: 100%;
}
</style>
