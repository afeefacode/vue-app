import Vue from 'vue'

import AppBarButton from './app/AppBarButton'
import AppBarTitle from './app/AppBarTitle'
import DetailColumn from './detail/DetailColumn'
import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailProperty from './detail/DetailProperty'
import DetailTitle from './detail/DetailTitle'
import FlyingContext from './FlyingContext.vue'
import EditFormButtons from './form/EditFormButtons'
import RemoveButton from './form/RemoveButton'
import ListCard from './list/ListCard'
import ListColumnHeader from './list/ListColumnHeader'
import ListContent from './list/ListContent'
import ListMeta from './list/ListMeta'
import ListTitle from './list/ListTitle'
import ListView from './list/ListView'
import ModelCount from './model/ModelCount'
import ModelIcon from './model/ModelIcon'
import EditPage from './pages/EditPage'
import Start from './Start.vue'
import StickyFooter from './StickyFooter.vue'

Vue.component('ListCard', ListCard)
Vue.component('ListColumnHeader', ListColumnHeader)
Vue.component('ListContent', ListContent)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)

Vue.component('EditPage', EditPage)
Vue.component('EditFormButtons', EditFormButtons)
Vue.component('RemoveButton', RemoveButton)

Vue.component('ModelCount', ModelCount)
Vue.component('ModelIcon', ModelIcon)

Vue.component('DetailContent', DetailContent)
Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)
Vue.component('DetailProperty', DetailProperty)
Vue.component('DetailColumn', DetailColumn)

Vue.component('AppBarButton', AppBarButton)
Vue.component('AppBarTitle', AppBarTitle)

Vue.component('Start', Start)
Vue.component('FlyingContext', FlyingContext)
Vue.component('StickyFooter', StickyFooter)
