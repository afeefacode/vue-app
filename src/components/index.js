import Vue from 'vue'

import EditForm from './form/EditForm'
import EditModal from './form/EditModal'
import FormFieldCheckbox from './form/fields/FormFieldCheckbox'
import FormFieldDate from './form/fields/FormFieldDate'
import FormFieldRadioGroup from './form/fields/FormFieldRadioGroup'
import FormFieldRichTextArea from './form/fields/FormFieldRichTextArea'
import FormFieldSearchSelect from './form/fields/FormFieldSearchSelect'
import FormFieldSelect from './form/fields/FormFieldSelect'
import FormFieldSelect2 from './form/fields/FormFieldSelect2'
import FormFieldText from './form/fields/FormFieldText'
import FormFieldTextArea from './form/fields/FormFieldTextArea'
import NestedEditForm from './form/NestedEditForm'
import ListFilterPage from './list/filters/ListFilterPage'
import ListFilterSearch from './list/filters/ListFilterSearch'
import ListFilterSelect from './list/filters/ListFilterSelect'

Vue.component('EditForm', EditForm)
Vue.component('NestedEditForm', NestedEditForm)
Vue.component('EditModal', EditModal)
Vue.component('FormFieldText', FormFieldText)
Vue.component('FormFieldTextArea', FormFieldTextArea)
Vue.component('FormFieldRichTextArea', FormFieldRichTextArea)
Vue.component('FormFieldRadioGroup', FormFieldRadioGroup)
Vue.component('FormFieldCheckbox', FormFieldCheckbox)
Vue.component('FormFieldDate', FormFieldDate)
Vue.component('FormFieldSearchSelect', FormFieldSearchSelect)
Vue.component('FormFieldSelect', FormFieldSelect)
Vue.component('FormFieldSelect2', FormFieldSelect2)
Vue.component('ListFilterPage', ListFilterPage)
Vue.component('ListFilterSearch', ListFilterSearch)
Vue.component('ListFilterSelect', ListFilterSelect)
