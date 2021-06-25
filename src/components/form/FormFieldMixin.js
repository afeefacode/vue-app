import { apiResources } from '@afeefa/api-resources-client'
import { Component, Vue } from 'vue-property-decorator'

import EditForm from './EditForm.vue'

@Component({
  props: ['name', 'label']
})
export default class FormField extends Vue {
  get model () {
    let parent = this
    while (parent) {
      if (parent instanceof EditForm) {
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

  get validator () {
    return this.field.getValidator()
  }
}
