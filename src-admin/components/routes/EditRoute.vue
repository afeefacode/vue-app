<template>
  <model-view
    v-bind="$attrs"
    :action="getAction"
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
          :to="getListLink()"
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
  props: ['detail', 'getAction', 'list', 'listLink']
})
export default class EditRoute extends Mixins(EditRouteMixin) {
  model = null

  get hasDetail () {
    return this.detail !== false
  }

  get hasList () {
    return !!this.listLink
  }

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
