import { AlertEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'

import { ApiAction } from './ApiAction'

export class SaveAction extends ApiAction {
  _minDuration = 400

  save () {
    return this.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    this.alert('Die Daten wurden gespeichert.')
  }

  processError (result) {
    eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
      headline: 'Die Daten konnten nicht gespeichert werden.',
      message: result.message,
      detail: result.detail
    }))
  }
}
