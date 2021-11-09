import { ListViewFilterSource } from '@afeefa/api-resources-client'

export class NextRouteFilterSource extends ListViewFilterSource {
  route = null

  constructor (route) {
    super()

    this.route = route
  }

  getQuery () {
    return this.route.query
  }
}
