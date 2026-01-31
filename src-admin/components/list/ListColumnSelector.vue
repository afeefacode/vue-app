<template>
  <div>
    <a-context-menu>
      <template #activator>
        <v-btn
          class="columnsButton"
          title="Spalten wählen"
        >
          <v-icon color="#BBBBBB">
            {{ mdiViewColumn }}
          </v-icon>
          <div class="ml-1">
            {{ selectedColumns.length }}/{{ Object.keys(columns_).length }}
          </div>
        </v-btn>
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

      <v-btn
        v-if="drag"
        x-small
        text
        class="mt-2 reset-button"
        @click="resetColumnOrder"
      >
        <v-icon
          small
          class="mr-1"
        >
          {{ mdiRestore }}
        </v-icon>
        Reihenfolge zurücksetzen
      </v-btn>
    </a-context-menu>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { mdiRestore, mdiViewColumn } from '@mdi/js'

@Component({
  props: ['columns', 'storageKey', {drag: false}]
})
export default class ListColumnSelector extends Vue {
  mdiViewColumn = mdiViewColumn
  mdiRestore = mdiRestore

  columns_ = {}
  defaultColumns = {}
  selectedColumns = []

  created () {
    this.defaultColumns = JSON.parse(JSON.stringify(this.columns))
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
    for (const key in this.columns_) {
      this.columns_[key].visible = this.selectedColumns.includes(key)
    }
    this.$emit('update:columns', this.columns_)
    this.saveColumnConfiguration()
  }

  resetColumnOrder () {
    this.columns_ = JSON.parse(JSON.stringify(this.defaultColumns))
    this.selectedColumns = Object.keys(this.columns_)
      .filter(k => this.columns_[k].visible)
    this.$emit('update:columns', this.columns_)
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
          const columns = {}
          const jsonColumns = JSON.parse(storageItem)

          // setzte alle stored columns, die auch in liste definiert sind
          for (const key in jsonColumns) {
            if (this.columns[key]) { // liste hat key
              columns[key] = jsonColumns[key]
            }
          }

          // setzte nun noch alle list columns, die nicht im store waren
          for (const key in this.columns) {
            if (!columns[key]) { // key noch nicht gesetzt
              columns[key] = this.columns[key]
            }
          }

          this.columns_ = columns
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
.columnsButton {
  padding: 0 8px 0 5px !important;
  height: 2.2rem !important;

  div {
    font-size: .8rem;
    color: #666666;
  }
}

.reset-button {
  font-size: .75rem;
  text-transform: none;
  letter-spacing: normal;
}
</style>
