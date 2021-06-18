import { Model as ApiResourcesModel } from '@afeefa/api-resources-client'
import { mdiAlphaMCircle } from '@mdi/js'
export class Model extends ApiResourcesModel {
  static RouteConfig = null

  static getLink (action) {
    return (new this()).getLink(action)
  }

  static icon = {
    icon: mdiAlphaMCircle,
    color: 'blue lighten-2'
  }

  getLink (_action = 'detail') {
    return {
      name: '',
      params: {}
    }
  }

  getTitle () {
    return null
  }
}
