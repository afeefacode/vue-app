import Vue from 'vue'

import AppBarButton from './app/AppBarButton'
import AppBarTitle from './app/AppBarTitle'
import DetailColumn from './detail/DetailColumn'
import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailProperty from './detail/DetailProperty'
import DetailTitle from './detail/DetailTitle'
import Start from './Start.vue'
import ListCard from './list/ListCard'
import ListColumnHeader from './list/ListColumnHeader'
import ListContent from './list/ListContent'
import ListMeta from './list/ListMeta'
import ListTitle from './list/ListTitle'
import ListView from './list/ListView'
import ModelCount from './model/ModelCount'
import ModelIcon from './model/ModelIcon'
import CreatePage from './pages/CreatePage'
import DetailPage from './pages/DetailPage'
import EditPage from './pages/EditPage'
import ListPage from './pages/ListPage'

Vue.component('ListCard', ListCard)
Vue.component('ListColumnHeader', ListColumnHeader)
Vue.component('ListContent', ListContent)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)
Vue.component('ListPage', ListPage)

Vue.component('CreatePage', CreatePage)

Vue.component('EditPage', EditPage)

Vue.component('ModelCount', ModelCount)
Vue.component('ModelIcon', ModelIcon)

Vue.component('DetailContent', DetailContent)
Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)
Vue.component('DetailPage', DetailPage)
Vue.component('DetailProperty', DetailProperty)
Vue.component('DetailColumn', DetailColumn)

Vue.component('AppBarButton', AppBarButton)
Vue.component('AppBarTitle', AppBarTitle)

Vue.component('Start', Start)
