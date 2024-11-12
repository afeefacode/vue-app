<template>
  <div>
    <a-context-menu>
      <template #activator>
        <div class="contextButton">
          {{ selectedColumns.length }}/{{ Object.keys(columns).length }}
        </div>
      </template>

      <a-checkbox-group
        v-model="selectedColumns"
        :options="options"
        vertical
        v-on="$listeners"
        @input="columnSelected"
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
  selectedColumns = []

  created () {
    this.selectedColumns = Object.keys(this.columns)
      .filter(k => this.columns[k].visible)
  }

  get options () {
    return Object.keys(this.columns).map(k => {
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
}
</script>


<style lang="scss" scoped>
.contextButton {
  font-size: .7rem;
  cursor: pointer;
}
</style>
