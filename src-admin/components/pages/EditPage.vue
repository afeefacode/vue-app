<template>
  <div class="editPage">
    <v-row
      class="header ma-0"
      align="center"
    >
      <v-icon
        :color="_icon.color"
        size="3rem"
        v-text="_icon.icon"
      />

      <h2>{{ modelToEdit.getTitle() }}</h2>
    </v-row>

    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <v-btn
        v-if="$has.list"
        :to="_listLink"
      >
        Liste
      </v-btn>

      <v-btn
        v-if="$has.detail"
        :to="model.getLink()"
      >
        Ansehen
      </v-btn>
    </v-row>

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

    <v-row class="mt-8 gap-2">
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
    </v-row>
  </div>
</template>

<script>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import EditPageMixin from './EditPageMixin'

@Component({
  props: ['model', 'icon', 'listLink', 'getAction']
})
export default class EditPage extends Mixins(EditPageMixin) {
  $hasOptions = ['detail', {list: false}]

  model_ = null

  created () {
    if (!this.$parent.constructor.getEditConfig) {
      console.warn('<edit-page> owner must provide a static getEditConfig method.')
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
    return this.$parent.constructor.getEditConfig(this.$route)
  }

  get modelUpateAction () {
    return this.ModelClass.getAction(this.$routeDefinition, 'update')
  }

  get _getAction () {
    if (this.getAction) {
      return this.getAction
    }
    return this.ModelClass.getAction(this.$routeDefinition, 'get')
  }

  get _listLink () {
    if (this.listLink) {
      if (typeof this.listLink === 'function') {
        return this.listLink(this.$route.params)
      } else {
        return this.listLink
      }
    }
    return this.model.getLink('list')
  }

  get _icon () {
    if (this.icon) {
      return this.icon
    }
    return this.model.getIcon()
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


<style lang="scss" scoped>
.header {
  h2 {
    margin-left: 1rem;
  }
}

.buttons {
  gap: 1rem;
}

button {
  display: block;
  margin-bottom: 2rem;
}
</style>
