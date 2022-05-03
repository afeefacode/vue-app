<template>
  <v-form
    v-model="valid"
    autocomplete="off"
  >
    <slot name="fields" />

    <slot
      :changed="changed"
      :valid="valid"
      :model="model"
    />
  </v-form>
</template>


<script>
import { Component, Vue, Watch } from '@a-vue'

@Component({
  props: ['model']
})
export default class EditForm extends Vue {
  EDIT_FORM = true

  valid = false
  lastJson = null

  /**
   * This will be triggered after the this.model has been set
   * but before sub components may have changed model values
   * as a date field, which could turn a null to a default date.
   * Using the created() method would result in already having set
   * the default date, hence not detecting a valid "change" anymore.
   */
  @Watch('model', {immediate: true})
  modelChanged () {
    this.lastJson = this.json
    this.$emit('update:changed', this.changed)
  }

  get json () {
    return JSON.stringify(this.model)
  }

  get changed () {
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
