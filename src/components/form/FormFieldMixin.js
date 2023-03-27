import { Component, Vue } from '@a-vue'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: ['name', 'label', 'additionalRules', 'optionRequestParams']
})
export class FormFieldMixin extends Vue {
  get model () {
    let parent = this
    while (parent) {
      if (parent.EDIT_FORM) {
        return parent.modelToEdit
      }
      parent = parent.$parent
    }
  }

  get modelType () {
    return this.$apiResources.getType(this.model.type)
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
    return field.hasOptionsRequest()
  }

  fieldHasOptions () {
    const field = this.model.id
      ? this.modelType.getUpdateField(this.name)
      : this.modelType.getCreateField(this.name)
    return field.hasOptions()
  }

  async getSelectOptions (filters) {
    const field = this.model.id
      ? this.modelType.getUpdateField(this.name)
      : this.modelType.getCreateField(this.name)

    if (field.hasOptionsRequest()) {
      const request = field
        .createOptionsRequest()
        .addParams(this.optionRequestParams || {})
        .addFilters(filters)

      const {models} = await ListAction
        .fromRequest(request)
        .load()

      this.$emit('optionsLoaded', models, this.model)

      const options = []

      if (!this.validator || !this.validator.getParam('filled')) {
        options.push({
          itemText: 'Keine Auswahl',
          itemValue: null
        })
      }

      return [
        ...options,
        ...models.map(model => ({
          itemText: model.getTitle(),
          itemValue: model
        }))
      ]
    }

    if (field.hasOptions()) {
      let options = field.getOptions()

      if (!Array.isArray(options)) {
        options = Object.entries(options).map(([key, title]) => {
          return {
            itemText: title,
            itemValue: key
          }
        })
        return options
      }

      return options.map((value, index) => {
        if (typeof value === 'object') { // object option
          return {
            itemText: value.title,
            itemValue: value.value
          }
        } else { // scalar option
          return {
            itemText: value,
            itemValue: index
          }
        }
      })
    }
  }

  get validator () {
    const validator = this.field.getValidator()
    if (this.additionalRules) {
      validator.setAdditionalRules(this.additionalRules)
    }
    return this.field.getValidator()
  }

  get validationRules () {
    const label = this.label || this.name
    return (this.validator && this.validator.getRules(label)) || []
  }
}
