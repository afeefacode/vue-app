import { ListViewFilterSource } from '@afeefa/api-resources-client'

export class CurrentRouteFilterSource extends ListViewFilterSource {
  router = null

  constructor (router) {
    super()

    this.router = router
  }

  getQuery () {
    return this.router.currentRoute.query
  }

  push (query) {
    if (JSON.stringify(this.router.currentRoute.query) !== JSON.stringify(query)) {
      // console.log(JSON.stringify(this.router.currentRoute.query), JSON.stringify(query))
      this.router.push({query})
    }
  }
}
