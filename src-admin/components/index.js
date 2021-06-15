import Vue from 'vue'

import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailTitle from './detail/DetailTitle'
import ListCard from './list/ListCard'
import ListContent from './list/ListContent'
import ListMeta from './list/ListMeta'
import ListTitle from './list/ListTitle'
import ListView from './list/ListView'
import ModelView from './model/ModelView'
import Splash from './Splash'

Vue.component('ListCard', ListCard)
Vue.component('ListContent', ListContent)
Vue.component('ListMeta', ListMeta)
Vue.component('ListTitle', ListTitle)
Vue.component('ListView', ListView)

Vue.component('ModelView', ModelView)

Vue.component('DetailContent', DetailContent)
Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)
Vue.component('Splash', Splash)
