import { AlertEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'

import { ApiAction } from './ApiAction'

export class DeleteAction extends ApiAction {
  _minDuration = 400

  delete () {
    return this.execute()
  }

  execute () {
    this.data(null)

    return super.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    this.alert('Die Daten wurden gelöscht.')
  }

  processResult () {
    return true
  }

  processError (result) {
    if (this._showError) {
      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        headline: 'Die Daten konnten nicht gelöscht werden.',
        message: result.message,
        detail: result.detail
      }))
    }
  }
}
