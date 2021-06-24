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
import { ListAction } from '@a-vue/api-resources/ApiActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

/**
 * keep track 'this' in beforeRouteEnter
 * in order to avoid rendering list pages with a stale set
 * of models because next(vm => ...) will first create the
 * list page with the existing set of models and update the
 * models afterwards.
 */
let lastVm = null

@Component
export default class ListRoute extends Vue {
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

    if (lastVm) {
      lastVm.isLoaded = false
    }

    next(vm => {
      vm.models = models
      vm.meta = meta
      vm.isLoaded = true

      lastVm = vm
    })
  }

  get Component () {
    return this.$routeDefinition.config.list
  }
}
</script>
