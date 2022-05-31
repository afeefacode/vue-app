import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

export default routeConfigPlugin
  .router({
    linkActiveClass: 'active'
  })

  .defaultBreadcrumbTitles({
    edit: 'Bearbeiten',
    new: 'Neu'
  })

  .defaultRoutePaths({
    edit: 'bearbeiten',
    new: 'neu'
  })
