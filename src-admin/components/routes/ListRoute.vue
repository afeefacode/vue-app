<template>
  <div>
    <v-row
      class="buttons mr-0"
      justify="end"
    >
      <router-link
        v-if="config.add !== false"
        class="button"
        :to="newLink"
      >
        <v-btn>Neu</v-btn>
      </router-link>
    </v-row>

    <component
      :is="Component"
      :action="action"
      :fields="fields"
    />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ListRoute extends Vue {
  get config () {
    return this.$routeDefinition.config.routing.list
  }

  get action () {
    return this.config.action
  }

  get fields () {
    return this.config.fields
  }

  get newLink () {
    return this.config.Model.getLink('new')
  }

  get Component () {
    return this.config.Component
  }
}
</script>


<style lang="scss" scoped>
.button {
  display: block;
  margin-bottom: 2rem;
}
</style>
