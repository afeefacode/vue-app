import Vue from 'vue'

import EditForm from './form/EditForm'
import FormFieldSelect from './form/fields/FormFieldSelect'
import FormFieldSelect2 from './form/fields/FormFieldSelect2'
import FormFieldText from './form/fields/FormFieldText'
import FormFieldTextArea from './form/fields/FormFieldTextArea'
import ListFilterPage from './list/filters/ListFilterPage'
import ListFilterSearch from './list/filters/ListFilterSearch'
import ListFilter from './list/ListFilter'
import ListFilterRow from './list/ListFilterRow'

Vue.component('ListFilter', ListFilter)
Vue.component('EditForm', EditForm)
Vue.component('FormFieldText', FormFieldText)
Vue.component('FormFieldTextArea', FormFieldTextArea)
Vue.component('FormFieldSelect', FormFieldSelect)
Vue.component('FormFieldSelect2', FormFieldSelect2)
Vue.component('ListFilterPage', ListFilterPage)
Vue.component('ListFilterSearch', ListFilterSearch)
Vue.component('ListFilterRow', ListFilterRow)
