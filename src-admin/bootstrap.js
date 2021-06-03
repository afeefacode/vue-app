import './config/event-bus'

import { timeout } from '@a-vue/utils/timeout'
import { apiResources } from '@afeefa/api-resources-client'
import Vue from 'vue'

import { routeConfigPlugin } from './config/routing'
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

  routing = routing(routeConfigPlugin)
  const router = await routing.getRouter()
  await apiResources.schemasLoaded()

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
