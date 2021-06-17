import { BreadcrumbDefinition } from './BreadcrumbDefinition'

export class BreadcrumbSetDefinition {
  constructor ({
    name,
    titles,
    getTitle,
    breadcrumbTitles,
    children = []
  }) {
    this.name = name
    this.titles = titles
    this.getTitle = getTitle
    this.breadcrumbTitles = breadcrumbTitles
    this.children = children
  }

  getDefinitions () {
    this.children.forEach(c => {
      c.namePrefix = this.name
    })

    return this.breadcrumb('list', this.titles.list, [
      this.breadcrumb('new', this.breadcrumbTitles.new),
      this.breadcrumb('detail', this.titles.detail, [
        this.breadcrumb('edit', this.breadcrumbTitles.edit),
        ...this.children
      ])
    ])
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
