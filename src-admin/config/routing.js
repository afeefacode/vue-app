import CreateRoute from '@a-admin/components/routes/CreateRoute'
import DetailRoute from '@a-admin/components/routes/DetailRoute'
import EditRoute from '@a-admin/components/routes/EditRoute'
import ListRoute from '@a-admin/components/routes/ListRoute'
import ModelRoute from '@a-admin/components/routes/ModelRoute'
import { routeConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

export default routeConfigPlugin
  .defaultComponents({
    list: ListRoute,
    model: ModelRoute,
    detail: DetailRoute,
    edit: EditRoute,
    new: CreateRoute
  })

  .defaultBreadcrumbTitles({
    edit: 'Bearbeiten',
    new: 'Neu'
  })

  .defaultRoutePaths({
    edit: 'bearbeiten',
    new: 'neu'
  })
