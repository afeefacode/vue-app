<template>
  <model-view
    :id="id"
    :action="getAction"
    :fields="fields"
    :model.sync="model"
  >
    <template v-if="model">
      <v-row
        class="buttons mr-0"
        justify="end"
      >
        <router-link
          v-if="hasList"
          class="button"
          :to="listLink"
        >
          <v-btn>Liste</v-btn>
        </router-link>

        <router-link
          v-if="hasDetail"
          :to="model.getLink()"
        >
          <v-btn>Ansehen</v-btn>
        </router-link>
      </v-row>

      <component
        :is="Component"
        :model="modelToEdit"
        :valid.sync="valid"
        :changed.sync="changed"
      />

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

@Component
export default class EditRoute extends Mixins(EditRouteMixin) {
  model = null

  get config () {
    return this.$routeDefinition.config.routing.edit
  }

  get idKey () {
    return this.$routeDefinition.idKey
  }

  get id () {
    return this.$route.params[this.idKey]
  }

  get fields () {
    return this.config.fields
  }

  get hasDetail () {
    return this.config.detail !== false
  }

  get hasList () {
    return !!this.config.listLink
  }

  get listLink () {
    if (this.config.listLink) {
      return this.config.listLink(this.$route.params)
    }
    return this.model.getLink('list')
  }

  get getAction () {
    return this.config.getAction
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
}
</script>


<style lang="scss" scoped>
button {
  display: block;
  margin-bottom: 2rem;
}

.submit {
  margin-top: 2rem;
}
</style>
