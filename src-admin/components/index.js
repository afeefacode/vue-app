import Vue from 'vue'

import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailTitle from './detail/DetailTitle'
import Index from './Index'
import ListCard from './list/ListCard'
import ListContent from './list/ListContent'
import ListMeta from './list/ListMeta'
import ListTitle from './list/ListTitle'
import ListView from './list/ListView'
import ModelCount from './model/ModelCount'
import ModelIcon from './model/ModelIcon'
import CreatePage from './routes/CreatePage'
import DetailPage from './routes/DetailPage'
import EditPage from './routes/EditPage'
import ListPage from './routes/ListPage'
import Splash from './Splash'

Vue.component('ListCard', ListCard)
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

Vue.component('Index', Index)
Vue.component('Splash', Splash)
