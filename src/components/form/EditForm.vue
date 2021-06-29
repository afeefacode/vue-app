<template>
  <v-form
    v-model="valid"
    autocomplete="off"
  >
    <slot name="fields" />
  </v-form>
</template>


<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { apiResources } from '@afeefa/api-resources-client'

@Component({
  props: ['model']
})
export default class EditForm extends Vue {
  EDIT_FORM = true

  valid = false
  lastJson = null

  created () {
    this.lastJson = this.json
  }

  get json () {
    return JSON.stringify(this.model)
  }

  get changed () {
    return this.json !== this.lastJson
  }

  @Watch('model')
  modelChanged () {
    this.lastJson = this.json
  }

  @Watch('valid')
  validChanged () {
    this.$emit('update:valid', this.valid)
  }

  @Watch('changed')
  changedChanged () {
    this.$emit('update:changed', this.changed)
  }

  get type () {
    return apiResources.getType(this.model.type)
  }
}
</script>
