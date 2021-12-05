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
import { NextRouteFilterSource } from '@a-vue/components/list/NextRouteFilterSource'
import { ListViewModel } from '@afeefa/api-resources-client'

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

  if (!Component.listViewConfig) {
    console.warn('A list route component must implement a static listViewConfig property.')
  }

  const request = new ListViewModel(Component.listViewConfig)
    // read from next route query string, but do not push
    // list component will be init with used_filters
    .filterSource(new NextRouteFilterSource(route), false)
    // read from history, but do not push
    // list component will be init with used_filters
    .historyKey(route.path, false)
    .initFilters({
      source: true,
      history: true
    })
    .getApiRequest()

  return new ListAction()
    .setRequest(request)
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
