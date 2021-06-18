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
      new: true,
      detail: true,
      edit: true,
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

    const listChildren = []
    if (this.actions.new) {
      listChildren.push(this.breadcrumb('new', this.breadcrumbTitles.new))
    }

    const detailChildren = []
    if (this.actions.edit) {
      detailChildren.push(this.breadcrumb('edit', this.breadcrumbTitles.edit))
    }

    if (this.actions.detail) {
      listChildren.push(this.breadcrumb('detail', this.titles.detail, [
        detailChildren,
        ...this.children
      ]))
    } else {
      listChildren.push(
        ...detailChildren,
        ...this.children
      )
    }

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

    if (action === 'detail' || (!this.actions.detail && action === 'edit')) {
      options.getTitle = this.getTitle
    }

    return new BreadcrumbDefinition(options)
  }
}
