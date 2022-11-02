import './config/event-bus'
import './config/components'
import './directives'

import { authPlugin } from '@a-admin/plugins/AuthPlugin'
import { translationPlugin } from '@a-admin/plugins/translation/TranslationPlugin'
import { apiResourcesPlugin } from '@a-vue/plugins/api-resources/ApiResourcesPlugin'
import { hasOptionsPlugin } from '@a-vue/plugins/has-options/HasOptionsPlugin'
import { timeout } from '@a-vue/utils/timeout'
import Vue from 'vue'

import { appConfig } from './config/AppConfig'
import routeConfigPlugin from './config/routing'
import vuetify from './config/vuetify'

Vue.use(apiResourcesPlugin)
Vue.use(hasOptionsPlugin)
Vue.use(translationPlugin)

Vue.config.productionTip = false

export async function bootstrap ({ apis, models, routing, authService, getTranslations, app, components }) {
  appConfig.authService = authService
  appConfig.app = app
  appConfig.components = components

  if (authService) {
    const authenticated = await authService.authenticate()
    if (!authenticated) {
      return
    }
    Vue.use(authPlugin)
  }

  const splash = new Vue({
    vuetify,
    el: '#splash',
    template: '<splash />',
    components: {
      Splash: components.Splash
    }
  })

  if (authService) {
    await authService.init()
  }

  apiResourcesPlugin.register(models, apis)

  routing(routeConfigPlugin)
  const router = await routeConfigPlugin.getRouter()

  await apiResourcesPlugin.schemasLoaded()

  if (getTranslations) {
    const translations = await getTranslations(apiResourcesPlugin.apiResources)
    translationPlugin.setTranslations(translations.models)
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
