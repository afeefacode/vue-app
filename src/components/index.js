import Vue from 'vue'

import EditForm from './form/EditForm'
import FormFieldText from './form/fields/FormFieldText'
import FormFieldTextArea from './form/fields/FormFieldTextArea'
import FormField from './form/FormField'
import ListFilter from './list/ListFilter'

Vue.component('ListFilter', ListFilter)
Vue.component('EditForm', EditForm)
Vue.component('FormField', FormField)
Vue.component('FormFieldText', FormFieldText)
Vue.component('FormFieldTextArea', FormFieldTextArea)
