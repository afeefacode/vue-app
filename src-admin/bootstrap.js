import './config/event-bus'
import './config/components'

import { apiResourcesPlugin } from '@a-vue/plugins/api-resources/ApiResourcesPlugin'
import { hasOptionsPlugin } from '@a-vue/plugins/has-options/HasOptionsPlugin'
import { timeout } from '@a-vue/utils/timeout'
import { apiResources } from '@afeefa/api-resources-client'
import Vue from 'vue'

import { appConfig } from './config/AppConfig'
import routeConfigPlugin from './config/routing'
import vuetify from './config/vuetify'

Vue.use(apiResourcesPlugin)
Vue.use(hasOptionsPlugin)

Vue.config.productionTip = false

export async function bootstrap ({ apis, models, routing, authService, app, components }) {
  apiResources
    .registerModels(models)
    .registerApis(apis)

  appConfig.authService = authService
  appConfig.app = app
  appConfig.components = components

  const splash = new Vue({
    vuetify,
    el: '#splash',
    template: '<splash />',
    components: {
      Splash: components.Splash
    }
  })

  routing(routeConfigPlugin)
  const router = await routeConfigPlugin.getRouter()
  await apiResources.schemasLoaded()

  if (authService) {
    authService.initApp(router)
  }

  // routeConfigPlugin.dumpRoutes()
  // routeConfigPlugin.dumbBreadcrumbs()

  timeout(() => {
    new Vue({
      vuetify,
      router,
      el: '#app',
      template: '<start :splash="splash" />',
      data: {
        splash
      }
    })
  }, 500)
}
