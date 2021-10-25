import { BaseFilterSource } from '@afeefa/api-resources-client'

export class RouteQueryFilterSource extends BaseFilterSource {
  route = null

  constructor (route) {
    super()

    this.route = route
  }

  getQuery () {
    return this.route.query
  }

  push (_query) {
  }
}
