import CreateRoute from '@a-admin/components/routes/CreateRoute'
import DetailRoute from '@a-admin/components/routes/DetailRoute'
import EditRoute from '@a-admin/components/routes/EditRoute'
import ListRoute from '@a-admin/components/routes/ListRoute'
import ModelRoute from '@a-admin/components/routes/ModelRoute'
import { routeConfigPlugin as newRouteConfigPlugin } from '@a-vue/plugins/route-config/RouteConfigPlugin'

export const routeConfigPlugin = newRouteConfigPlugin
  .router({
    mode: 'history',
    base: process.env.BASE_URL
  })

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
