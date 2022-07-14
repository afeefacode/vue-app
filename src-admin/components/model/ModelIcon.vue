<template>
  <v-icon
    class="modelIcon"
    :color="_color"
    v-bind="$attrs"
    v-on="$listeners"
    v-text="icon"
  />
</template>

<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['model', 'modelClass', 'color']
})
export default class ModelIcon extends Vue {
  get icon () {
    if (this.model) {
      return this.model.getIcon().icon
    } else {
      return this.modelClass.icon.icon
    }
  }

  get _color () {
    if (this.color) {
      return this.color
    }

    if (this.model) {
      return this.model.getIcon().color
    } else {
      return this.modelClass.icon.color
    }
  }
}
</script>
