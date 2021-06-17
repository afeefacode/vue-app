import './config/event-bus'
import './config/components'

import { timeout } from '@a-vue/utils/timeout'
import { apiResources } from '@afeefa/api-resources-client'
import Vue from 'vue'

import routeConfigPlugin from './config/routing'
import vuetify from './config/vuetify'

Vue.config.productionTip = false

export async function bootstrap ({ apis, models, routing }) {
  apiResources
    .registerModels(models)
    .registerApis(apis)

  const splash = new Vue({
    vuetify,
    el: '#app',
    template: '<splash />'
  })

  routing(routeConfigPlugin)
  const router = await routeConfigPlugin.getRouter()
  await apiResources.schemasLoaded()

  // routeConfigPlugin.dumpRoutes()
  // routeConfigPlugin.dumbBreadcrumbs()

  timeout(() => {
    splash.$destroy()

    new Vue({
      vuetify,
      router,
      el: '#app',
      template: '<router-view></router-view>'
    })
  }, 500)
}
