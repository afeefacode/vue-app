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
  const Component = routeDefinition.config.edit
  const editConfig = Component.getEditConfig(route)

  let action = null
  if (editConfig.ModelClass) {
    action = editConfig.ModelClass.getAction(routeDefinition, 'get')
  } else {
    action = editConfig.getAction
  }

  return new GetAction()
    .setAction(action)
    .setFields(editConfig.fields)
    .setId(route.params[routeDefinition.idKey])
    .load()
}

let routerHookCalled = false

@Component
export default class EditRoute extends Vue {
  model = null

  /**
   * triggered, when the route name changes
   * not triggered, when only route params change
   */
  async beforeRouteEnter (to, from, next) {
    routerHookCalled = true
    const model = await load(to)
    next(vm => {
      vm.model = model
      routerHookCalled = false
    })
  }

  /**
   * triggered both, if route name or route params change
   * not triggered, when only params change
   */
  @Watch('$route.params')
  async routeParamsChanged () {
    if (routerHookCalled) {
      // set model to null in order to not recreate detail route's
      // child components with the state model before vm.model is
      // set in the router hook
      this.model = null
      return
    }
    this.model = await load(this.$route)
  }

  get Component () {
    return this.$routeDefinition.config.edit
  }
}
</script>
