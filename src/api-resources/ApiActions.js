import { AlertEvent, DialogEvent, LoadingEvent, SaveEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'
import { sleep } from '@a-vue/utils/timeout'

export class GetAction {
  action = null
  id = null
  fields = null
  events = true

  setAction (action) {
    this.action = action
    return this
  }

  setId (id) {
    this.id = id
    return this
  }

  setFields (fields) {
    this.fields = fields
    return this
  }

  noEvents (noEvents) {
    this.events = noEvents === undefined ? false : !noEvents
    return this
  }

  async load () {
    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    const result = await this.action.createRequest()
      .params({
        id: this.id
      })
      .fields(this.fields)
      .send()

    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }

    if (result.error) {
      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        headline: 'Die Daten konntent nicht geladen werden.',
        message: result.message,
        detail: result.detail
      }))
    }

    return result.data || false
  }
}

export class SaveAction {
  action = null
  id = null
  fields = null
  data = null
  afterSaveHook = null
  returnAfterSaveHookResult = false
  dialog = null

  setAction (action) {
    this.action = action
    return this
  }

  setId (id) {
    this.id = id
    return this
  }

  setFields (fields) {
    this.fields = fields
    return this
  }

  setData (data) {
    this.data = data
    return this
  }

  setAfterSaveHook (afterSaveHook, returnAfterSaveHookResult = false) {
    this.afterSaveHook = afterSaveHook
    this.returnAfterSaveHookResult = returnAfterSaveHookResult
    return this
  }

  setDialog (dialog) {
    this.dialog = dialog
    return this
  }

  async save () {
    if (this.dialog) {
      const result = await eventBus.dispatch(new DialogEvent(DialogEvent.SHOW, this.dialog))

      if (result !== DialogEvent.RESULT_YES) {
        return null
      }
    }

    eventBus.dispatch(new SaveEvent(SaveEvent.START_SAVING))

    const startTime = Date.now()

    const result = await this.action.createRequest()
      .params({
        id: this.id || undefined
      })
      .fields(this.fields)
      .data(this.data)
      .send()

    const model = result.data

    let afterSaveHookResult = null

    if (!result.error) {
      if (this.afterSaveHook) {
        afterSaveHookResult = await this.afterSaveHook(model)
      }
    }

    const diffTime = Date.now() - startTime
    const restTime = Math.max(0, 400 - diffTime)
    if (restTime) {
      await sleep(restTime / 1000)
    }

    eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

    if (result.error) {
      eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        headline: 'Die Daten wurden nicht gespeichert',
        message: result.message,
        detail: result.detail
      }))
      return null
    }

    eventBus.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
      message: 'Die Daten wurden gespeichert.'
    }))

    if (this.returnAfterSaveHookResult) {
      return afterSaveHookResult
    }

    return model
  }
}

export class RemoveAction {
  action = null
  id = null
  fields = null
  afterRemoveHook = null
  dialog = null

  setAction (action) {
    this.action = action
    return this
  }

  setId (id) {
    this.id = id
    return this
  }

  setAfterRemoveHook (afterRemoveHook) {
    this.afterRemoveHook = afterRemoveHook
    return this
  }

  setDialog (dialog) {
    this.dialog = dialog
    return this
  }

  async delete () {
    const result = await eventBus.dispatch(new DialogEvent(DialogEvent.SHOW, this.dialog))

    if (result === DialogEvent.RESULT_YES) {
      eventBus.dispatch(new SaveEvent(SaveEvent.START_SAVING))

      const startTime = Date.now()

      const result = await this.action.createRequest()
        .params({
          id: this.id
        })
        .data(null)
        .send()

      if (this.afterRemoveHook) {
        await this.afterRemoveHook()
      }

      const diffTime = Date.now() - startTime
      const restTime = Math.max(0, 400 - diffTime)
      if (restTime) {
        await sleep(restTime / 1000)
      }

      eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

      if (result) {
        eventBus.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
          message: 'Die Daten wurden gel??scht.'
        }))
        return true
      } else {
        eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
          message: 'Die Daten wurden nicht gel??scht.'
        }))
      }
    }
    return false
  }
}

export class ListAction {
  action = null
  request = null
  params = {}
  fields = {}
  filters = {}
  events = true

  setAction (action) {
    this.action = action
    return this
  }

  setRequest (request) {
    this.request = request
    return this
  }

  setParams (params) {
    this.params = params
    return this
  }

  setFields (fields) {
    this.fields = fields
    return this
  }

  setFilters (filters) {
    this.filters = filters
    return this
  }

  noEvents (noEvents) {
    this.events = noEvents === undefined ? false : !noEvents
    return this
  }

  async load () {
    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    if (!this.request) {
      this.request = this.action.createRequest()
        .params(this.params)
        .fields(this.fields)
        .filters(this.filters)
    }

    const result = await this.request.send()

    if (result.error) {
      if (this.events) {
        eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
      }

      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        headline: 'Die Daten konntent nicht geladen werden.',
        message: result.message,
        detail: result.detail
      }))

      return false
    }

    const models = result.data
    const meta = result.meta

    // await sleep(2)

    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))
    }

    return {
      models,
      meta
    }
  }
}
