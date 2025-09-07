<template>
  <div>
    <a-context-menu>
      <template #activator>
        <div class="contextButton">
          {{ selectedColumns.length }}/{{ Object.keys(columns_).length }}
        </div>
      </template>

      <a-draggable-checkbox-group
        v-if="drag"
        v-model="selectedColumns"
        :options="options"
        v-on="$listeners"
        @input="columnSelected"
        @orderChanged="columnOrderChanged"
      />

      <a-checkbox-group
        v-else
        v-model="selectedColumns"
        vertical
        :options="options"
        v-on="$listeners"
        @input="columnSelected"
      />
    </a-context-menu>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['columns', 'storageKey', {drag: false}]
})
export default class ListColumnSelector extends Vue {
  columns_ = {}
  selectedColumns = []

  created () {
    this.loadColumnConfiguration()
    this.saveColumnConfiguration()
  }

  get options () {
    return Object.keys(this.columns)
      .map(k => {
        return {
          itemText: this.columns[k].title,
          itemValue: k
        }
      })
  }

  columnSelected () {
    for (const key in this.columns) {
      this.columns[key].visible = this.selectedColumns.includes(key)
    }
    this.saveColumnConfiguration()
  }

  columnOrderChanged (options) {
    const columns = {}
    for (const option of options) {
      columns[option.itemValue] = this.columns[option.itemValue]
    }

    this.columns_ = columns
    this.$emit('update:columns', this.columns_)
    this.saveColumnConfiguration()
  }

  loadColumnConfiguration () {
    if (this.storageKey) {
      try {
        const storageItem = localStorage.getItem(`column-config-${this.storageKey}`)
        if (storageItem) {
          this.columns_ = JSON.parse(storageItem)
          this.selectedColumns = Object.keys(this.columns_)
            .filter(k => this.columns_[k].visible)

          this.$emit('update:columns', this.columns_)
          return
        }
      } catch (error) {
        console.warn('Failed to load column configuration from localStorage:', error)
      }
    }

    this.columns_ = this.columns
    this.selectedColumns = Object.keys(this.columns_)
      .filter(k => this.columns[k].visible)
  }

  saveColumnConfiguration () {
    if (!this.storageKey) {
      return
    }

    try {
      localStorage.setItem(`column-config-${this.storageKey}`, JSON.stringify(this.columns_))
    } catch (error) {
      console.warn('Failed to save column configuration to localStorage:', error)
    }
  }
}
</script>


<style lang="scss" scoped>
.contextButton {
  font-size: .7rem;
  cursor: pointer;
}
</style>
