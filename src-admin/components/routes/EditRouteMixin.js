import { AlertEvent, DialogEvent, SaveEvent } from '@a-vue/events'
import { sleep } from '@a-vue/utils/timeout'
import { Component, Vue } from 'vue-property-decorator'

@Component
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

  get action () {
    return this.$attrs.action
  }

  get fields () {
    return this.$attrs.fields
  }

  get saveParams () {
    return {}
  }

  get json () {
    return this.modelToEdit.serialize(this.fields)
  }

  async save () {
    this.$events.dispatch(new SaveEvent(SaveEvent.START_SAVING))

    const result = await this.action.request()
      .params(this.saveParams)
      .data(this.modelToEdit.serialize(this.fields))
      .send()

    await sleep()

    this.$events.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

    if (result) {
      this.$events.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
        message: 'Die Daten wurden gespeichert.'
      }))

      const model = result.data
      this.saved(model)
    } else {
      this.$events.dispatch(new AlertEvent(AlertEvent.ERROR, {
        message: 'Die Daten wurden nicht gespeichert.'
      }))
    }
  }

  reset () {
    this.modelToEdit = this.createModelToEdit()
  }

  saved (model) {
    // e.g. redirect after save
  }
}
