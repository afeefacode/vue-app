import { RouteParamsFilterSource } from '@a-vue/components/list/RouteParamsFilterSource'
import { AlertEvent, DialogEvent, LoadingEvent, SaveEvent } from '@a-vue/events'
import { eventBus } from '@a-vue/plugins/event-bus/EventBus'
import { sleep } from '@a-vue/utils/timeout'
import { RequestFilters } from '@afeefa/api-resources-client'

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

  noEvents () {
    this.events = false
    return this
  }

  async load () {
    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    const result = await this.action.request()
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

  setAfterSaveHook (afterSaveHook) {
    this.afterSaveHook = afterSaveHook
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

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .fields(this.fields)
      .data(this.data)
      .send()

    const model = result.data

    if (!result.error) {
      if (this.afterSaveHook) {
        await this.afterSaveHook(model)
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

      const result = await this.action.request()
        .params({
          id: this.id
        })
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
          message: 'Die Daten wurden gelöscht.'
        }))
        return true
      } else {
        eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
          message: 'Die Daten wurden nicht gelöscht.'
        }))
      }
    }
    return false
  }
}

export class ListAction {
  request = null
  action = null
  fields = null
  scopes = {}
  filters = {}
  route = null
  events = true

  setRequest (request) {
    this.request = request
    return this
  }

  setAction (action) {
    this.action = action
    return this
  }

  setFiltersForRoute (route) {
    this.route = route
    return this
  }

  setFields (fields) {
    this.fields = fields
    return this
  }

  setScopes (scopes) {
    this.scopes = scopes
    return this
  }

  setFilters (filters) {
    this.filters = filters
    return this
  }

  noEvents () {
    this.events = false
    return this
  }

  async load () {
    if (this.events) {
      eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))
    }

    let filters = this.filters

    if (this.route) {
      const querySource = new RouteParamsFilterSource(this.route)
      const requestFilters = this.action.createRequestFilters(null, querySource)
      const storedFilters = RequestFilters.fromHistory(this.route.path)
      if (storedFilters) {
        requestFilters.initFromUsed(storedFilters.serialize(), 1)
      }
      filters = requestFilters.serialize()
    }

    const request = this.request ||
      this.action
        .request()
        .scopes(this.scopes)
        .filters(filters)
        .fields(this.fields)

    const result = await request.send()

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
