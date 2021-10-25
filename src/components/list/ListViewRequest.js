import { RequestFilters, apiResources } from '@afeefa/api-resources-client'

export class ListViewRequest {
  _api = {}
  _resource = {}
  _action = {}

  _params = {}
  _filters = {}
  _fields = {}

  _filterSource = null
  _historyKey = null

  action ({api, resource, action}) {
    this._api = api
    this._resource = resource
    this._action = action
    return this
  }

  getAction () {
    return apiResources.getAction({
      api: this._api,
      resource: this._resource,
      action: this._action
    })
  }

  params (params) {
    this._params = params
    return this
  }

  getParams () {
    return this._params
  }

  filters (filters) {
    this._filters = filters
    return this
  }

  getFilters () {
    return this._filters
  }

  fields (fields) {
    this._fields = fields
    return this
  }

  getFields () {
    return this._fields
  }

  initFromFilterSource (filterSource) {
    this._filterSource = filterSource
    return this
  }

  recreateFromHistory (historyKey) {
    this._historyKey = historyKey
    return this
  }

  clone () {
    const request = new ListViewRequest()
    request._api = this._api
    request._resource = this._resource
    request._action = this._action
    request._params = this._params
    request._filters = this._filters
    request._fields = this._fields
    return request
  }

  toApiRequest () {
    const action = this.getAction({
      api: this._api,
      resource: this._resource,
      action: this._action
    })

    const request = action.createRequest()
      .params(this._params)
      .fields(this._fields)

    // filters set on the request will be skipped if filterSource or historyKey are given
    // and produce results
    let filtersToUse = this._filters
    let useHistory = true

    // create and init request filters based on the current filter source state
    if (this._filterSource) {
      const requestFilters = action.createRequestFilters(null, this._filterSource)
      const requestFiltersToUse = requestFilters.serialize()
      // do not use history if any filter given by the given filter source
      if (Object.keys(requestFiltersToUse).length) {
        useHistory = false
      }

      filtersToUse = {
        ...filtersToUse,
        ...requestFiltersToUse
      }
    }

    // if any filters is set by current filter source
    // skip history and give that filter precedence
    // otherwise: set stored filters
    if (useHistory && this._historyKey) {
      // check any already stored filters from a previous request
      const storedFilters = RequestFilters.fromHistory(this._historyKey)
      if (storedFilters) {
        filtersToUse = storedFilters.serialize()
      }
    }

    request.filters(filtersToUse)

    return request
  }
}
