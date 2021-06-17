<template>
  <div>
    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <router-link :to="listLink">
        <v-btn>Liste</v-btn>
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
        Anlegen
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
import { Component, Mixins } from 'vue-property-decorator'
import EditRouteMixin from './EditRouteMixin'

@Component
export default class CreateRoute extends Mixins(EditRouteMixin) {
  created () {
    this.reset()
  }

  createModelToEdit () {
    return this.config.Model.createForNew(this.fields)
  }

  get config () {
    return this.$routeDefinition.config.routing.new
  }

  get fields () {
    return this.config.fields
  }

  get listLink () {
    return this.config.Model.getLink('list')
  }

  saved (model) {
    this.ignoreChanged = true
    this.$router.push(model.getLink('edit'))
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
