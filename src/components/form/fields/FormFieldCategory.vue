<template>
  <div v-if="categories_">
    <v-input
      ref="validationInput"
      :value="model[name]"
      :rules="validationRules"
      hide-details="auto"
    >
      <div>
        <v-label v-if="false">
          <a-row gap="2">
            <strong v-if="false">{{ label }}</strong>

            <a-popup-menu
              v-if="selectedCategories.length && isMultiple"
              :items="categories"
              :canSelectParent="false"
              @select="add"
            >
              <a-icon
                size="1.3rem"
                class="contextButton mt-n1"
                title="Bearbeiten"
              >
                $addIcon
              </a-icon>
            </a-popup-menu>
          </a-row>
        </v-label>

        <div
          v-if="selectedCategories.length"
          class="categories"
        >
          <a-category
            v-for="category in selectedCategories"
            :key="category.id"
            :category="{...category, parent: {title: label}}"
            theme="dark"
            :has="{remove: true}"
            :color="color"
            @remove="remove(category)"
          />
        </div>

        <a-popup-menu
          v-if="!selectedCategories.length"
          :items="categories_"
          :canSelectParent="false"
          class="mt-2"
          @select="add"
        >
          <a-icon-button
            small
            icon="$plusIcon"
            :text="label"
          />
        </a-popup-menu>

        <a-popup-menu
          v-else-if="isMultiple && selectedCategories.length < maxItems"
          :items="categories_"
          :canSelectParent="false"
          class="mt-1"
          @select="add"
        >
          <a>{{ label }} hinzufügen</a>
        </a-popup-menu>
      </div>
    </v-input>

    <div
      v-if="errorMessages.length"
      class="mt-4 error--text"
    >
      {{ errorMessages[0] }}
    </div>
  </div>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { FormFieldMixin } from '../FormFieldMixin'
import { ListAction } from '@a-vue/api-resources/ApiActions'

@Component({
  props: [
    'color',
    {
      getChildren: {
        default: () => i => i.children || []
      }
    },
    'categories'
  ]
})
export default class FormFieldCategory extends Mixins(FormFieldMixin) {
  categories_ = null
  errorMessages = []

  async created () {
    if (this.categories) {
      this.initCategories(this.categories)
    } else {
      await this.loadCategories()
    }

    this.$nextTick(() => { // wait for root v-if
      this.$refs.validationInput.validate(true)
    })
  }

  mounted () {

  }

  add (category) {
    if (this.isMultiple) {
      this.remove(category) // add again at end
      this.model[this.name].push(category)
    } else {
      this.model[this.name] = category
    }

    this.$emit('add', category)
  }

  remove (category) {
    if (this.isMultiple) {
      this.model[this.name] = this.selectedCategories.filter(c => c.id !== category.id)
    } else {
      this.model[this.name] = null
    }

    this.$emit('remove', category)
  }

  get selectedCategories () {
    if (this.isMultiple) {
      return this.model[this.name]
    } else {
      return [this.model[this.name]].filter(c => c)
    }
  }

  get isMultiple () {
    return this.field.getRelatedType().isList
  }

  async loadCategories () {
    const request = this.field.createOptionsRequest()
    const {models} = await ListAction.fromRequest(request).load()
    this.initCategories(models)
  }

  initCategories (models) {
    this.categories_ = models.map(m => this.initChildren(m))
  }

  initChildren (model) {
    let children = this.getChildren(model).map(c => ({
      ...c,
      color: this.color
    }))

    if (children.length === 1) {
      model = children[0]
      children = []
    }

    children = children.map(c => this.initChildren(c))

    return {
      ...model,
      color: this.color,
      children
    }
  }

  get maxItems () {
    return this.validator?.getParam('max') || 100000
  }
}

</script>


<style lang="scss" scoped>
:deep() .v-messages__message {
  color: #EE5252;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
</style>
