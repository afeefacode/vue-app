import { AlertEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'

import { ApiAction } from './ApiAction'

export class GetAction extends ApiAction {
  load () {
    return this.execute()
  }

  processError (result) {
    eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
      headline: 'Die Daten konntent nicht geladen werden.',
      message: result.message,
      detail: result.detail
    }))
  }
}
