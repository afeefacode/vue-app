import { eventBus } from '../event-bus/EventBus'
import { RouteEvent } from './RouteEvent'

export class RouteDefinition {
  fullPath = ''
  fullId = ''
  fullName = ''

  parentDefinition = null
  definitionMap = null

  constructor ({
    path,
    component,
    id = '',
    name = '',
    idKey = 'id',
    childrenNamePrefix = '',
    config = {},
    children = [],
    ...options
  }) {
    this.path = path
    this.component = component
    this.id = id || this.getId(path, name)
    this.name = name
    this.idKey = idKey
    this.childrenNamePrefix = childrenNamePrefix
    this.config = config
    this.children = children
    this.options = options
  }

  setParent (parent, parentName) {
    if (parent) {
      if (parent.fullId) {
        this.fullId = [parent.fullId, this.id].join('.')
      } else {
        this.fullId = this.id
      }

      if (!this.path.match(/^\//)) { // relative url
        const parentPath = parent.fullPath.replace(/^\/|\/$/, '')
        this.fullPath = '/' + [parentPath, this.path].filter(rn => rn).join('/')
      } else {
        this.fullPath = this.path
      }

      if (this.name) {
        if (parentName) {
          this.fullName = [parentName, this.name].join('.')
        } else {
          this.fullName = this.name
        }
      }

      this.parentDefinition = parent
    }
  }

  init (parent, parentName, map) {
    this.definitionMap = map

    if (parent) {
      this.setParent(parent, parentName)
    } else {
      this.fullId = this.id
      this.fullPath = this.path
      this.fullName = this.name
    }

    this.definitionMap[this.fullId] = this

    if (this.name && this.path !== '/') { // do not prepend roots name
      parentName = this.fullName
    } else if (this.childrenNamePrefix) {
      parentName = [parentName, this.childrenNamePrefix].filter(n => n).join('.')
    }

    this.children.forEach(c => {
      c.init(this, parentName, map)
    })
  }

  getChild (name) {
    return this.children.find(c => c.name === name)
  }

  toVue () {
    // props
    const optionsProps = this.options.props || {}
    this.options.props = route => {
      let props = optionsProps
      if (typeof props === 'function') {
        props = props(route)
      }
      props.rcp_routeDefinition = this
      return props
    }

    // meta
    this.options.meta = {
      ...this.options.meta,
      routeDefinition: this
    }

    return {
      path: this.path,
      name: this.fullName,
      component: this.component,
      ...this.options,
      children: this.children.map(c => c.toVue())
    }
  }

  getId (path, name) {
    if (path === '/') {
      return 'root'
    }
    if (name) {
      return name
    }
    return [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
  }
}
