import CreateRoute from '@a-admin/components/routes/CreateRoute'
import DetailRoute from '@a-admin/components/routes/DetailRoute'
import EditRoute from '@a-admin/components/routes/EditRoute'
import ListRoute from '@a-admin/components/routes/ListRoute'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

export default routeConfigPlugin
  .router({
    linkActiveClass: 'active'
  })

  .defaultComponents({
    list: ListRoute,
    new: CreateRoute,
    detail: DetailRoute,
    edit: EditRoute
  })

  .defaultBreadcrumbTitles({
    edit: 'Bearbeiten',
    new: 'Neu'
  })

  .defaultRoutePaths({
    edit: 'bearbeiten',
    new: 'neu'
  })
