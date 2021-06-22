<template>
  <model-view
    ref="modelView"
    v-bind="$attrs"
    :action="getAction"
    :model.sync="model"
  >
    <template v-if="model">
      <v-row
        class="header ma-0"
        align="center"
      >
        <v-icon
          :color="icon.color"
          size="3rem"
          v-text="icon.icon"
        />

        <h2>{{ model.getTitle() }}</h2>
      </v-row>

      <v-row
        class="buttons mr-0"
        justify="end"
      >
        <router-link
          v-if="$has.list"
          class="button"
          :to="getListLink()"
        >
          <v-btn>Liste</v-btn>
        </router-link>

        <router-link
          v-if="$has.detail"
          :to="model.getLink()"
        >
          <v-btn>Ansehen</v-btn>
        </router-link>
      </v-row>

      <edit-form
        :model="modelToEdit"
        :valid.sync="valid"
        :changed.sync="changed"
      >
        <template #fields>
          <slot name="fields" />
        </template>
      </edit-form>

      <v-row class="submit">
        <v-btn
          :disabled="!changed || !valid"
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
    </template>
  </model-view>
</template>

<script>
import { Component, Mixins, Watch } from 'vue-property-decorator'
import EditRouteMixin from './EditRouteMixin'

@Component({
  props: ['icon', 'getAction', 'listLink']
})
export default class EditRoute extends Mixins(EditRouteMixin) {
  $hasOptions = ['detail', 'list']

  model = null

  getListLink () {
    if (this.listLink) {
      return this.listLink(this.$route.params)
    }
    return this.model.getLink('list')
  }

  @Watch('model')
  modelChanged () {
    this.reset()
  }

  createModelToEdit () {
    return this.model.cloneForEdit(this.fields)
  }

  get saveParams () {
    return {
      id: this.model.id
    }
  }

  saved (model) {
    // reload model and recreate edit model
    this.$refs.modelView.load()
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

.submit {
  margin-top: 2rem;
}
</style>
