import Vue from 'vue'

import EditForm from './form/EditForm'
import EditModal from './form/EditModal'
import FormFieldCategory from './form/fields/FormFieldCategory'
import FormFieldCheckbox from './form/fields/FormFieldCheckbox'
import FormFieldCheckboxGroup from './form/fields/FormFieldCheckboxGroup'
import FormFieldDate from './form/fields/FormFieldDate'
import FormFieldRadioGroup from './form/fields/FormFieldRadioGroup'
import FormFieldRichTextArea from './form/fields/FormFieldRichTextArea'
import FormFieldSearchSelect from './form/fields/FormFieldSearchSelect'
import FormFieldSelect from './form/fields/FormFieldSelect'
import FormFieldSelect2 from './form/fields/FormFieldSelect2'
import FormFieldText from './form/fields/FormFieldText'
import FormFieldTextArea from './form/fields/FormFieldTextArea'
import FormFieldTime from './form/fields/FormFieldTime'
import NestedEditForm from './form/NestedEditForm'
import ListFilterDate from './list/filters/ListFilterDate'
import ListFilterPage from './list/filters/ListFilterPage'
import ListFilterSearch from './list/filters/ListFilterSearch'
import ListFilterSearchSelect from './list/filters/ListFilterSearchSelect'
import ListFilterSelect from './list/filters/ListFilterSelect'

Vue.component('EditForm', EditForm)
Vue.component('NestedEditForm', NestedEditForm)
Vue.component('EditModal', EditModal)
Vue.component('FormFieldText', FormFieldText)
Vue.component('FormFieldTextArea', FormFieldTextArea)
Vue.component('FormFieldRichTextArea', FormFieldRichTextArea)
Vue.component('FormFieldRadioGroup', FormFieldRadioGroup)
Vue.component('FormFieldCheckboxGroup', FormFieldCheckboxGroup)
Vue.component('FormFieldCategory', FormFieldCategory)
Vue.component('FormFieldCheckbox', FormFieldCheckbox)
Vue.component('FormFieldDate', FormFieldDate)
Vue.component('FormFieldTime', FormFieldTime)
Vue.component('FormFieldSearchSelect', FormFieldSearchSelect)
Vue.component('FormFieldSelect', FormFieldSelect)
Vue.component('FormFieldSelect2', FormFieldSelect2)
Vue.component('ListFilterPage', ListFilterPage)
Vue.component('ListFilterSearch', ListFilterSearch)
Vue.component('ListFilterSelect', ListFilterSelect)
Vue.component('ListFilterSearchSelect', ListFilterSearchSelect)
Vue.component('ListFilterDate', ListFilterDate)
