import CreateRoute2 from '@a-admin/components/routes/CreateRoute2'
import DetailRoute2 from '@a-admin/components/routes/DetailRoute2'
import EditRoute2 from '@a-admin/components/routes/EditRoute2'
import ListRoute2 from '@a-admin/components/routes/ListRoute2'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

export default routeConfigPlugin
  .router({
    linkActiveClass: 'active'
  })

  .defaultComponents({
    list: ListRoute2,
    new: CreateRoute2,
    detail: DetailRoute2,
    edit: EditRoute2
  })

  .defaultBreadcrumbTitles({
    edit: 'Bearbeiten',
    new: 'Neu'
  })

  .defaultRoutePaths({
    edit: 'bearbeiten',
    new: 'neu'
  })
