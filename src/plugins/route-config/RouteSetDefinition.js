import { RouteDefinition } from './RouteDefinition'

export class RouteSetDefinition {
  constructor ({
    path,
    name,
    ignoreBreadcrumb = false,
    idKey = 'id',
    components,
    routePaths,
    config = {},
    children = []
  }) {
    this.path = path
    this.name = name
    this.ignoreBreadcrumb = ignoreBreadcrumb
    this.idKey = idKey
    this.components = components
    this.routePaths = routePaths
    this.config = config
    this.children = children
  }

  getDefinitions () {
    const children = []

    if (this.components.list) {
      children.push(this.route('list', '', true, false))
    }

    if (this.components.new) {
      children.push(this.route('new', this.routePaths.new, true, false))
    }

    const modelChildren = []

    if (this.components.detail) {
      modelChildren.push(this.route('detail', '', true, true))
    }

    if (this.components.edit) {
      const path = this.components.detail ? this.routePaths.edit : ''
      modelChildren.push(this.route('edit', path, true, true))
    }

    return this.route('container', this.path, false, false, [
      ...children,
      this.route('model', `:${this.idKey}`, false, true, [
        ...modelChildren,
        ...this.children
      ])
    ])
  }

  route (action, path, hasRouteName, hasId, children = []) {
    const options = {
      path,
      component: this.components[action],
      name: hasRouteName ? action : '',
      ignoreBreadcrumb: this.ignoreBreadcrumb,
      config: this.config,
      children
    }

    if (['container'].includes(action)) {
      options.id = `${this.name}.${action}`
      options.childrenNamePrefix = this.name
    } else {
      options.id = action
    }

    if (hasId) {
      options.idKey = this.idKey
    }

    return new RouteDefinition(options)
  }
}
