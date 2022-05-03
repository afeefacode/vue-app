<template>
  <div>
    <slot name="fields" />

    <slot :model="model" />
  </div>
</template>


<script>
import { Component, Vue } from '@a-vue'

@Component({
  props: ['model']
})
export default class NestedEditForm extends Vue {
  EDIT_FORM = true

  created () {
    if (!this.model) {
      console.warn('Nested edit form does not have a model.')
    }
  }
}
</script>
