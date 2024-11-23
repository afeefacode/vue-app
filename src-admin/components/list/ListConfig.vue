<template>
  <div>
    <div
      v-if="bulkSelection"
      class="mb-4"
    >
      <label>Mehrfachauswahl</label>
      <a-checkbox
        v-model="bulkSelection_"
        hide-details
        label="Mehrere auswählen"
        @input="updateList"
      />
    </div>

    <label>Auswahlmodus</label>
    <a-radio-group
      v-model="dragMode"
      @input="updateList"
    >
      <template #default>
        <v-radio value="grab">
          <template #label>
            <a-icon
              :icon="{icon: grabIcon}"
              class="mr-2"
            /> Liste verschieben
          </template>
        </v-radio>
        <v-radio value="select">
          <template #label>
            <a-icon
              :icon="{icon: selectIcon}"
              class="mr-2"
            /> Text auswählen
          </template>
        </v-radio>
      </template>
    </a-radio-group>
  </div>
</template>

<script>
import { Component, Vue } from '@a-vue'
import { mdiTextRecognition, mdiHandBackRight } from '@mdi/js'

@Component({
  props: [{
    bulkSelection: false,
    columns: false
  }]
})
export default class ListConfig extends Vue {
  bulkSelection_ = false
  dragMode = 'grab'

  grabIcon = mdiHandBackRight
  selectIcon = mdiTextRecognition

  created () {
    this.bulkSelection_ = this.listView._bulkSelection
    this.dragMode = this.listView._dragMode
  }

  get listView () {
    let parent = this.$parent
    while (parent) {
      if (parent.LIST_VIEW) {
        return parent
      }
      parent = parent.$parent
    }
    return null
  }

  updateList () {
    this.listView.setBulkSelection(this.bulkSelection_)
    this.listView.setDragMode(this.dragMode)
  }
}
</script>


<style lang="scss" scoped>
.contextButton {
  font-size: .7rem;
  cursor: pointer;
}

label {
  color: gray;
}
</style>
