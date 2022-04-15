import { apiResources } from '@afeefa/api-resources-client'

class ApiResourcesPlugin {
  apiResources = apiResources

  register (models, apis) {
    apiResources
      .registerModels(models)
      .registerApis(apis)
  }

  schemasLoaded () {
    return apiResources.schemasLoaded()
  }

  install (Vue) {
    Object.defineProperty(Vue.prototype, '$apiResources', {
      get () {
        return apiResources
      }
    })
  }
}

export const apiResourcesPlugin = new ApiResourcesPlugin()
