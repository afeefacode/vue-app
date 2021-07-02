import { ListAction } from '@a-vue/api-resources/ApiActions'
import { apiResources } from '@afeefa/api-resources-client'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  props: ['name', 'label']
})
export class FormFieldMixin extends Vue {
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
    const field = this.model.id
      ? this.modelType.getUpdateField(this.name)
      : this.modelType.getCreateField(this.name)
    return field.getOptionsRequest()
  }

  async getSelectOptions (filters) {
    const field = this.model.id
      ? this.modelType.getUpdateField(this.name)
      : this.modelType.getCreateField(this.name)

    const request = field
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
