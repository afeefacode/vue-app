import { Component, Vue } from '@a-vue'
import { SaveAction } from '@a-vue/api-resources/ApiActions'
import { DialogEvent } from '@a-vue/events'

@Component({
  props: ['saveAction']
})
export class EditPageMixin extends Vue {
  valid = false
  changed = false
  modelToEdit = null
  ignoreChanged = false

  unregisterRouterHook = null

  created () {
    this.unregisterRouterHook = this.$router.beforeEach(async (to, from, next) => {
      if (!this.ignoreChanged && this.changed) {
        const result = await this.$events.dispatch(new DialogEvent(DialogEvent.SHOW, {
          title: 'Änderungen verwerfen?',
          message: 'Im Formular sind nicht gespeicherte Änderungen. Sollen diese verworfen werden?',
          yesButton: 'Verwerfen'
        }))
        if (result === DialogEvent.RESULT_YES) {
          next()
        }
        return
      }
      next()
    })
  }

  destroyed () {
    this.unregisterRouterHook()
  }

  createModelToEdit () {
    return null
  }

  get editConfig () {
    return null
  }

  get ModelClass () {
    return this.editConfig.ModelClass
  }

  get _saveAction () {
    if (this.saveAction) {
      return this.saveAction
    }
    return this.modelUpateAction
  }

  get modelUpateAction () {
    return null
  }

  get fields () {
    return this.editConfig.fields
  }

  get saveParams () {
    return {}
  }

  async save () {
    const model = await new SaveAction()
      .setAction(this._saveAction)
      .setFields(this.fields)
      .setId(this.modelToEdit.id)
      .setData(this.modelToEdit.serialize(this.fields))
      .setAfterSaveHook(this.afterSave)
      .save()

    this.saved(model)
  }

  reset () {
    const modelToEdit = this.createModelToEdit()
    if (this.editConfig.createModelToEdit) {
      this.editConfig.createModelToEdit(modelToEdit)
    }
    this.modelToEdit = modelToEdit // this assignment makes modelToEdit recursively reactive
    this.$emit('model', this.modelToEdit)
  }

  afterSave (_model) {
    // e.g. reload model
  }

  saved (_model) {
    // e.g. redirect after save
  }
}
