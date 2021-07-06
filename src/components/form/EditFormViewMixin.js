import { SaveAction } from '@a-vue/api-resources/ApiActions'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['model', 'fields', 'updateFields', 'saveAction', 'afterSaveHook']
})
export class EditFormViewMixin extends Vue {
  valid = false
  changed = false

  async save () {
    const model = await new SaveAction()
      .setAction(this.saveAction)
      .setFields(this.fields)
      .setId(this.model.id)
      .setData(this.model.serialize(this.updateFields))
      .setAfterSaveHook(this.afterSaveHook)
      .save()

    this.saved(model)
  }

  reset () {
    this.$emit('reset')
  }

  saved () {
    this._saved()
    this.$emit('saved')
  }

  _saved () {
  }
}
