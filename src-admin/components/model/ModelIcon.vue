<template>
  <v-icon
    class="modelIcon"
    :color="color"
    v-bind="$attrs"
    v-text="icon"
  />
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['model', 'modelClass']
})
export default class ModelIcon extends Vue {
  get icon () {
    if (this.model) {
      return this.model.getIcon().icon
    } else {
      return this.modelClass.icon.icon
    }
  }

  get color () {
    if (this.model) {
      return this.model.getIcon().color
    } else {
      return this.modelClass.icon.color
    }
  }
}
</script>
