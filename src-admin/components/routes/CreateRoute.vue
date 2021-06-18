<template>
  <div>
    <v-row
      class="header ma-0"
      align="center"
    >
      <v-icon
        :color="icon.color"
        size="3rem"
        v-text="icon.icon"
      />

      <h2>{{ modelToEdit.getTitle() || title }}</h2>
    </v-row>

    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <router-link :to="getListLink()">
        <v-btn>Liste</v-btn>
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

@Component({
  props: ['icon', 'title', 'createModel', 'list', 'listLink']
})
export default class CreateRoute extends Mixins(EditRouteMixin) {
  created () {
    this.reset()
  }

  createModelToEdit () {
    return this.createModel(this.fields)
  }

  get hasList () {
    return !!this.listLink
  }

  getListLink () {
    if (this.listLink) {
      return this.listLink(this.$route.params)
    }
    return this.modelToEdit.getLink('list')
  }

  saved (model) {
    this.ignoreChanged = true
    this.$router.push(model.getLink('edit'))
  }
}
</script>


<style lang="scss" scoped>
.header {
  h2 {
    margin-left: 1rem;
  }
}

button {
  display: block;
  margin-bottom: 2rem;
}

.submit {
  margin-top: 2rem;
}
</style>
