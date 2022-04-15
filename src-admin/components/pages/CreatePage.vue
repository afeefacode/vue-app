<template>
  <div class="createPage">
    <app-bar-title
      :icon="_icon"
      :title="_title"
    />

    <app-bar-button>
      <v-btn
        :to="_listLink"
        small
      >
        Liste
      </v-btn>
    </app-bar-button>

    <edit-form
      :model="modelToEdit"
      :valid.sync="valid"
      :changed.sync="changed"
    >
      <template #fields>
        <slot
          name="fields"
          :model="modelToEdit"
        />
      </template>
    </edit-form>

    <a-row class="mt-6">
      <v-btn
        :disabled="!changed || !valid"
        @click="save"
      >
        Anlegen
      </v-btn>

      <v-btn
        v-if="changed"
        text
        @click="reset"
      >
        Zurücksetzen
      </v-btn>
    </a-row>
  </div>
</template>

<script>
import { Component, Mixins } from '@a-vue'
import { EditPageMixin } from './EditPageMixin'

@Component({
  props: ['icon', 'title', 'createModel', 'listLink']
})
export default class CreatePage extends Mixins(EditPageMixin) {
  created () {
    if (!this.$parent.constructor.createRouteConfig) {
      console.warn('<create-page> owner must provide a static createRouteConfig method.')
    }

    this.reset()
    this.$emit('model', this.modelToEdit)
  }

  get editConfig () {
    return this.$parent.constructor.createRouteConfig
  }

  get modelUpateAction () {
    return this.editConfig.createAction || this.ModelClass.getAction('save')
  }

  get _icon () {
    return this.icon || this.modelToEdit.getIcon()
  }

  get _title () {
    const title = this.modelToEdit.getTitle()
    if (title) {
      return title
    }

    if (this.title) {
      return this.title
    }

    const type = this.$apiResources.getType(this.ModelClass.type)
    return type.t('TITLE_NEW')
  }

  get _listLink () {
    if (this.listLink) {
      if (typeof this.listLink === 'function') {
        return this.listLink()
      } else {
        return this.listLink
      }
    }
    return this.modelToEdit.getLink('list')
  }

  createModelToEdit () {
    if (this.createModel) {
      return this.createModel(this.fields)
    }
    return this.ModelClass.createForNew(this.fields)
  }

  saved (model) {
    this.ignoreChanged = true
    this.$router.push(model.getLink('edit'))
  }
}
</script>
