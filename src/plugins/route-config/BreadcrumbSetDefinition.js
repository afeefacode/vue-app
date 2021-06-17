import { BreadcrumbDefinition } from './BreadcrumbDefinition'

export class BreadcrumbSetDefinition {
  constructor ({
    name,
    actions = {},
    titles,
    getTitle,
    breadcrumbTitles,
    children = []
  }) {
    this.name = name
    this.actions = {
      list: true,
      ...actions
    }
    this.titles = titles
    this.getTitle = getTitle
    this.breadcrumbTitles = breadcrumbTitles

    this.children = children.flat()
  }

  getDefinitions () {
    this.children.forEach(c => {
      c.namePrefix = this.name
    })

    const listChildren = [
      this.breadcrumb('new', this.breadcrumbTitles.new),
      this.breadcrumb('detail', this.titles.detail, [
        this.breadcrumb('edit', this.breadcrumbTitles.edit),
        ...this.children
      ])
    ]

    if (this.actions.list) {
      return this.breadcrumb('list', this.titles.list, listChildren)
    } else {
      return listChildren
    }
  }

  breadcrumb (action, title, children = []) {
    const options = {
      name: `${this.name}.${action}`,
      title,
      children
    }

    if (action === 'detail') {
      options.getTitle = this.getTitle
    }

    return new BreadcrumbDefinition(options)
  }
}
