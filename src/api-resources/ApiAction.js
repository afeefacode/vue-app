import { AlertEvent, LoadingEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'
import { sleep } from '@a-vue/utils/timeout'
import { ApiAction as ApiResourcesApiAction } from '@afeefa/api-resources-client'

import { SaveEvent } from '../events'

export class ApiAction extends ApiResourcesApiAction {
  _dispatchGlobalLoadingEvents = false
  _dispatchGlobalSaveEvents = false
  _minDuration = 100
  _startTime = 0

  id (id) {
    this.param('id', id)
    return this
  }

  dispatchGlobalLoadingEvents (dispatch = true) {
    this._dispatchGlobalLoadingEvents = dispatch
    return this
  }

  dispatchGlobalSaveEvents (dispatch = true) {
    this._dispatchGlobalSaveEvents = dispatch
    return this
  }

  async beforeRequest () {
    this._startTime = Date.now()

    if (this._dispatchGlobalLoadingEvents) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    if (this._dispatchGlobalSaveEvents) {
      eventBus.dispatch(new SaveEvent(SaveEvent.START_SAVING))
    }
  }

  async beforeBulkRequest () {
    if (this._dispatchGlobalLoadingEvents) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    if (this._dispatchGlobalSaveEvents) {
      eventBus.dispatch(new SaveEvent(SaveEvent.START_SAVING))
    }
  }

  async afterRequest () {
    if (this._minDuration) {
      const diffTime = Date.now() - this._startTime
      const restTime = Math.max(0, this._minDuration - diffTime)
      if (restTime) {
        await sleep(restTime / 1000)
      }
    }

    if (this._dispatchGlobalLoadingEvents) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }

    if (this._dispatchGlobalSaveEvents) {
      eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))
    }
  }

  async afterBulkRequest () {
    if (this._dispatchGlobalLoadingEvents) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }

    if (this._dispatchGlobalSaveEvents) {
      eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))
    }
  }

  alert (message) {
    eventBus.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
      message
    }))
  }
}

export class BulkAction extends ApiAction {
}
