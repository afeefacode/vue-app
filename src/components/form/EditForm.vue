<template>
  <v-form
    v-model="valid"
    autocomplete="off"
    @submit.prevent
  >
    <slot
      name="form"
      :changed="changed"
      :valid="valid"
      :modelToEdit="modelToEdit"
      :model="model"
      :getField="getField"
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
  forcedUnchange = false


  created () {
    this.reset()
  }

  validate () {
    this.$refs.form.validate()
  }

  getField = name => {
    const modelType = this.$apiResources.getType(this.model.type)
    const update = !!this.model.id
    const fields = update
      ? modelType.getUpdateFields()
      : modelType.getCreateFields()
    return fields[name]
  }

  forceUnchanged () {
    this.forcedUnchange = true
    this.$emit('update:changed', false)
  }

  reset () {
    if (this.createModelToEdit) {
      this.modelToEdit = this.createModelToEdit(this.model)
    } else if (this.model) {
      this.modelToEdit = this.model.cloneForEdit()
    }
    this.lastJson = this.json

    this.$emit('update:modelToEdit', this.modelToEdit)
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
    if (this.forcedUnchange) {
      return false
    }
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
