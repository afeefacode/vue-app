<template>
  <model-view
    :id="id"
    :action="action"
    :fields="fields"
    :model.sync="model"
  >
    <router-view
      v-if="model"
      :model="model"
    />
  </model-view>
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class ModelRoute extends Vue {
  model = null

  get config () {
    return this.$routeDefinition.config.routing.model
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

  get action () {
    return this.config.action
  }

  @Watch('model')
  modelChanged () {
    if (this.model) {
      // update breadcrumb title
      const detailDefinition = this.$routeDefinition.getChild('detail')
      detailDefinition.setCustomBreadcrumbTitle(this.model.getTitle())
    }
  }
}
</script>
