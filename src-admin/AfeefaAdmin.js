import './config/components'
import './directives'

import { apiResourcesPlugin } from '@a-vue/plugins/api-resources/ApiResourcesPlugin'
import { eventBusPlugin } from '@a-vue/plugins/event-bus/EventBusPlugin'
import { hasOptionsPlugin } from '@a-vue/plugins/has-options/HasOptionsPlugin'
import { timeout } from '@a-vue/utils/timeout'
import Vue from 'vue'

import { adminConfig } from './config/AdminConfig'
import routeConfigPlugin from './config/routing'
import vuetify from './config/vuetify'
import { authPlugin } from './plugins/AuthPlugin'
import { configPlugin } from './plugins/ConfigPlugin'

Vue.config.productionTip = false

export class AfeefaAdmin {
  _appConfig = {}
  _routeConfigCallback = null
  _apiConfig = null
  _authService = null
  _initCallback = null
  _components = {}

  app (appConfig) {
    this._appConfig = appConfig
    return this
  }

  customConfig (customConfig) {
    adminConfig.config = customConfig
    return this
  }

  routing (routeConfigCallback) {
    this._routeConfigCallback = routeConfigCallback
    return this
  }

  api (apiConfig) {
    this._apiConfig = apiConfig
    return this
  }

  auth (authService) {
    this._authService = authService
    return this
  }

  init (initCallback) {
    this._initCallback = initCallback
    return this
  }

  async run () {
    // set app config
    adminConfig.app = this._appConfig

    Vue.use(configPlugin)

    // authenticate current user before doing any gui-voodo
    if (this._authService) {
      adminConfig.authService = this._authService

      const authenticated = await this._authService.authenticate()
      if (!authenticated) {
        return // redirects to login
      }
      Vue.use(authPlugin)
    }

    // auth went well, show splash screen
    const splash = new Vue({
      vuetify,
      el: '#splash',
      template: '<splash />',
      components: {
        Splash: adminConfig.app.components.Splash
      }
    })

    // plugins
    Vue.use(hasOptionsPlugin)
    Vue.use(eventBusPlugin)

    // load auth resources
    if (this._authService) {
      await this._authService.init()
    }

    // setup api resources
    apiResourcesPlugin.register(this._apiConfig.models, this._apiConfig.apis)
    Vue.use(apiResourcesPlugin)
    await apiResourcesPlugin.schemasLoaded()

    // load initial data
    if (this._initCallback) {
      await this._initCallback(this)
    }

    // setup router, routes and breadcrumb
    this._routeConfigCallback(routeConfigPlugin)
    const router = await routeConfigPlugin.getRouter()

    // routeConfigPlugin.dumpRoutes()
    // routeConfigPlugin.dumbBreadcrumbs()

    // remove splash show app
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
    }, adminConfig.app.appLoaderMinDuration || 300)
  }
}
