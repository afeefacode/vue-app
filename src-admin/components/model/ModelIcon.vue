<template>
  <v-icon
    :color="color"
    v-bind="$attrs"
    v-text="icon"
  />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model', 'modelClass']
})
export default class ModelIcon extends Vue {
  get icon () {
    return this.modelClass.icon.icon
  }

  get color () {
    return this.modelClass.icon.color
  }
}
</script>
