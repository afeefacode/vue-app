import { RouteParamsFilterSource } from '@a-vue/components/list/RouteParamsFilterSource'
import { AlertEvent, LoadingEvent, SaveEvent } from '@a-vue/events'
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

    return result.data
  }
}

export class SaveAction {
  action = null
  id = null
  fields = null
  data = null
  afterSaveHook = null

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

  async save () {
    eventBus.dispatch(new SaveEvent(SaveEvent.START_SAVING))

    const startTime = Date.now()

    const result = await this.action.request()
      .params({
        id: this.id
      })
      .data(this.data)
      .send()

    const model = result.data

    if (this.afterSaveHook) {
      await this.afterSaveHook(model)
    }

    const diffTime = Date.now() - startTime
    const restTime = Math.max(0, 400 - diffTime)
    if (restTime) {
      await sleep(restTime / 1000)
    }

    eventBus.dispatch(new SaveEvent(SaveEvent.STOP_SAVING))

    if (result) {
      eventBus.dispatch(new AlertEvent(AlertEvent.MESSAGE, {
        message: 'Die Daten wurden gespeichert.'
      }))
      return model
    } else {
      eventBus.dispatch(new AlertEvent(AlertEvent.ERROR, {
        message: 'Die Daten wurden nicht gespeichert.'
      }))
      return null
    }
  }
}

export class ListAction {
  action = null
  fields = null
  filterHistoryKey = null
  requestFilters = null

  setAction (action) {
    this.action = action
    return this
  }

  setRoute (route) {
    this.route = route
    return this
  }

  setFilterHistoryKey (filterHistoryKey) {
    this.filterHistoryKey = filterHistoryKey
    return this
  }

  setRequestFilters (requestFilters) {
    this.requestFilters = requestFilters
    return this
  }

  setFields (fields) {
    this.fields = fields
    return this
  }

  async load () {
    eventBus.dispatch(new LoadingEvent(LoadingEvent.START_LOADING))

    const querySource = new RouteParamsFilterSource(this.route)
    const requestFilters = this.action.createRequestFilters(null, querySource)

    const historyKey = [this.route.path, this.filterHistoryKey].filter(i => i).join('.')
    const storedFilters = RequestFilters.fromHistory(historyKey)
    if (storedFilters) {
      requestFilters.initFromUsed(storedFilters.serialize(), 1)
    }

    const result = await this.action
      .request()
      .fields(this.fields)
      .filters(requestFilters.serialize())
      .send()

    const models = result.data
    const meta = result.meta

    eventBus.dispatch(new LoadingEvent(LoadingEvent.STOP_LOADING))

    return {
      models,
      meta
    }
  }
}
