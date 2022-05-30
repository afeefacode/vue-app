<template>
  <v-form
    v-model="valid"
    autocomplete="off"
  >
    <slot
      :changed="changed"
      :valid="valid"
      :model="modelToEdit"
    />
  </v-form>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: [
    'model',
    'createModelToEdit'
  ]
})
export default class EditForm extends Vue {
  EDIT_FORM = true

  modelToEdit = null
  valid = false
  lastJson = null

  created () {
    this.reset()
  }

  reset () {
    if (this.createModelToEdit) {
      this.modelToEdit = this.createModelToEdit(this.model)
    } else {
      this.modelToEdit = this.model
    }
    this.lastJson = this.json
  }

  /**
   * This will be triggered after the this.model has been set
   * but before sub components may have changed model values
   * as a date field, which could turn a null to a default date.
   * Using the created() method would result in already having set
   * the default date, hence not detecting a valid "change" anymore.
   */
  // @Watch('modelToEdit', {immediate: true})
  // @Watch('modelToEdit')
  // modelToEditChanged () {
  //   this.lastJson = this.json
  //   this.$emit('update:changed', this.changed)
  // }

  @Watch('model')
  modelChanged () {
    this.reset()
  }

  get json () {
    return JSON.stringify(this.modelToEdit)
  }

  get changed () {
    // console.log(this.json)
    // console.log(this.lastJson)
    return this.json !== this.lastJson
  }

  @Watch('valid')
  validChanged () {
    this.$emit('update:valid', this.valid)
  }

  @Watch('changed')
  changedChanged () {
    this.$emit('update:changed', this.changed)
  }
}
</script>
