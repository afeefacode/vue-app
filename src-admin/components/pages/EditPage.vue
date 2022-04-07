<template>
  <div class="editPage">
    <app-bar-title
      :icon="_icon"
      :title="_title"
    />

    <app-bar-button v-if="$has.list">
      <v-btn
        :to="_listLink"
        small
      >
        Liste
      </v-btn>
    </app-bar-button>

    <app-bar-button v-if="$has.detail">
      <v-btn
        :to="model.getLink()"
        small
      >
        Ansehen
      </v-btn>
    </app-bar-button>

    <component
      :is="Component"
      v-if="false"
      :model="modelToEdit"
      :valid.sync="valid"
      :changed.sync="changed"
    />

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

    <a-row class="mt-8">
      <v-btn
        :disabled="!changed || !valid"
        color="green white--text"
        @click="save"
      >
        Speichern
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
import { Component, Mixins, Watch } from '@a-vue'
import { apiResources } from '@afeefa/api-resources-client'
import { EditPageMixin } from './EditPageMixin'

@Component({
  props: ['model', 'icon', 'title', 'listLink', 'getAction']
})
export default class EditPage extends Mixins(EditPageMixin) {
  $hasOptions = ['detail', {list: false}]

  model_ = null

  created () {
    if (!this.$parent.constructor.getEditRouteConfig) {
      console.warn('<edit-page> owner must provide a static getEditRouteConfig method.')
    }

    this.model_ = this.model
    this.reset()
    this.$emit('model', this.modelToEdit)
  }

  @Watch('model')
  modelChanged () {
    this.model_ = this.model
    this.reset()
    this.$emit('model', this.modelToEdit)
  }

  get editConfig () {
    return this.$parent.constructor.getEditRouteConfig(this.$route)
  }

  get modelUpateAction () {
    return this.editConfig.updateAction || this.ModelClass.getAction('save')
  }

  get _getAction () {
    if (this.getAction) {
      return this.getAction
    }
    return this.ModelClass.getAction('get')
  }

  get _icon () {
    return this.icon || this.model.getIcon()
  }

  get _title () {
    const title = this.modelToEdit.getTitle()
    if (title) {
      return title
    }

    if (this.title) {
      return this.title
    }

    const type = apiResources.getType(this.ModelClass.type)
    return type.t('TITLE_EMPTY')
  }

  get _listLink () {
    if (this.listLink) {
      if (typeof this.listLink === 'function') {
        return this.listLink()
      } else {
        return this.listLink
      }
    }
    return this.model.getLink('list')
  }

  createModelToEdit () {
    return this.model_.cloneForEdit(this.fields)
  }

  get saveParams () {
    return {
      id: this.model.id
    }
  }

  afterSave (model) {
    this.model_ = model
    this.reset()
    this.$emit('saved', model)
  }
}
</script>
