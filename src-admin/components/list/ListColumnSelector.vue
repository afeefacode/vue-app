<template>
  <div>
    <a-context-menu>
      <template #activator>
        <div class="contextButton">
          {{ selectedColumns.length }}/{{ Object.keys(columns_).length }}
        </div>
      </template>

      <a-draggable-checkbox-group
        v-model="selectedColumns"
        :options="options"
        v-on="$listeners"
        @input="columnSelected"
        @orderChanged="columnOrderChanged"
      />
    </a-context-menu>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['columns']
})
export default class ListColumnSelector extends Vue {
  columns_ = {}
  selectedColumns = []

  created () {
    this.columns_ = this.columns
    this.selectedColumns = Object.keys(this.columns)
      .filter(k => this.columns[k].visible)
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
  }

  columnOrderChanged (options) {
    const columns = {}
    for (const option of options) {
      columns[option.itemValue] = this.columns[option.itemValue]
    }

    this.columns_ = columns
    this.$emit('update:columns', this.columns_)
  }
}
</script>


<style lang="scss" scoped>
.contextButton {
  font-size: .7rem;
  cursor: pointer;
}
</style>
