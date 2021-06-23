import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'
import { Component, Vue } from 'vue-property-decorator'

import { SaveAction } from './LoadActions'

@Component({
  props: ['saveAction']
})
export default class EditRouteMixin extends Vue {
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

  get json () {
    return this.modelToEdit.serialize(this.fields)
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
    this.modelToEdit = this.createModelToEdit()
  }

  afterSave (_model) {
    // e.g. reload model
  }

  saved (_model) {
    // e.g. redirect after save
  }
}
