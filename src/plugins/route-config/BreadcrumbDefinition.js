import { Set } from 'core-js'

export class BreadcrumbDefinition {
  definitionMap = null
  parentDefinition = null

  constructor ({
    name,
    title,
    getTitle,
    namePrefix = '',
    children = []
  }) {
    this.namePrefix = namePrefix
    this.name = name

    this.title = title
    this.getTitle = getTitle
    this.children = children
  }

  init (parent, parentName, map) {
    this.parentDefinition = parent

    if (this.namePrefix) {
      this.name = [this.namePrefix, this.name].filter(n => n).join('.')
      parentName = [parentName, this.namePrefix].filter(n => n).join('.')
    } else {
      this.name = [parentName, this.name].filter(n => n).join('.')
    }

    this.definitionMap = map
    this.definitionMap[this.name] = this

    this.children.forEach(c => {
      c.init(this, parentName, map)
    })
  }

  setParent (parent, parentName) {
    if (parent) {
      this.parentDefinition = parent
    }
  }

  toBreadcrumb (routeParams) {
    const idKeys = new Set()
    let definition = this.routeDefinition
    while (definition) {
      idKeys.add(definition.idKey)
      definition = definition.parentDefinition
    }

    const params = {}

    idKeys.forEach(idKey => {
      if (routeParams[idKey]) {
        params[idKey] = routeParams[idKey]
      }
    })

    return {
      title: this.title,
      getTitle: this.getTitle,
      to: {
        name: this.name,
        params
      }
    }
  }
}
