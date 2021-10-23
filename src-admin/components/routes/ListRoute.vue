<template>
  <component
    :is="Component"
    v-if="isLoaded"
    :models="models"
    :meta="meta"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
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

function load (route) {
  const routeDefinition = route.meta.routeDefinition
  const Component = routeDefinition.config.list
  const listConfig = Component.getListConfig(route)
  const action = listConfig.action || listConfig.ModelClass.getAction('list')

  return new ListAction()
    .setAction(action)
    .setFields(listConfig.fields)
    .setScopes(listConfig.scopes)
    .setFiltersForRoute(route)
    .load()
}

let routerHookCalled = false

@Component
export default class ListRoute extends Vue {
  models = null
  meta = null
  isLoaded = false

  async beforeRouteEnter (to, from, next) {
    routerHookCalled = true
    const result = await load(to)

    if (lastVm) {
      lastVm.isLoaded = false
    }

    next(vm => {
      if (result !== false) {
        const {models, meta} = result
        vm.models = models
        vm.meta = meta
        vm.isLoaded = true
      }

      lastVm = vm
      routerHookCalled = false
    })
  }

  /**
   * triggered both, if route name or route params change
   */
  @Watch('$route.params')
  async routeParamsChanged () {
    if (routerHookCalled) {
      return
    }

    if (!this.isLoaded) {
      const result = await load(this.$route)

      if (result !== false) {
        const {models, meta} = result
        this.models = models
        this.meta = meta
        this.isLoaded = true
      }
    }
  }

  get Component () {
    return this.$routeDefinition.config.list
  }
}
</script>
