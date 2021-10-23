import { apiResources } from '@afeefa/api-resources-client'

class ApiResourcesPlugin {
  install (Vue) {
    Object.defineProperty(Vue.prototype, '$apiResources', {
      get () {
        return apiResources
      }
    })
  }
}

export const apiResourcesPlugin = new ApiResourcesPlugin()
