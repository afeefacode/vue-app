import { ListAction } from '@a-vue/api-resources/ApiActions'
import { apiResources } from '@afeefa/api-resources-client'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['name', 'label']
})
export default class FormField extends Vue {
  get model () {
    let parent = this
    while (parent) {
      if (parent.EDIT_FORM) {
        return parent.model
      }
      parent = parent.$parent
    }
  }

  get modelType () {
    return apiResources.getType(this.model.type)
  }

  get field () {
    const update = !!this.model.id
    const fields = update
      ? this.modelType.getUpdateFields()
      : this.modelType.getCreateFields()
    const field = fields[this.name]

    if (!field) {
      console.warn(`Field "${this.name}" not configured for type ${this.modelType.name}#${update ? 'update' : 'create'}`)
    }

    return field
  }

  fieldHasOptionsRequest () {
    return this.modelType
      .getUpdateField(this.name)
      .getOptionsRequest()
  }

  async getSelectOptions (filters) {
    const request = this.modelType
      .getUpdateField(this.name)
      .getOptionsRequest()
      .addFilters(filters)

    const {models} = await new ListAction()
      .setRequest(request)
      .noEvents()
      .load()

    return models.map(model => ({
      itemText: model.getTitle(),
      itemValue: model
    }))
  }

  get validator () {
    return this.field.getValidator()
  }
}
