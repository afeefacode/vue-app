import Vue from 'vue'
import Router from 'vue-router'

import { BreadcrumbDefinition } from './BreadcrumbDefinition'
import { BreadcrumbSetDefinition } from './BreadcrumbSetDefinition'
import { RouteDefinition } from './RouteDefinition'
import { RouteSetDefinition } from './RouteSetDefinition'

const defaultRouteComponent = {
  template: '<router-view />'
}

class RouteConfigPlugin {
  _definitionMap = {}
  _definitionNameMap = {}

  _defaultComponents = {
    container: defaultRouteComponent,
    list: defaultRouteComponent,
    new: defaultRouteComponent,
    model: defaultRouteComponent,
    detail: defaultRouteComponent,
    edit: defaultRouteComponent
  }

  _defaultBreadcrumbTitles = {
    list: 'List',
    new: 'New',
    detail: 'Detail',
    edit: 'Edit'
  }

  _defaultRoutePaths = {
    new: 'new',
    edit: 'edit'
  }

  _routeDefinitions = []
  _config = {}

  _breadcrumbDefinitions = []
  _breadcrumbDefinitionMap = {}

  _routerOptions = {}
  _router = null
  _routes = []

  _promise = Promise.resolve(true)

  baseUrl (url) {
    return this
  }

  router (options = {}) {
    this._routerOptions = {...this._routerOptions, ...options}
    return this
  }

  install (Vue) {
    Object.defineProperty(Vue.prototype, '$routeDefinition', {
      get () {
        const definition = (this.$props && this.$props.rcp_routeDefinition) ||
          (this.$attrs && this.$attrs.rcp_routeDefinition)
        if (definition) {
          return definition
        }
        return this.$parent.$routeDefinition
      }
    })
  }

  async getRouter () {
    await this._promise
    return this._router
  }

  defaultComponents (components = {}) {
    this._defaultComponents = {
      ...this._defaultComponents,
      ...components
    }
    return this
  }

  defaultBreadcrumbTitles (titles = {}) {
    this._defaultBreadcrumbTitles = {
      ...this._defaultBreadcrumbTitles,
      ...titles
    }
    return this
  }

  defaultRoutePaths (paths = {}) {
    this._defaultRoutePaths = {
      ...this._defaultRoutePaths,
      ...paths
    }
    return this
  }

  config (callback) {
    this._promise = this._promise.then(() => {
      // config is object -> make function
      if (typeof callback !== 'function') {
        const config = callback
        callback = () => config
      }

      // config is function
      callback = callback()

      // function is not async -> make async
      if (!(callback instanceof Promise)) {
        callback = Promise.resolve(callback)
      }

      return callback.then(config => {
        this._config = config
      })
    })
    return this
  }

  routes (callback) {
    this._promise = this._promise.then(() => {
      callback = callback({
        ROUTESET: this.routeSet,
        ROUTE: this.route
      })

      if (!(callback instanceof Promise)) {
        callback = Promise.resolve(callback)
      }

      return callback.then(routeOrRoutes => {
        this._routeDefinitions = Array.isArray(routeOrRoutes) ? routeOrRoutes : [routeOrRoutes]
        this._routeDefinitions.forEach(r => r.init(null, '', this._definitionMap))
        this._routes = this._routeDefinitions.map(r => r.toVue())

        Object.values(this._definitionMap).forEach(d => {
          this._definitionNameMap[d.fullName] = d
        })

        // create router here
        Vue.use(Router)
        Vue.use(this)

        const options = {
          mode: 'history',
          ...this._routerOptions
        }

        this._router = new Router(options)

        for (const route of this._routes) {
          this._router.addRoute(route)
        }
      })
    })

    return this
  }

  breadcrumbs (callback) {
    this._promise = this._promise.then(() => {
      callback = callback({
        BREADCRUMBSET: this.breadcrumbSet,
        BREADCRUMB: this.breadcrumb
      })

      if (!(callback instanceof Promise)) {
        callback = Promise.resolve(callback)
      }

      return callback.then(breadcrumbOrBreadcrumbs => {
        this._breadcrumbDefinitions = Array.isArray(breadcrumbOrBreadcrumbs) ? breadcrumbOrBreadcrumbs : [breadcrumbOrBreadcrumbs]
        this._breadcrumbDefinitions.forEach(b => b.init(null, '', this._breadcrumbDefinitionMap))

        for (const breadcrumbDefinition of Object.values(this._breadcrumbDefinitionMap)) {
          const name = breadcrumbDefinition.name
          breadcrumbDefinition.routeDefinition = this._definitionNameMap[name]
        }
      })
    })

    return this
  }

  async getRoutes () {
    await this._promise
    return this._routes
  }

  async getBreadcrumbs (routeName) {
    await this._promise

    const definitions = []
    let parent = this._breadcrumbDefinitionMap[routeName]
    while (parent) {
      if (parent) {
        definitions.unshift(parent)
      }
      parent = parent.parentDefinition
    }
    return definitions
  }

  async dumpRoutes () {
    await this._promise
    for (const path in this._definitionMap) {
      const r = this._definitionMap[path]
      const whites = ' '.repeat(Math.max(0, 60 - path.length))
      const whites2 = ' '.repeat(Math.max(0, 40 - r.fullName.length))
      console.log('path:', path, whites, 'name:', r.fullName, whites2, 'parent:', r.parentBreadcrumbDefinition && r.parentBreadcrumbDefinition.fullName)
    }
  }

  async dumbBreadcrumbs () {
    await this._promise
    for (const path in this._breadcrumbDefinitionMap) {
      console.log(path, this._breadcrumbDefinitionMap[path])
    }
  }

  route = options => {
    options.config = {
      ...this._config,
      ...options.config
    }
    return new RouteDefinition(options)
  }

  routeSet = options => {
    options.components = {
      ...this._defaultComponents,
      ...options.components
    }
    options.breadcrumbTitles = {
      ...this._defaultBreadcrumbTitles,
      ...options.breadcrumbTitles
    }
    options.routePaths = {
      ...this._defaultRoutePaths,
      ...options.routePaths
    }
    options.config = {
      ...this._config,
      ...options.config
    }
    return new RouteSetDefinition(options).getDefinitions()
  }

  breadcrumb = options => {
    options.config = {
      ...this._config,
      ...options.config
    }
    return new BreadcrumbDefinition(options)
  }

  breadcrumbSet = options => {
    options.breadcrumbTitles = {
      ...this._defaultBreadcrumbTitles,
      ...options.breadcrumbTitles
    }

    options.config = {
      ...this._config,
      ...options.config
    }
    return new BreadcrumbSetDefinition(options).getDefinitions()
  }
}

export const routeConfigPlugin = new RouteConfigPlugin()
