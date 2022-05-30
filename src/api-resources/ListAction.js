import { NextRouteFilterSource } from '@a-vue/components/list/NextRouteFilterSource'
import { ListViewModel } from '@afeefa/api-resources-client'

import { ApiAction } from './ApiAction'

export class ListAction extends ApiAction {
  load () {
    return this.execute()
  }

  initFiltersForRoute (route) {
    const request = new ListViewModel(this)
      // read from next route query string, but do not push
      // list component will be init with used_filters
      .filterSource(new NextRouteFilterSource(route), false)
      // read from history, but do not push
      // list component will be init with used_filters
      .historyKey(route.path, false)
      .initFilters({
        source: true,
        history: true
      })
      .getApiRequest()

    return ListAction.fromRequest(request)
  }
}
