import Vue from 'vue'

import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailTitle from './detail/DetailTitle'
import ListCard from './list/ListCard'
import ListContent from './list/ListContent'
import ListMeta from './list/ListMeta'
import ListTitle from './list/ListTitle'
import ListView from './list/ListView'
import ModelCount from './model/ModelCount'
import ModelIcon from './model/ModelIcon'
import ModelView from './model/ModelView'
import CreateRoute from './routes/CreateRoute'
import DetailRoute from './routes/DetailRoute'
import EditRoute from './routes/EditRoute'
import ListRoute from './routes/ListRoute'
import Splash from './Splash'

Vue.component('ListCard', ListCard)
Vue.component('ListContent', ListContent)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)
Vue.component('ListRoute', ListRoute)

Vue.component('CreateRoute', CreateRoute)
Vue.component('EditRoute', EditRoute)

Vue.component('ModelCount', ModelCount)
Vue.component('ModelIcon', ModelIcon)
Vue.component('ModelView', ModelView)

Vue.component('DetailRoute', DetailRoute)
Vue.component('DetailContent', DetailContent)
Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)

Vue.component('Index', Index)
Vue.component('Splash', Splash)
