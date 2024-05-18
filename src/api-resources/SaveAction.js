import { adminConfig } from '@a-admin/config/AdminConfig'
import { AlertEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'

import { ApiAction } from './ApiAction'

export class SaveAction extends ApiAction {
  _showSuccess = true

  _minDuration = adminConfig.app.saveLoaderMinDuration || 400

  hideSuccess () {
    this._showSuccess = false
    return this
  }

  save () {
    return this.execute()
  }

  async afterRequest () {
    await super.afterRequest()

    if (this._showSuccess) {
      this.alert('Die Daten wurden gespeichert.')
    }
  }

  processError (result) {
    if (this._showError) {
      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        headline: 'Die Daten konnten nicht gespeichert werden.',
        message: result.message,
        detail: result.detail
      }))
    }
  }
}
