<template>
  <component
    :is="Component"
    v-if="model"
    :model="model"
  />
</template>

<script>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GetAction } from '@a-vue/api-resources/ApiActions'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

function load (route) {
  const routeDefinition = route.meta.routeDefinition
  const Component = routeDefinition.config.detail
  const detailConfig = Component.getDetailConfig(route)
  const action = detailConfig.action || detailConfig.ModelClass.getAction(routeDefinition, 'get')

  return new GetAction()
    .setAction(action)
    .setFields(detailConfig.fields)
    .setId(route.params[routeDefinition.idKey])
    .load()
}

let routerHookCalled = false

@Component
export default class DetailRoute extends Vue {
  model = null

  /**
   * triggered, when the route name changes
   * not triggered, when only route params change
   */
  async beforeRouteEnter (to, from, next) {
    routerHookCalled = true
    const result = await load(to)
    next(vm => {
      if (result !== false) {
        vm.model = result
      }
      routerHookCalled = false
    })
  }

  /**
   * triggered both, if route name or route params change
   */
  @Watch('$route.params')
  async routeParamsChanged () {
    if (routerHookCalled) {
      // set model to null in order to not recreate detail route's
      // child components with the stale model which is still active
      // in between resolving the route with next() + creating the
      // route detail component and resetting vm.model later in the callback
      this.model = null
      return
    }
    this.model = await load(this.$route)
  }

  // probably not needed
  // @Watch('$route.name')
  // async routeNameChanged () {
  //   if (routerHookCalled) {
  //     // this.model = null
  //   }
  // }

  get Component () {
    return this.$routeDefinition.config.detail
  }
}
</script>
