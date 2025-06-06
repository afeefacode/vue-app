import Vue from 'vue'

import AppBarButton from './app/AppBarButton'
import AppBarTitle from './app/AppBarTitle'
import CollapsibleSection from './CollapsibleSection'
import SearchSelectNavigator from './controls/SearchSelectNavigator'
import DetailColumn from './detail/DetailColumn'
import DetailContent from './detail/DetailContent'
import DetailMeta from './detail/DetailMeta'
import DetailProperty from './detail/DetailProperty'
import DetailTitle from './detail/DetailTitle'
import EditableDetailProperty from './detail/EditableDetailProperty'
import DetailOrInfo from './DetailOrInfo'
import FlyingContext from './FlyingContext'
import EditFormButtons from './form/EditFormButtons'
import RemoveButton from './form/RemoveButton'
import RemoveDialog from './form/RemoveDialog'
import HSeparator from './HSeparator'
import ListColumnHeader from './list/ListColumnHeader'
import ListColumnSelector from './list/ListColumnSelector'
import ListConfig from './list/ListConfig'
import ListView from './list/ListView'
import ModelCount from './model/ModelCount'
import ModelIcon from './model/ModelIcon'
import EditPage from './pages/EditPage'
import InformationBarItem from './sidebar/InformationBarItem'
import Start from './Start'
import StickyFooter from './StickyFooter'
import CollapseTransition from './transitions/CollapseTransition'

Vue.component('ListColumnHeader', ListColumnHeader)
Vue.component('ListConfig', ListConfig)
Vue.component('ListView', ListView)
Vue.component('ListColumnSelector', ListColumnSelector)

Vue.component('EditPage', EditPage)
Vue.component('EditFormButtons', EditFormButtons)
Vue.component('RemoveButton', RemoveButton)
Vue.component('RemoveDialog', RemoveDialog)

Vue.component('ModelCount', ModelCount)
Vue.component('ModelIcon', ModelIcon)

Vue.component('DetailContent', DetailContent)
Vue.component('DetailMeta', DetailMeta)
Vue.component('DetailTitle', DetailTitle)
Vue.component('DetailProperty', DetailProperty)
Vue.component('EditableDetailProperty', EditableDetailProperty)
Vue.component('DetailColumn', DetailColumn)

Vue.component('AppBarButton', AppBarButton)
Vue.component('AppBarTitle', AppBarTitle)

Vue.component('SearchSelectNavigator', SearchSelectNavigator)

Vue.component('HSeparator', HSeparator)
Vue.component('CollapsibleSection', CollapsibleSection)
Vue.component('CollapseTransition', CollapseTransition)

Vue.component('Start', Start)
Vue.component('FlyingContext', FlyingContext)
Vue.component('StickyFooter', StickyFooter)
Vue.component('InformationBarItem', InformationBarItem)
Vue.component('DetailOrInfo', DetailOrInfo)
