<template>
  <component
    :is="Component"
    v-if="isLoaded"
    :models="models"
    :meta="meta"
  />
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { ListAction } from './LoadActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

@Component
export default class ListRoute2 extends Vue {
  models = []
  isLoaded = false

  async beforeRouteEnter (to, from, next) {
    const routeDefinition = to.meta.routeDefinition
    const Component = routeDefinition.config.list
    const listConfig = Component.getListConfig(routeDefinition)

    let action = null
    if (listConfig.ModelClass) {
      action = listConfig.ModelClass.getAction(routeDefinition, 'list')
    } else {
      action = listConfig.action
    }

    const {models, meta} = await new ListAction()
      .setAction(action)
      .setFields(listConfig.fields)
      .setFiltersForRoute(to)
      .load()

    next(vm => {
      vm.models = models
      vm.meta = meta
      vm.isLoaded = true
    })
  }

  get Component () {
    return this.$routeDefinition.config.list
  }
}
</script>
